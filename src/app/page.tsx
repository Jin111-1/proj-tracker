"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    hover: {
      y: -10,
      scale: 1.02
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.5) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div 
        className="max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-6 shadow-lg"
            variants={logoVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4"
            variants={titleVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Interior Tracker
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            ระบบจัดการโปรเจ็คตกแต่งภายในที่ใช้งานง่ายและมีประสิทธิภาพ 
            ติดตามความคืบหน้า จัดการงบประมาณ และควบคุมคุณภาพงานได้อย่างครบครัน
          </motion.p>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            variants={cardVariants}
            whileHover="hover"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ติดตามความคืบหน้า</h3>
            <p className="text-gray-600">ติดตามความคืบหน้าของงานได้แบบเรียลไทม์ พร้อมรายงานสรุปที่ครบถ้วน</p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            variants={cardVariants}
            whileHover="hover"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">จัดการงบประมาณ</h3>
            <p className="text-gray-600">ควบคุมค่าใช้จ่ายและงบประมาณได้อย่างแม่นยำ พร้อมระบบแจ้งเตือน</p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            variants={cardVariants}
            whileHover="hover"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">จัดการรูปภาพ</h3>
            <p className="text-gray-600">เก็บและจัดการรูปภาพงานได้อย่างเป็นระบบ พร้อมการจัดหมวดหมู่</p>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link 
              href="/pages/home-landing"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>เริ่มต้นใช้งาน</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
          <motion.p 
            className="text-gray-500 mt-4 text-sm"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            เข้าสู่ระบบเพื่อเริ่มต้นการใช้งาน หรือสร้างโปรเจ็คใหม่
          </motion.p>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-gray-200"
          variants={itemVariants}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-gray-500 text-sm">
            © 2024 Interior Tracker. ระบบจัดการโปรเจ็คตกแต่งภายในที่ครบครัน
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
