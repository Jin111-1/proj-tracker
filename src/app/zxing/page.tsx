'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  QRCodeWriter,
  BarcodeFormat,
  EncodeHintType,
  BrowserMultiFormatReader,
} from '@zxing/library';
import mockData from '@/data/mockData.json';

// --- วาด BitMatrix ลง Canvas ---
// QRCodeWriter.encode() คืนค่าเป็น BitMatrix ซึ่งมี .get(x,y) โดยตรง
// ต้องใช้ .getWidth() / .getHeight() ของ matrix ไม่ใช่ขนาด canvas
function drawBitMatrix(canvas: HTMLCanvasElement, matrix: ReturnType<QRCodeWriter['encode']>) {
  const matrixW = matrix.getWidth();
  const matrixH = matrix.getHeight();
  const canvasW = canvas.width;
  const canvasH = canvas.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // คำนวณ scale เพื่อให้พอดีกับ canvas
  const scaleX = canvasW / matrixW;
  const scaleY = canvasH / matrixH;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#000000';

  for (let y = 0; y < matrixH; y++) {
    for (let x = 0; x < matrixW; x++) {
      if (matrix.get(x, y)) {
        ctx.fillRect(
          Math.floor(x * scaleX),
          Math.floor(y * scaleY),
          Math.ceil(scaleX),
          Math.ceil(scaleY)
        );
      }
    }
  }
}

// --- Component: สร้าง QR Code ---
const QRCodeZXing = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!canvasRef.current) return;
    setError('');
    try {
      const writer = new QRCodeWriter();
      // ต้องส่ง hints เป็น Map และใช้ string 'L' แทน ErrorCorrectionLevel enum
      const hints = new Map([[EncodeHintType.ERROR_CORRECTION, 'L']]);
      const matrix = writer.encode(text, BarcodeFormat.QR_CODE, 200, 200, hints);
      drawBitMatrix(canvasRef.current, matrix);
    } catch (err) {
      console.error('Error generating QR:', err);
      setError('QR Error');
    }
  }, [text]);

  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} className="border rounded shadow-sm" />
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
};

// --- Component: สร้าง Barcode (1D Code128) ---
// @zxing/library ไม่มี Code128Writer แยก แต่ QRCodeWriter ไม่รองรับ Code128
// ต้องใช้วิธีวาด Barcode Code128 เองผ่าน canvas โดยคำนวณจากสูตร
// เพราะ @zxing/library ฝั่ง Writer รองรับแค่ QR, Aztec, DataMatrix, PDF417
const BarcodeZXing = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // วาด Barcode แบบ Code128 โดยใช้การ encode ด้วยมือ (manual Code128B encoding)
    const QUIET = 10; // quiet zone กว้าง 10px
    const W = canvas.width - QUIET * 2;
    const H = canvas.height - 20; // เหลือพื้นที่ 20px ล่างสำหรับตัวอักษร

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Code 128B patterns (11 bits per char: 1=bar 0=space)
    // ตัวเลขคือ pattern สำหรับแต่ละ code value
    const CODE128B: Record<number, string> = {
      0: '11011001100', 1: '11001101100', 2: '11001100110',
      3: '10010011000', 4: '10010001100', 5: '10001001100',
      6: '10011001000', 7: '10011000100', 8: '10001100100',
      9: '11001001000', 10: '11001000100', 11: '11000100100',
      12: '10110011100', 13: '10011011100', 14: '10011001110',
      15: '10111001100', 16: '10011101100', 17: '10011100110',
      18: '11001110010', 19: '11001011100', 20: '11001001110',
      21: '11011100100', 22: '11001110100', 23: '11101101110',
      24: '11101001100', 25: '11100101100', 26: '11100100110',
      27: '11101100100', 28: '11100110100', 29: '11100110010',
      30: '11011011000', 31: '11011000110', 32: '11000110110',
      33: '10100011000', 34: '10001011000', 35: '10001000110',
      36: '10110001000', 37: '10001101000', 38: '10001100010',
      39: '11010001000', 40: '11000101000', 41: '11000100010',
      42: '10110111000', 43: '10110001110', 44: '10001101110',
      45: '10111011000', 46: '10111000110', 47: '10001110110',
      48: '11101110110', 49: '11010001110', 50: '11000101110',
      51: '11011101000', 52: '11011100010', 53: '11011101110',
      54: '11101011000', 55: '11101000110', 56: '11100010110',
      57: '11101101000', 58: '11101100010', 59: '11100011010',
      60: '11101111010', 61: '11001000010', 62: '11110001010',
      63: '10100110000', 64: '10100001100', 65: '10010110000',
      66: '10010000110', 67: '10000101100', 68: '10000100110',
      69: '10110010000', 70: '10110000100', 71: '10011010000',
      72: '10011000010', 73: '10000110100', 74: '10000110010',
      75: '11000010010', 76: '11001010000', 77: '11110111010',
      78: '11000010100', 79: '10001111010', 80: '10100111100',
      81: '10010111100', 82: '10010011110', 83: '10111100100',
      84: '10011110100', 85: '10011110010', 86: '11110100100',
      87: '11110010100', 88: '11110010010', 89: '11011011110',
      90: '11011110110', 91: '11110110110', 92: '10101111000',
      93: '10100011110', 94: '10001011110', 95: '10111101000',
      96: '10111100010', 97: '11110101000', 98: '11110100010',
      99: '10111011110', 100: '10111101110', 101: '11101011110',
      102: '11110101110',
      103: '11010000100', // Start Code B
      106: '11000111010', // Stop
    };

    const START_B = 104;
    const STOP = 106;

    // คำนวณ checksum
    let checksum = START_B; // Code B = value 104
    const codes: number[] = [103]; // Start B pattern = index 103 in table
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) - 32;
      codes.push(charCode);
      checksum += (i + 1) * charCode;
    }
    codes.push(checksum % 103);
    codes.push(STOP);

    // รวม bits ทั้งหมด
    let allBits = '';
    for (const code of codes) {
      allBits += CODE128B[code] ?? '00000000000';
    }
    // เพิ่ม termination bar
    allBits += '11';

    // วาดลง canvas
    const barWidth = W / allBits.length;
    ctx.fillStyle = '#000000';
    for (let i = 0; i < allBits.length; i++) {
      if (allBits[i] === '1') {
        ctx.fillRect(QUIET + i * barWidth, 0, Math.max(1, barWidth), H);
      }
    }

    // วาดตัวอักษรด้านล่าง
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height - 4);
  }, [text]);

  return <canvas ref={canvasRef} width={300} height={80} className="border rounded shadow-sm" />;
};

