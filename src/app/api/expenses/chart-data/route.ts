import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// GET - ดึงข้อมูลรวมเพื่อใช้กับกราฟ
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

    // รับ query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const groupBy = searchParams.get('group_by') || 'date'; // 'date' หรือ 'category'

    let query = supabase
      .from('expenses')
      .select(`
        *,
        projects:project_id (
          id,
          name,
          access_code
        )
      `)
      .order('expense_date', { ascending: true });

    // กรองตาม project_id ถ้ามี
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: expenses, error } = await query;

    if (error) {
      console.error('Error fetching expenses for chart:', error);
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }

    let chartData;

    if (groupBy === 'date') {
      // จัดกลุ่มตามวันที่
      const expensesByDate = expenses?.reduce((acc: Record<string, { date: string; total: number }>, curr: { expense_date: string; amount: number }) => {
        const date = curr.expense_date;
        if (!acc[date]) acc[date] = { date, total: 0 };
        acc[date].total += curr.amount;
        return acc;
      }, {});
      chartData = Object.values(expensesByDate).map((item) => ({ ...item }));
    } else {
      // จัดกลุ่มตามหมวดหมู่
      const expensesByCategory = expenses?.reduce((acc: Record<string, { category: string; total: number }>, curr: { category: string; amount: number }) => {
        const category = curr.category || 'อื่นๆ';
        if (!acc[category]) acc[category] = { category, total: 0 };
        acc[category].total += curr.amount;
        return acc;
      }, {});
      chartData = Object.values(expensesByCategory).map((item) => ({ ...item }));
    }

    // คำนวณสถิติเพิ่มเติม
    const totalAmount = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
    const averageAmount = expenses?.length ? totalAmount / expenses.length : 0;
    const maxAmount = expenses?.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;
    const minAmount = expenses?.length ? Math.min(...expenses.map(e => Number(e.amount))) : 0;

    const result = {
      chartData,
      statistics: {
        totalAmount,
        averageAmount,
        maxAmount,
        minAmount,
        totalCount: expenses?.length || 0
      },
      groupBy,
      projectId: projectId || null
    };

    const successResponse = NextResponse.json(result);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 