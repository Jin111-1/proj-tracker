"use client";
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
export function useAdminLogin() {
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminResult, setAdminResult] = useState<string | null>(null)
  const router = useRouter()
  const loginAdmin = async (email: string, password: string) => {
    setAdminLoading(true)
    setAdminResult(null)
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      if (response.status === 200) {
        setAdminResult('✅ เข้าสู่ระบบแอดมินสำเร็จ')
        router.push('/pages/adminDashboard')
      } else {
        setAdminResult(`❌ ${response.data.error}`)
      }
    } catch (err) {
      setAdminResult('❌ เกิดข้อผิดพลาด')
    }
    setAdminLoading(false)
  }

  return { adminLoading, adminResult, loginAdmin }
}