// --- Component: เครื่องสแกน (Reader) ---
const ScannerZXing = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // BrowserMultiFormatReader ใช้ได้ปกติ (เป็น Reader ไม่ใช่ Writer)
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;

    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (res, err) => {
        if (!isMounted) return;
        if (res) {
          setResult(res.getText());
          setError('');
        }
        // มองข้าม NotFoundException เพราะเกิดตลอดเวลาที่ยังสแกนไม่เจอ
        if (err && err.name !== 'NotFoundException') {
          console.warn('Scan error:', err.name);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('ไม่สามารถเปิดกล้องได้ กรุณาอนุญาต Camera Permission');
        }
      });

    return () => {
      isMounted = false;
      codeReader.reset(); // ปิดกล้องเมื่อ unmount
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border-4 border-slate-800 shadow-lg bg-black" style={{ aspectRatio: '16/9' }}>
        <video ref={videoRef} className="w-full h-full object-cover" />
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg w-full max-w-md text-center">
        <h3 className="text-lg font-bold text-green-800">Scan Result:</h3>
        <p className="text-2xl font-mono text-gray-800 mt-2 break-all">
          {result || 'รอสแกน...'}
        </p>
      </div>
    </div>
  );
};

// --- หน้า Page หลัก ---
export default function ZXingTestPage() {
  const [activeTab, setActiveTab] = useState<'qr' | 'barcode' | 'scan'>('qr');

  // ดึงข้อมูล 5 ตัวแรกจาก set1
  const sampleData = Object.values(mockData.set1).slice(0, 5) as string[];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          @zxing/library Test Page
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">ข้อมูลจาก mockData.json (set1, 5 รายการแรก)</p>

        {/* เมนูแท็บ */}
        <div className="flex justify-center gap-3 mb-8">
          {(['qr', 'barcode', 'scan'] as const).map((tab) => {
            const labels = { qr: '1. QR Code', barcode: '2. Barcode (1D)', scan: '3. Scanner (อ่าน)' };
            const colors = {
              qr: 'bg-blue-600 text-white',
              barcode: 'bg-purple-600 text-white',
              scan: 'bg-green-600 text-white',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeTab === tab ? colors[tab] : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* เนื้อหาแต่ละแท็บ */}
        <div>
          {activeTab === 'qr' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 border-b pb-2">Generate QR Code จาก mockData.json</h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {sampleData.map((text, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border">
                    <QRCodeZXing text={text} />
                    <span className="mt-3 font-mono text-sm text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'barcode' && (
            <div>
              <h2 className="text-xl font-semibold mb-6 border-b pb-2">Generate Barcode (Code128) จาก mockData.json</h2>
              <div className="flex flex-col gap-4 items-center">
                {sampleData.map((text, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl border w-full max-w-sm">
                    <BarcodeZXing text={text} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-center">สแกน Barcode & QR Code</h2>
              <p className="text-center text-gray-500 mb-6">
                เปิดกล้องเพื่อสแกน QR Code หรือ Barcode ของคุณ
              </p>
              <ScannerZXing />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
