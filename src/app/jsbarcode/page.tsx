'use client';

import React, { useEffect, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import mockData from '@/data/mockData.json';
import Link from 'next/link';

// --- Component สำหรับสร้าง Barcode ด้วย JsBarcode ---
const JsBarcodeItem = ({ text }: { text: string }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, text, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          fontOptions: "bold",
          margin: 10,
          background: "#ffffff"
        });
      } catch (e) {
        console.error('JsBarcode Error:', e);
      }
    }
  }, [text]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1">
      <svg ref={svgRef} className="max-w-full h-auto" />
    </div>
  );
};

export default function JsBarcodeTestPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // รวมข้อมูลทั้งหมดจาก mockData
  const allData = [
    ...Object.entries(mockData.set1).map(([key, value]) => ({ key, value: value as string })),
    ...mockData.set2.map((item, i) => ({ key: `set2-${i}`, value: item["key-aaa"] }))
  ];

  const filteredData = allData.filter(item => 
    item.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 12); // แสดงผลสูงสุด 12 รายการ

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">High Performance</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              JS<span className="text-emerald-600">Barcode</span> 
              <span className="text-slate-300 font-light">|</span>
              <span className="text-slate-400 text-xl font-bold">1D Generator</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              ทดสอบการสร้างบาร์โค้ดแท่งมาตรฐานโลกด้วยเทคโนโลยี SVG Rendering
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/bwip" 
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              ไปหน้า BWIP-JS →
            </Link>
            <Link 
              href="/generator" 
              className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ค้นหาข้อมูลจำลองเพื่อสร้างบาร์โค้ด..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Barcode Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.length > 0 ? (
            filteredData.map((item, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                <JsBarcodeItem text={item.value} />
                <div className="mt-3 px-2 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.key}</span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">CODE128</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[2rem] border border-dashed border-slate-200">
               <svg className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p className="font-bold">ไม่พบข้อมูลที่ค้นหา</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black mb-2">ทำไมต้อง JsBarcode?</h2>
              <p className="text-emerald-50/80 text-sm leading-relaxed max-w-2xl">
                JsBarcode เป็น Library ที่ได้รับความนิยมสูงมากสำหรับบาร์โค้ด 1 มิติ 
                เพราะจุดเด่นเรื่องความเร็วในการประมวลผลและการใช้ **SVG (Scalable Vector Graphics)** 
                ทำให้บาร์โค้ดที่ได้มีความคมชัดสูงมาก ไม่แตกเมื่อขยาย และรองรับมาตรฐานอุตสาหกรรมครบถ้วน
              </p>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Prototype Testing • Integrated Barcode Solution
        </footer>

      </div>
    </div>
  );
}
