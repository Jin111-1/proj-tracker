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
      const expensesByDate = expenses?.reduce((acc, expense) => {
        const date = expense.expense_date;
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            count: 0
          };
        }
        acc[date].total += Number(expense.amount);
        acc[date].count += 1;
        return acc;
      }, {} as any) || {};

      chartData = Object.values(expensesByDate).map((item: any) => ({
        name: item.date,
        value: item.total,
        count: item.count
      }));
    } else {
      // จัดกลุ่มตามหมวดหมู่
      const expensesByCategory = expenses?.reduce((acc, expense) => {
        const category = expense.category || 'ไม่มีหมวดหมู่';
        if (!acc[category]) {
          acc[category] = {
            category,
            total: 0,
            count: 0
          };
        }
        acc[category].total += Number(expense.amount);
        acc[category].count += 1;
        return acc;
      }, {} as any) || {};

      chartData = Object.values(expensesByCategory).map((item: any) => ({
        name: item.category,
        value: item.total,
        count: item.count
      }));
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
  } catch (error) {
    console.error('Error in chart data API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 