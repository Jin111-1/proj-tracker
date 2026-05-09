"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Link from "next/link";

interface ScanRecord {
  text: string;
  timestamp: Date;
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // กำหนดให้ scanner เริ่มทำงานแค่รอบเดียว
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          
          setHistory(prev => {
            // ป้องกันการบันทึกซ้ำรัวๆ (เช็คว่าอันล่าสุดคืออันเดียวกันหรือไม่)
            if (prev.length > 0 && prev[0].text === decodedText) {
              return prev;
            }
            return [{ text: decodedText, timestamp: new Date() }, ...prev];
          });
        },
        () => {
          // ไม่ต้องแสดง error ทุกครั้งเพื่อลดสแปมในคอนโซล
        }
      );
    }

    return () => {
      // คืนค่าและล้าง scanner เมื่อออกจากหน้า
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner. ", error);
        });
        scannerRef.current = null;
      }
    };
  }, []);

  const clearHistory = () => {
    setHistory([]);
    setScanResult(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">สแกน QR Code</h1>
        
        <div id="reader" className="w-full mb-6 overflow-hidden rounded-lg"></div>
        
        {scanResult && (
          <div className="p-4 mt-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm text-green-600 font-semibold mb-1">ผลลัพธ์ล่าสุด:</p>
            <p className="text-lg text-gray-800 break-all">{scanResult}</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="inline-block px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
            กลับไปหน้าแรก
          </Link>
        </div>
      </div>

      {/* ส่วนแสดงประวัติ */}
      {history.length > 0 && (
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ประวัติการสแกน
            </h2>
            <button 
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors font-medium"
            >
              ล้างประวัติ
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-2 custom-scrollbar">
            {history.map((item, index) => (
              <div key={index} className="py-3 hover:bg-gray-50 transition-colors rounded-md px-2">
                <p className="text-gray-800 font-medium break-all">{item.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.timestamp.toLocaleTimeString('th-TH', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
