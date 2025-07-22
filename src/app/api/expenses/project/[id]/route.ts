import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// GET - ดึงข้อมูล expenses ตาม project_id และรวมยอด
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

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

    // ตรวจสอบว่าโปรเจ็กต์มีอยู่จริง
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, access_code')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // ดึงรายการ expenses ของโปรเจ็กต์
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('project_id', id)
      .order('expense_date', { ascending: false });

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }

    // คำนวณยอดรวม
    const totalAmount = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

    // จัดกลุ่มตามหมวดหมู่
    const expensesByCategory = expenses?.reduce((acc, expense) => {
      const category = expense.category || 'ไม่มีหมวดหมู่';
      if (!acc[category]) {
        acc[category] = {
          category,
          total: 0,
          count: 0,
          expenses: []
        };
      }
      acc[category].total += Number(expense.amount);
      acc[category].count += 1;
      acc[category].expenses.push(expense);
      return acc;
    }, {} as any) || {};

    const result = {
      project,
      expenses: expenses || [],
      totalAmount,
      expensesByCategory,
      count: expenses?.length || 0
    };

    const successResponse = NextResponse.json(result);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in project expenses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 