import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
export function useAccessCodeLogin() {
  const [accessLoading, setAccessLoading] = useState(false)
  const [accessResult, setAccessResult] = useState<string | null>(null)
  const router = useRouter()
  const loginWithAccessCode = async (accessCode: string) => {
    setAccessLoading(true)
    setAccessResult(null)
    try {
      const response = await axios.post('/api/auth/loginWithAccessCode', {
        access_code: accessCode
      })
      if (response.status === 200) {
        setAccessResult('✅ เข้าสู่ระบบด้วย Access Code สำเร็จ')
        router.push('/pages/userDashboard')
      } else {
        setAccessResult(`❌ ${response.data.error}`)
      }
    } catch (err) {
      setAccessResult('❌ เกิดข้อผิดพลาด')
    }
    setAccessLoading(false)
  }

  return { accessLoading, accessResult, loginWithAccessCode }
}
