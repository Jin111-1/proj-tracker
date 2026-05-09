"use client";

import { useState } from "react";
import mockData from "../../data/mockData.json";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function GeneratorPage() {
  const [selectedText, setSelectedText] = useState<string>("");

  // แปลงข้อมูลให้อยู่ในรูปแบบที่แสดงผลง่ายขึ้น
  const set1Items = Object.entries(mockData.set1).map(([key, value]) => `${key}: ${value}`);
  const set2Items = mockData.set2.map(item => `key-aaa: ${item["key-aaa"]}`);
  
  const allItems = [...set1Items, ...set2Items];

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">สร้าง QR Code จากข้อมูลจำลอง</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">เลือกข้อมูล (จาก mockData.json)</h2>
            <div className="flex-1 max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 shadow-inner">
              {allItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-4 py-3 mb-2 rounded-md transition-colors font-medium ${
                    selectedText === item 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                  onClick={() => setSelectedText(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 h-[500px] md:mt-[44px]">
            {selectedText ? (
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
                  <QRCodeSVG value={selectedText} size={256} />
                </div>
                <div className="bg-blue-50 px-6 py-3 rounded-lg border border-blue-100 w-full text-center">
                  <p className="text-sm font-semibold text-blue-600 mb-1">ข้อมูลที่เข้ารหัส:</p>
                  <p className="text-md text-gray-800 break-all">{selectedText}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-lg">กรุณาเลือกข้อมูลเพื่อสร้าง QR Code</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/" className="inline-block px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm">
            กลับไปหน้าแรก
          </Link>
        </div>
      </div>
    </div>
  );
}
