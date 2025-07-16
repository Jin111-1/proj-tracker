import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabaseCookie'

interface RegisterBody {
  email: string
  password: string
  remember?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, remember = false }: RegisterBody = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email และ Password จำเป็น' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' }, { status: 400 })
    }

    // สร้าง response object สำหรับจัดการ cookies
    const response = NextResponse.next()
    
    // ใช้ createSupabaseServerClient จาก supabaseCookie.ts
    const supabase = createSupabaseServerClient(request, response, remember)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'ไม่สามารถสร้างผู้ใช้ได้' }, { status: 400 })
    }

    // เพิ่มข้อมูล user ลงในตาราง users
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || '',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error inserting user to users table:', insertError)
      return NextResponse.json({ error: 'สมัครสำเร็จแต่บันทึกข้อมูลผู้ใช้ไม่สำเร็จ' }, { status: 500 })
    }

    console.log('User inserted successfully to users table:', data.user.id)

    // สร้าง response ใหม่พร้อม cookies
    const successResponse = NextResponse.json({ message: 'ลงทะเบียนสำเร็จ' }, { status: 201 })
    
    // คัดลอก cookies จาก response ที่สร้างไว้
    const setCookieHeaders = response.headers.getSetCookie()
    setCookieHeaders.forEach(cookie => {
      successResponse.headers.append('Set-Cookie', cookie)
    })

    return successResponse

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' }, { status: 500 })
  }
} 