import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(req, response);
    const { id } = await context.params;

    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ที่ login' }, { status: 401 });
    }

    // ตรวจสอบว่าโปรเจ็คมีอยู่จริง
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      console.error('Project not found error:', projectError);
      return NextResponse.json({ error: 'ไม่พบโปรเจ็ค' }, { status: 404 });
    }

    // ดึงรูปภาพของโปรเจ็ค เรียงตามวันที่อัปโหลด (ใหม่สุดก่อน) - ใช้ตาราง photos
    const { data: images, error: imagesError } = await supabase
      .from('photos')
      .select(`
      *
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (imagesError) {
      console.error('Images fetch error:', imagesError);
      return NextResponse.json({ error: imagesError.message }, { status: 500 });
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({
      status: 200,
      message: 'ดึงรายการรูปภาพสำเร็จ',
      data: images || [],
      count: images ? images.length : 0
    }, { status: 200 });



    return successResponse;

  } catch (err: unknown) {
    console.error('Get images error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 