import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/utils/supabaseCookie'

export async function GET(request: NextRequest) {
  try {
    // สร้าง response object ที่จะส่งกลับ
    const response = NextResponse.json({ message: 'ดึงข้อมูลผู้ใช้สำเร็จ' }, { status: 200 })

    // สร้าง Supabase client พร้อม response object
    const supabase = createSupabaseServerClient(request, response)

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ที่ login' }, { status: 401 })
    }

    // สร้าง response ใหม่พร้อมข้อมูลผู้ใช้
    const userResponse = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }
    })

    // คัดลอก cookies จาก response เดิม
    const cookies = response.headers.getSetCookie()
    cookies.forEach(cookie => {
      userResponse.headers.append('Set-Cookie', cookie)
    })

    return userResponse

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' }, { status: 500 })
  }
} 