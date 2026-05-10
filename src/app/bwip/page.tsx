'use client';

import React, { useState } from 'react';
import mockData from '@/data/mockData.json';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// --- กำหนดประเภทข้อมูล Props ของ Component ---
interface BwipCodeProps {
  text: string;
  bcid: string;
  height?: number;
  scale?: number;
}

// --- โหลด Component แบบ Dynamic พร้อมระบุ Type ---
const BwipCode = dynamic<BwipCodeProps>(() => import('./BwipCodeComponent'), { 
  ssr: false,
  loading: () => <div className="w-[150px] h-[150px] bg-gray-100 animate-pulse rounded-xl" />
});

export default function BwipGeneratorPage() {
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode'>('qr');
  
  // ดึงข้อมูล 10 ตัวแรกจาก set1 ของ mockData
  const sampleData = Object.values(mockData.set1).slice(0, 10) as string[];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              BWIP-JS <span className="text-blue-600">Generator</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              ทดสอบการสร้างโค้ดคุณภาพสูงด้วย BWIPP (Barcode Writer in Pure JavaScript)
            </p>
          </div>
          <Link 
            href="/generator" 
            className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 w-fit"
          >
            ← กลับหน้า Generator หลัก
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-8">
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'qr' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            QR Code (2D)
          </button>
          <button
            onClick={() => setActiveTab('barcode')}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'barcode' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Barcode (1D - Code128)
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
          
          {activeTab === 'qr' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-xl font-bold">QR Code Gallery</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {sampleData.map((text, i) => (
                  <BwipCode key={i} text={text} bcid="qrcode" scale={4} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                <h2 className="text-xl font-bold">1D Barcode (Code 128)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sampleData.map((text, i) => (
                  <BwipCode key={i} text={text} bcid="code128" height={15} scale={2} />
                ))}
              </div>
            </div>
          )}
          
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-slate-400 text-xs font-medium">
          Powered by bwip-js • ข้อมูลทดสอบจาก mockData.json
        </div>

      </div>
    </div>
  );
}
