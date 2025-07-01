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

    const response = NextResponse.json({ message: 'ลงทะเบียนสำเร็จ' }, { status: 201 })

    const supabase = createSupabaseServerClient(request, response, remember)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'ไม่สามารถสร้างผู้ใช้ได้' }, { status: 400 })
    }

    return response

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' }, { status: 500 })
  }
} 