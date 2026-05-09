"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";

interface ScanRecord {
  text: string;
  timestamp: Date;
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Cleanup function
  const cleanup = useCallback(async () => {
    try {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch (err) {
      console.warn("Cleanup warning:", err);
    }
  }, []);

  // เริ่มสแกนด้วยกล้องหลังอัตโนมัติเมื่อเข้าหน้า
  useEffect(() => {
    const startScanner = async () => {
      try {
        setErrorMsg(null);

        // สร้าง instance ใหม่ทุกครั้ง
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        // ใช้ facingMode: "environment" เพื่อบังคับกล้องหลัง
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            setScanResult(decodedText);
            setHistory(prev => [
              { text: decodedText, timestamp: new Date() },
              ...prev,
            ]);

            // สแกนเจอแล้ว → ปิดกล้องทันที
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
              html5QrCodeRef.current.stop().then(() => {
                setIsCameraReady(false);
              }).catch(err => console.warn("Stop after scan:", err));
            }
          },
          () => {
            // silent: เฟรมที่อ่าน QR ไม่เจอ → ปกติ ไม่ต้องทำอะไร
          }
        );

        setIsCameraReady(true);
      } catch (err) {
        console.error("Camera start error:", err);
        setErrorMsg(
          "ไม่สามารถเปิดกล้องหลังได้ กรุณาอนุญาตการใช้กล้องในเบราว์เซอร์ หรือตรวจสอบว่าอุปกรณ์มีกล้องหลัง"
        );
      }
    };

    // หน่วงเวลาเล็กน้อยให้ DOM พร้อมก่อนเริ่มกล้อง
    const timer = setTimeout(startScanner, 300);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [cleanup]);

  // เปิดกล้องใหม่อีกครั้ง
  const restartScanner = async () => {
    setScanResult(null);
    setIsCameraReady(false);
    setErrorMsg(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScanResult(decodedText);
          setHistory(prev => [
            { text: decodedText, timestamp: new Date() },
            ...prev,
          ]);
          if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().then(() => {
              setIsCameraReady(false);
            }).catch(err => console.warn("Stop after scan:", err));
          }
        },
        () => {}
      );
      setIsCameraReady(true);
    } catch (err) {
      console.error("Restart error:", err);
      setErrorMsg("ไม่สามารถเปิดกล้องได้ กรุณาลองใหม่");
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setScanResult(null);
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-12 px-4 bg-gray-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl mb-6 border border-gray-100">
        <h1 className="text-2xl font-black text-center mb-2 text-gray-900 tracking-tight">
          สแกน QR Code
        </h1>
        <p className="text-xs text-gray-400 text-center mb-8 font-bold uppercase tracking-widest">
          Back Camera Scanner
        </p>

        {/* แสดง error ถ้าเปิดกล้องไม่ได้ */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Loading indicator */}
        {!isCameraReady && !errorMsg && (
          <div className="flex items-center justify-center p-6 mb-4 bg-gray-50 rounded-2xl">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mr-3"></div>
            <span className="text-sm text-gray-500 font-medium">กำลังเปิดกล้อง...</span>
          </div>
        )}

        {/* ช่องมองภาพ */}
        <div
          id="reader"
          className="w-full mb-6 overflow-hidden rounded-2xl border-2 border-gray-100"
        ></div>

        {/* ผลลัพธ์ */}
        {scanResult && (
          <div className="p-5 mt-4 bg-green-50 border-2 border-green-100 rounded-2xl">
            <div className="flex items-center mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">
                ผลลัพธ์ล่าสุด
              </p>
            </div>
            <p className="text-lg text-gray-800 break-all font-bold leading-tight">
              {scanResult}
            </p>

            {/* ปุ่มสแกนต่อ */}
            <button
              onClick={restartScanner}
              className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              สแกนต่อ
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-black text-sm rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            BACK TO HOME
          </Link>
        </div>
      </div>

      {/* ประวัติการสแกน */}
      {history.length > 0 && (
        <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-5">
            <h2 className="text-lg font-black text-gray-900 flex items-center">
              <span className="p-2 bg-purple-50 rounded-lg mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              ประวัติการสแกน
            </h2>
            <button
              onClick={clearHistory}
              className="text-[10px] text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all font-black border border-red-50 tracking-widest uppercase"
            >
              ล้างทั้งหมด
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md hover:border-blue-100 transition-all border border-transparent group"
              >
                <p className="text-gray-800 font-bold break-all leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {item.text}
                </p>
                <div className="flex items-center text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {item.timestamp.toLocaleTimeString("th-TH")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
