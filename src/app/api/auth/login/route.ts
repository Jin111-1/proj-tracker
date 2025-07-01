import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabaseCookie'

interface LoginBody {
  email: string
  password: string
  remember?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, remember = false }: LoginBody = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email และ Password จำเป็น' }, { status: 400 })
    }

    // สร้าง response object ที่จะส่งกลับ
    const response = NextResponse.json({ message: 'Login สำเร็จ' }, { status: 200 })

    // สร้าง Supabase client พร้อม response object
    const supabase = createSupabaseServerClient(request, response, remember)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'ไม่พบข้อมูลผู้ใช้' }, { status: 400 })
    }

    // ส่ง response พร้อม cookies กลับไป
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการ login' }, { status: 500 })
  }
} 