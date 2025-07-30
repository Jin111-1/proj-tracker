import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

// GET - ดึงข้อมูล expense เฉพาะรายการ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
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

    // ดึงข้อมูล expense
    const { data: expense, error } = await supabase
      .from('expenses')
      .select(`
        *,
        projects:project_id (
          id,
          name,
          access_code
        )
      `)
      .eq('id', id)
      .single();

    if (error || !expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    const successResponse = NextResponse.json(expense);
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in expense API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - อัปเดต expense
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
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

    // ตรวจสอบว่า expense มีอยู่จริง
    const { data: existingExpense, error: checkError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // รับข้อมูลที่จะอัปเดต
    const {
      amount,
      description,
      detail,
      expense_date,
      category,
      vendor
    } = await request.json();

    // สร้าง object สำหรับอัปเดต
    const updateData: Record<string, unknown> = {};
    if (amount !== undefined) updateData.amount = Number(amount);
    if (description !== undefined) updateData.description = description;
    if (detail !== undefined) updateData.detail = detail;
    if (expense_date !== undefined) updateData.expense_date = expense_date;
    if (category !== undefined) updateData.category = category;
    if (vendor !== undefined) updateData.vendor = vendor;

    // ตรวจสอบว่ามีข้อมูลที่จะอัปเดตหรือไม่
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 });
    }

    // อัปเดต expense
    const { data: updatedExpense, error: updateError } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        projects:project_id (
          id,
          name,
          access_code
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating expense:', updateError);
      return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }

    const successResponse = NextResponse.json(updatedExpense);
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

// DELETE - ลบ expense
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(request, response);
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
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

    // ตรวจสอบว่า expense มีอยู่จริง
    const { data: existingExpense, error: checkError } = await supabase
      .from('expenses')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // ลบ expense
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting expense:', deleteError);
      return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }

    const successResponse = NextResponse.json({ message: 'Expense deleted successfully' });
    const setCookieHeaders = response.headers.getSetCookie();
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie);
    });

    return successResponse;
  } catch (error) {
    console.error('Error in expense API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 