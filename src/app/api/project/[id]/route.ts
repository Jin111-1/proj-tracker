import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabaseCookie';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const response = NextResponse.next();
    const supabase = createSupabaseServerClient(req, response);
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'ไม่พบ id' }, { status: 400 });
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'ไม่พบโปรเจ็ค' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
    }
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
} 