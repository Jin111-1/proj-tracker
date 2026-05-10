'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import mockData from '@/data/mockData.json';
import Link from 'next/link';

// --- Component สำหรับวาด QR Code ด้วย lib 'qrcode' ---
const QRCodeItem = ({ value, size, color }: { value: string, size: number, color: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) console.error('QRCode Error:', error);
      });
    }
  }, [value, size, color]);

  const download = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center">
      <div className="p-4 bg-slate-50 rounded-2xl mb-6">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
      </div>
      
      <div className="text-center w-full">
        <p className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
          Data Source: Mock
        </p>
        <p className="text-xs font-mono text-slate-400 truncate mb-4 px-2">{value}</p>
        
        <button 
          onClick={download}
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
      </div>
    </div>
  );
};

export default function QrCodeLibPage() {
  const [size, setSize] = useState(200);
  const [fgColor, setFgColor] = useState('#000000');
  
  // เตรียมข้อมูลจาก mockData
  const sampleData = [
    ...Object.entries(mockData.set1).map(([key, value]) => ({ key, value: value as string })),
    ...mockData.set2.map((item, i) => ({ key: `Item-${i+1}`, value: item["key-aaa"] }))
  ].slice(0, 9);

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              node-<span className="text-blue-600">qrcode</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              การสร้างรหัส QR Code โดยใช้ Library พื้นฐานที่มีประสิทธิภาพสูง
            </p>
          </div>
          <Link 
            href="/" 
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            กลับหน้าหลัก
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-8 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Size</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="150" max="300" value={size} 
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-32 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-xs font-bold text-slate-600">{size}px</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Color</label>
            <div className="flex gap-3">
              {['#000000', '#2563eb', '#7c3aed', '#db2777'].map(color => (
                <button 
                  key={color}
                  onClick={() => setFgColor(color)}
                  className={`w-6 h-6 rounded-full transition-all ${fgColor === color ? 'ring-2 ring-offset-2 ring-slate-300 scale-110' : 'opacity-50 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleData.map((item, i) => (
            <QRCodeItem key={i} value={item.value} size={size} color={fgColor} />
          ))}
        </div>

      </div>
    </div>
  );
}
