import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

export async function GET(request: NextRequest) {
  try {
    // สร้าง response object สำหรับจัดการ cookies
    const response = NextResponse.next();
    
    // ใช้ createSupabaseServerClient จาก supabaseCookie.ts
    const supabase = createSupabaseServerClient(request, response);
    
    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let projects;
    let error;

    // ตรวจสอบว่าเป็น admin หรือ guest user จาก email format
    // admin จะมี email จริง ส่วน guest user จะมี email format: {access_code}@example.com
    const isGuestUser = user.email?.includes('@example.com');
    
    if (isGuestUser) {
      // ถ้าเป็น guest user ให้ดึงโปรเจ็คที่ตรงกับ access code
      const accessCode = user.email?.split('@')[0];
      
      console.log('Guest user email:', user.email);
      console.log('Extracted access code:', accessCode);
      
      if (!accessCode) {
        return NextResponse.json({ error: 'ไม่พบ access code' }, { status: 401 });
      }

      const result = await supabase
        .from('projects')
        .select('*')
        .eq('access_code', accessCode)
        .order('created_at', { ascending: false });
      projects = result.data;
      error = result.error;
    } else {
      // ถ้าเป็น admin ให้ดึงโปรเจ็คทั้งหมด
      const result = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      projects = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json(projects || []);
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 