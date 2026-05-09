"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
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
    // ปรับการตั้งค่าให้ยืดหยุ่นมากขึ้นเพื่อแก้ปัญหาสแกนยาก
    const config = {
      fps: 15, // เพิ่มความเร็วในการประมวลผลต่อวินาที
      qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
        // ให้พื้นที่สแกนปรับตามขนาดหน้าจออัตโนมัติ (ประมาณ 70% ของด้านที่สั้นที่สุด)
        const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.floor(minEdgeSize * 0.7);
        return {
          width: qrboxSize,
          height: qrboxSize
        };
      },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true, // แสดงปุ่มเปิดแฟลช (ถ้าเครื่องรองรับ)
      showZoomSliderIfSupported: true, // แสดงตัวปรับซูม
      rememberLastUsedCamera: true, // จำกล้องล่าสุดที่เลือกใช้
      supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA,
        Html5QrcodeScanType.SCAN_TYPE_FILE
      ]
    };

    if (!scannerRef.current) {
      // ใช้ verbose: false เพื่อลด log ที่ไม่จำเป็น
      scannerRef.current = new Html5QrcodeScanner("reader", config, false);

      scannerRef.current.render(
        (decodedText) => {
          setScanResult(decodedText);
          setHistory(prev => {
            // ป้องกันการบันทึกซ้ำถ้ารหัสเดิมยังอยู่ล่าสุด
            if (prev.length > 0 && prev[0].text === decodedText) return prev;
            return [{ text: decodedText, timestamp: new Date() }, ...prev];
          });
        },
        () => {
          // error callback ทิ้งไว้ว่างๆ เพื่อลด spam ใน console
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.warn("Scanner cleanup warning:", err);
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
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl mb-6 border border-gray-100">
        <h1 className="text-2xl font-black text-center mb-2 text-gray-900 tracking-tight">สแกน QR Code</h1>
        <p className="text-xs text-gray-400 text-center mb-8 font-bold uppercase tracking-widest">Scanner Dashboard</p>
        
        {/* คำแนะนำการใช้งาน */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start">
          <div className="p-2 bg-blue-500 rounded-lg mr-3 mt-0.5 shadow-blue-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            หากสแกนผ่านกล้องไม่ได้ผล ให้ลองคลิก <span className="font-bold underline">"Scan Image File"</span> เพื่อเลือกรูปภาพจากเครื่องแทนได้ครับ
          </p>
        </div>

        <div id="reader" className="w-full mb-6 overflow-hidden rounded-2xl border-4 border-gray-50 shadow-inner bg-gray-900"></div>
        
        {scanResult && (
          <div className="p-5 mt-4 bg-green-50 border-2 border-green-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Scanned Result</p>
            </div>
            <p className="text-lg text-gray-800 break-all font-bold leading-tight">{scanResult}</p>
          </div>
        )}
        
        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO HOME
          </Link>
        </div>
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4 border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-5">
            <h2 className="text-lg font-black text-gray-900 flex items-center">
              <span className="p-2 bg-purple-50 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              RECENT SCANS
            </h2>
            <button 
              onClick={clearHistory}
              className="text-[10px] text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-black border border-red-50 tracking-widest uppercase"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {history.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md hover:border-blue-100 transition-all border border-transparent group">
                <p className="text-gray-800 font-bold break-all leading-tight mb-2 group-hover:text-blue-600 transition-colors">{item.text}</p>
                <div className="flex items-center text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.timestamp.toLocaleTimeString('th-TH')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
