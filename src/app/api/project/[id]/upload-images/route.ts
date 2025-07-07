import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(req, response);
    const { id } = params;

    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ที่ login' }, { status: 401 });
    }

    // ตรวจสอบว่าโปรเจ็คมีอยู่จริง
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'ไม่พบโปรเจ็ค' }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์ (เฉพาะแอดมินหรือเจ้าของโปรเจ็ค)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin' && project.created_by !== user.id) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์อัปโหลดรูปภาพ' }, { status: 403 });
    }

    // รับไฟล์จาก FormData
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ที่อัปโหลด' }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of files) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        continue; // ข้ามไฟล์ที่ไม่ใช่รูปภาพ
      }

      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue; // ข้ามไฟล์ที่ใหญ่เกินไป
      }

      // สร้างชื่อไฟล์ที่ไม่ซ้ำ
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const filePath = `project-images/${id}/${fileName}`;

      // อัปโหลดไฟล์ไปยัง Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue; // ข้ามไฟล์ที่อัปโหลดไม่สำเร็จ
      }

      // สร้าง URL สำหรับเข้าถึงไฟล์
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      // บันทึกข้อมูลรูปภาพลงฐานข้อมูล (ใช้ตาราง photos)
      const { data: imageData, error: dbError } = await supabase
        .from('photos')
        .insert({
          project_id: id,
          file_name: file.name,
          file_path: urlData.publicUrl,
          file_size: file.size,
          uploaded_by: user.id
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        // ลบไฟล์ที่อัปโหลดแล้วถ้าบันทึกฐานข้อมูลไม่สำเร็จ
        await supabase.storage
          .from('project-images')
          .remove([filePath]);
        continue;
      }

      uploadedImages.push(imageData);
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ 
      message: `อัปโหลดสำเร็จ ${uploadedImages.length} ไฟล์`,
      images: uploadedImages
    });

    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;

  } catch (err: any) {
    console.error('Upload images error:', err);
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 