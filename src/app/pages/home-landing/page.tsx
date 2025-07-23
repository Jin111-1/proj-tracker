'use client'

import { useState } from 'react'
import { useAccessCodeLogin } from '@/app/hooks/useAccessCodeLogin'
import { useAdminLogin } from '@/app/hooks/useAdminLogin'

export default function LoginPage() {
  const [mode, setMode] = useState<'user' | 'admin'>('user')

  // Access Code
  const [accessCode, setAccessCode] = useState('')
  const { accessLoading, accessResult, loginWithAccessCode } = useAccessCodeLogin()

  // Admin
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const { adminLoading, adminResult, loginAdmin } = useAdminLogin()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">เข้าสู่ระบบ</h1>
        
        {/* Toggle Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setMode('user')}
            className={`px-6 py-2 rounded-l-full border transition-all duration-200
              ${mode === 'user' 
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-blue-100'}
            `}
          >
            ผู้ใช้ (Access Code)
          </button>
          <button
            onClick={() => setMode('admin')}
            className={`px-6 py-2 rounded-r-full border transition-all duration-200
              ${mode === 'admin' 
                ? 'bg-green-600 text-white border-green-600 shadow'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-green-100'}
            `}
          >
            แอดมิน (Admin)
          </button>
        </div>

        {/* ฟอร์ม Access Code */}
        {mode === 'user' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <label className="text-gray-700 font-medium">Access Code</label>
            <input
              type="text"
              placeholder="กรอก Access Code"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
              className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => loginWithAccessCode(accessCode)}
              disabled={accessLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              {accessLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
            {accessResult && <div className="mt-2 text-sm text-center">{accessResult}</div>}
          </div>
        )}

        {/* ฟอร์ม Admin */}
        {mode === 'admin' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full border border-green-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              className="w-full border border-green-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => loginAdmin(adminEmail, adminPassword)}
              disabled={adminLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            >
              {adminLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบแอดมิน'}
            </button>
            {adminResult && <div className="mt-2 text-sm text-center">{adminResult}</div>}
          </div>
        )}
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  )
}
