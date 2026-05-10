"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl w-full">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center mb-10 shadow-2xl shadow-slate-200">
          <div className="inline-block px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Barcode & QR Solutions
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Integrated Track</h1>
          <p className="text-slate-400 font-medium">ศูนย์รวมเครื่องมือจัดการรหัสภาพและข้อมูลอัตโนมัติ</p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Scanner */}
          <Link href="/scanner" className="group">
            <div className="h-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">QR Scanner</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                สแกนคิวอาร์โค้ดผ่านกล้องเรียลไทม์ พร้อมระบบจัดการประวัติ
              </p>
            </div>
          </Link>

          {/* 2. BWIP-JS (High Quality) */}
          <Link href="/bwip" className="group">
            <div className="h-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">BWIP-JS Test</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                ทดสอบการสร้าง QR และ Barcode ความละเอียดสูงด้วย Canvas
              </p>
            </div>
          </Link>

          {/* 3. JsBarcode (SVG) */}
          <Link href="/jsbarcode" className="group">
            <div className="h-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">JsBarcode</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                สร้างบาร์โค้ดแท่ง (1D) ด้วยเทคโนโลยี SVG ที่คมชัดที่สุด
              </p>
            </div>
          </Link>

          {/* 4. qrcode.react (High Level) */}
          <Link href="/generator" className="group">
            <div className="h-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-50 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">qrcode.react</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                สร้างคิวอาร์โค้ดด้วย React Component ที่รองรับการใส่ Logo
              </p>
            </div>
          </Link>

          {/* 5. node-qrcode (Low Level) */}
          <Link href="/qrcode" className="group">
            <div className="h-full bg-white border-2 border-slate-100 rounded-[2rem] p-8 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-50 transition-all flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-2">node-qrcode</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                สร้างรหัส QR Code โดยใช้ Library พื้นฐานที่วาดบน Canvas โดยตรง
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
          Version 1.0.0 • Developer Preview
        </div>
      </div>
    </div>
  );
}
