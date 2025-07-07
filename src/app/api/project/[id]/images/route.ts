import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

export async function GET(
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

    // ดึงรูปภาพของโปรเจ็ค เรียงตามวันที่อัปโหลด (ใหม่สุดก่อน) - ใช้ตาราง photos
    const { data: images, error: imagesError } = await supabase
      .from('photos')
      .select(`
        id,
        file_name,
        file_path,
        file_size,
        description,
        created_at,
        uploaded_by,
        users!photos_uploaded_by_fkey(email, full_name)
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json(images || []);

    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;

  } catch (err: any) {
    console.error('Get images error:', err);
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 