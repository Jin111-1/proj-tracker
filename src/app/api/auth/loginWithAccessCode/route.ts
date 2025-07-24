import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/supabase'
import { createSupabaseServerClient } from '@/utils/supabaseCookie'

export async function POST(request: NextRequest) {
  try {
    const { access_code } = await request.json()

    if (!access_code) {
      return NextResponse.json({ error: 'กรุณาระบุ access_code' }, { status: 400 })
    }

    // ค้นหา project ที่มี access_code ตรงกัน
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('access_code', access_code)
      

    if (projectError || !project) {
      return NextResponse.json({ error: 'ไม่พบโปรเจ็คหรือ access code ไม่ถูกต้อง' }, { status: 401 })
    }

    // สร้างอีเมลสำหรับ guest user
    const guestEmail = `${access_code}@example.com`
    const guestPassword = access_code // หรือจะใช้รหัสอื่นก็ได้

    // ตรวจสอบว่ามี user นี้อยู่แล้วหรือยัง
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('email', guestEmail)
      .single();

    let userId = userData?.id

    // ถ้ายังไม่มี user ให้สร้างใหม่
    if (!userId) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
      })
      if (signUpError || !signUpData.user) {
        return NextResponse.json({ error: 'สร้าง guest user ไม่สำเร็จ' }, { status: 500 })
      }
      userId = signUpData.user.id
    }

    // login ด้วย email/password
    // สร้าง response object สำหรับแนบ cookies
    const response = NextResponse.json({ message: 'เข้าสู่ระบบด้วย access code สำเร็จ', project }, { status: 200 })
    const supabaseServer = createSupabaseServerClient(request, response, true)
    const { error: loginError } = await supabaseServer.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    })
    if (loginError) {
      return NextResponse.json({ error: 'เข้าสู่ระบบไม่สำเร็จ' }, { status: 401 })
    }

    return response
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
