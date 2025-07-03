'use client'

import { useState } from 'react'
import { useAccessCodeLogin } from '@/app/hooks/useAccessCodeLogin/page'
import { useAdminLogin } from '@/app/hooks/useAdminLogin/page'

export default function LoginPage() {
  // State สำหรับ Access Code
  const [accessCode, setAccessCode] = useState('')
  const { accessLoading, accessResult, loginWithAccessCode } = useAccessCodeLogin()

  // State สำหรับ Admin
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const { adminLoading, adminResult, loginAdmin } = useAdminLogin()

  return (
    <div className="max-w-md mx-auto py-10 space-y-10">
      {/* ส่วน Access Code */}
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบด้วย Access Code</h2>
        <input
          type="text"
          placeholder="กรอก Access Code"
          value={accessCode}
          onChange={e => setAccessCode(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <button
          onClick={() => loginWithAccessCode(accessCode)}
          disabled={accessLoading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {accessLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
        {accessResult && <div className="mt-2 text-sm">{accessResult}</div>}
      </div>

      {/* ส่วน Admin */}
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบสำหรับแอดมิน</h2>
        <input
          type="email"
          placeholder="Email"
          value={adminEmail}
          onChange={e => setAdminEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={adminPassword}
          onChange={e => setAdminPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-2"
        />
        <button
          onClick={() => loginAdmin(adminEmail, adminPassword)}
          disabled={adminLoading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {adminLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบแอดมิน'}
        </button>
        {adminResult && <div className="mt-2 text-sm">{adminResult}</div>}
      </div>
    </div>
  )
}
