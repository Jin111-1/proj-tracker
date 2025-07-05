import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// ฟังก์ชันสร้าง access_code แบบสุ่ม
function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
  try {
    // สร้าง response object สำหรับจัดการ cookies
    const response = NextResponse.next()
    
    // ใช้ createSupabaseServerClient จาก supabaseCookie.ts
    const supabase = createSupabaseServerClient(req, response)

    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ที่ login' }, { status: 401 });
    }

    const userId = user.id;
    console.log('userId from auth:', userId);

    // รับค่าทุกฟิลด์จาก body
    const {
      name, description, access_code: providedAccessCode, bucket_name, status,
      progress_percentage, start_date, estimated_end_date, actual_end_date, budget
    } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อโปรเจ็ค' }, { status: 400 });
    }
    
    // สร้าง access_code หรือใช้ที่ระบุมา
    let access_code = providedAccessCode;
    
    // ถ้าไม่ได้ระบุ access_code ให้สร้างใหม่
    if (!access_code) {
      access_code = generateAccessCode();
    }
    
    // ตรวจสอบว่า access_code ซ้ำหรือไม่
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id')
      .eq('access_code', access_code)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบ access_code' }, { status: 500 });
    }
    
    if (existingProject) {
      return NextResponse.json({ error: 'access_code นี้มีอยู่แล้ว กรุณาใช้ access_code อื่น' }, { status: 400 });
    }
    
    // เตรียมข้อมูลสำหรับ insert
    const insertData: any = {
      name,
      description,
      access_code,
      created_by: userId,
      bucket_name: bucket_name || null,
      status: status || null,
      progress_percentage: typeof progress_percentage === 'number' ? progress_percentage : progress_percentage ? Number(progress_percentage) : null,
      start_date: start_date || null,
      estimated_end_date: estimated_end_date || null,
      actual_end_date: actual_end_date || null,
      budget: typeof budget === 'number' ? budget : budget ? Number(budget) : null,
    };
    
    // 3. Insert project (created_by = userId)
    const { data, error } = await supabase
      .from('projects')
      .insert([insertData])
      .select('id')
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const project_id = data.id;
    
    // 4. Update bucket_name = project_id ถ้าไม่ได้ระบุ bucket_name
    if (!bucket_name) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ bucket_name: project_id })
        .eq('id', project_id);
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }
    
    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ 
      project_id, 
      bucket_name: bucket_name || project_id,
      access_code: access_code // ส่ง access_code กลับไปด้วย
    })
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie)
    })

    return successResponse;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
