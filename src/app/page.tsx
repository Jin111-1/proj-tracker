"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">QR Code Tools</h1>
          <p className="text-blue-100">ระบบจัดการคิวอาร์โค้ด</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/scanner" className="group block h-full">
            <div className="h-full border-2 border-gray-100 rounded-xl p-6 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-white">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">สแกน QR Code</h2>
              <p className="text-gray-500 text-sm">อ่านคิวอาร์โค้ดผ่านกล้อง หรืออัปโหลดรูปภาพ</p>
            </div>
          </Link>

          <Link href="/generator" className="group block h-full">
            <div className="h-full border-2 border-gray-100 rounded-xl p-6 hover:border-green-500 hover:shadow-md transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-white">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">สร้าง QR Code</h2>
              <p className="text-gray-500 text-sm">สร้างคิวอาร์โค้ดจากข้อมูล Mock Data ที่เตรียมไว้</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
