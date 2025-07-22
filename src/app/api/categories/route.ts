import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// หมวดหมู่แบบ static (ไม่ต้องเพิ่มใหม่ได้)
const STATIC_CATEGORIES = [
  'วัสดุอุปกรณ์',
  'ค่าแรงงาน',
  'ค่าเดินทาง',
  'ค่าอาหาร',
  'ค่าเช่าอุปกรณ์',
  'ค่าบริการ',
  'ค่าธรรมเนียม',
  'อื่นๆ'
];

// GET - ดึงรายการหมวดหมู่ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    
    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    // ส่งกลับรายการหมวดหมู่แบบ static
    const categories = STATIC_CATEGORIES.map((category, index) => ({
      id: index + 1,
      name: category,
      value: category
    }));

    const successResponse = NextResponse.json(categories);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - เพิ่มหมวดหมู่ใหม่ (สำหรับอนาคต ถ้าต้องการ)
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    
    // ตรวจสอบ authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    // รับข้อมูลหมวดหมู่ใหม่
    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // ตรวจสอบว่าชื่อหมวดหมู่ซ้ำหรือไม่
    if (STATIC_CATEGORIES.includes(name.trim())) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }

    // เพิ่มหมวดหมู่ใหม่เข้าไปในรายการ
    STATIC_CATEGORIES.push(name.trim());

    const newCategory = {
      id: STATIC_CATEGORIES.length,
      name: name.trim(),
      value: name.trim()
    };

    const successResponse = NextResponse.json(newCategory);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 