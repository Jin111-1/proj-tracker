import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabaseCookie'

export async function POST(request: NextRequest) {
  try {
    // สร้าง response object ที่จะส่งกลับ
    const response = NextResponse.json({ message: 'Logout สำเร็จ' }, { status: 200 })

    // สร้าง Supabase client พร้อม response object
    const supabase = createSupabaseServerClient(request, response)

    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // ส่ง response พร้อม cookies ที่ถูกลบแล้วกลับไป
    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการ logout' }, { status: 500 })
  }
} 