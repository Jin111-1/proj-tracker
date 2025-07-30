import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// GET - ดึงรายการ expenses ทั้งหมด (เฉพาะ admin)
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

    // ดึงรายการ expenses ทั้งหมด
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select(`
        *,
        projects:project_id (
          id,
          name,
          access_code
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }

    const successResponse = NextResponse.json(expenses || []);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in expenses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - สร้าง expense ใหม่
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

    // รับข้อมูลจาก body
    const {
      project_id,
      amount,
      description,
      expense_date,
      category,
      vendor
    } = await request.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!project_id || !amount || !description || !expense_date) {
      return NextResponse.json({ 
        error: 'Missing required fields: project_id, amount, description, expense_date' 
      }, { status: 400 });
    }

    // ตรวจสอบ category validation
    const validCategories = ['material', 'service', 'workers', 'utility'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ 
        error: 'Invalid category. Must be one of: material, service, workers, utility, or null' 
      }, { status: 400 });
    }

    // ตรวจสอบว่าโปรเจ็กต์มีอยู่จริง
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // สร้าง expense ใหม่
    const { data: newExpense, error: insertError } = await supabase
      .from('expenses')
      .insert({
        project_id,
        amount: Number(amount),
        description,
        expense_date,
        category: category || null,
        vendor: vendor || null,
        created_by: user.id
      })
      .select(`
        *,
        projects:project_id (
          id,
          name,
          access_code
        )
      `)
      .single();

    if (insertError) {
      console.error('Error creating expense:', insertError);
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }

    const successResponse = NextResponse.json(newExpense);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in expenses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 