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

    // สร้าง response object สำหรับจัดการ cookies
    const response = NextResponse.next()
    
    // ใช้ createSupabaseServerClient จาก supabaseCookie.ts
    const supabase = createSupabaseServerClient(request, response, remember)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'ไม่พบข้อมูลผู้ใช้' }, { status: 400 })
    }

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ message: 'Login สำเร็จ' })
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie)
    })

    return successResponse

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการ login' }, { status: 500 })
  }
}
