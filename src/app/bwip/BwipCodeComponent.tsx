'use client';

import React, { useEffect, useRef } from 'react';
// ใช้ Default Import ตามมาตรฐานของ bwip-js v4+
import bwipjs from 'bwip-js';

interface BwipProps {
  text: string;
  bcid: string;
  height?: number;
  scale?: number;
}

const BwipCodeComponent = ({ text, bcid, height, scale = 3 }: BwipProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        try {
          // สร้าง Options พื้นฐาน
          const options: any = {
            bcid: bcid,
            text: text,
            scale: scale,
            includetext: true,
            textxalign: 'center',
            backgroundcolor: 'ffffff',
          };

          // ใส่ความสูงเฉพาะเมื่อมีการระบุมา (สำคัญสำหรับ Barcode 1D)
          if (height !== undefined) {
            options.height = height;
          }

          bwipjs.toCanvas(canvasRef.current, options);
        } catch (e) {
          console.error('Bwipjs Error:', e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [text, bcid, height, scale]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center transition-all hover:shadow-md">
      <canvas ref={canvasRef} className="max-w-full h-auto" />
      <div className="mt-3 text-[10px] font-mono text-gray-400 truncate w-full text-center">
        {text}
      </div>
    </div>
  );
};

export default BwipCodeComponent;
