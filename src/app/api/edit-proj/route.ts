import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';
import type { EditProjectPayload } from '@/app/hooks/useEditProject';


export async function PUT(req: NextRequest) {
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

    // รับข้อมูลจาก body
    const {
      id, name, description, access_code, bucket_name, status,
      progress_percentage, start_date, estimated_end_date, actual_end_date, budget
    } = await req.json();

    // ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      return NextResponse.json({ error: 'กรุณาระบุ ID ของโปรเจ็ค' }, { status: 400 });
    }

    // ตรวจสอบว่าโปรเจ็คมีอยู่จริงหรือไม่
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id, created_by, access_code')
      .eq('id', id)
      .single();

    if (checkError || !existingProject) {
      return NextResponse.json({ error: 'ไม่พบโปรเจ็คที่ต้องการแก้ไข' }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์ในการแก้ไข (เจ้าของโปรเจ็คหรือ admin เท่านั้น)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const isOwner = existingProject.created_by === userId;
    const isAdmin = userData?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ในการแก้ไขโปรเจ็คนี้' }, { status: 403 });
    }

    // ตรวจสอบ access_code ซ้ำ (ถ้ามีการเปลี่ยนแปลง)
    if (access_code && access_code !== existingProject.access_code) {
      const { data: duplicateAccessCode, error: duplicateError } = await supabase
        .from('projects')
        .select('id')
        .eq('access_code', access_code)
        .neq('id', id)
        .single();
        
      if (duplicateError && duplicateError.code !== 'PGRST116') { // PGRST116 = no rows returned
        return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบ access_code' }, { status: 500 });
      }
      
      if (duplicateAccessCode) {
        return NextResponse.json({ error: 'access_code นี้มีอยู่แล้ว กรุณาใช้ access_code อื่น' }, { status: 400 });
      }
    }

    // เตรียมข้อมูลสำหรับ update
    const updateData: EditProjectPayload = {} as EditProjectPayload;
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (access_code !== undefined) updateData.access_code = access_code;
    if (bucket_name !== undefined) updateData.bucket_name = bucket_name;
    
    // ตรวจสอบ status ที่ถูกต้อง
    if (status !== undefined) {
      const validStatuses = ['active', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          error: `ค่า status ไม่ถูกต้อง ต้องเป็นหนึ่งใน: ${validStatuses.join(', ')}` 
        }, { status: 400 });
      }
      updateData.status = status;
    }
    
    if (progress_percentage !== undefined) {
      const progress = typeof progress_percentage === 'number' 
        ? progress_percentage 
        : progress_percentage ? Number(progress_percentage) : null;
      
      // ตรวจสอบค่า progress_percentage
      if (progress !== null && (progress < 0 || progress > 100)) {
        return NextResponse.json({ 
          error: 'progress_percentage ต้องอยู่ระหว่าง 0-100' 
        }, { status: 400 });
      }
      
      updateData.progress_percentage = progress;
    }
    
    if (start_date !== undefined) updateData.start_date = start_date;
    if (estimated_end_date !== undefined) updateData.estimated_end_date = estimated_end_date;
    if (actual_end_date !== undefined) updateData.actual_end_date = actual_end_date;
    if (budget !== undefined) {
      updateData.budget = typeof budget === 'number' 
        ? budget 
        : budget ? Number(budget) : null;
    }

    // ตรวจสอบว่ามีข้อมูลที่จะอัปเดตหรือไม่
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'ไม่มีข้อมูลที่จะอัปเดต' }, { status: 400 });
    }

    // อัปเดตข้อมูลโปรเจ็ค
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ 
      message: 'อัปเดตโปรเจ็คสำเร็จ',
      project: updatedProject
    })
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie)
    })

    return successResponse;

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// เพิ่ม DELETE method สำหรับลบโปรเจ็ค
export async function DELETE(req: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createSupabaseServerClient(req, response)

    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ที่ login' }, { status: 401 });
    }

    const userId = user.id;

    // รับ project id จาก URL parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'กรุณาระบุ ID ของโปรเจ็ค' }, { status: 400 });
    }

    // ตรวจสอบว่าโปรเจ็คมีอยู่จริงหรือไม่
    const { data: existingProject, error: checkError } = await supabase
      .from('projects')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (checkError || !existingProject) {
      return NextResponse.json({ error: 'ไม่พบโปรเจ็คที่ต้องการลบ' }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์ในการลบ (เจ้าของโปรเจ็คหรือ admin เท่านั้น)
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const isOwner = existingProject.created_by === userId;
    const isAdmin = userData?.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ในการลบโปรเจ็คนี้' }, { status: 403 });
    }

    // ลบโปรเจ็ค
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ 
      message: 'ลบโปรเจ็คสำเร็จ'
    })
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie)
    })

    return successResponse;

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 