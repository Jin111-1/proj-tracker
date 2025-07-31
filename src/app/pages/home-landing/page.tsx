"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessCodeLogin } from "@/app/hooks/useAccessCodeLogin";
import { useAdminLogin } from "@/app/hooks/useAdminLogin";

export default function LoginPage() {
  const [mode, setMode] = useState<"user" | "admin">("user");

  // Access Code
  const [accessCode, setAccessCode] = useState("TEST001");
  const { accessLoading, accessResult, loginWithAccessCode } =
    useAccessCodeLogin();

  // Admin
  const [adminEmail, setAdminEmail] = useState("passawit53@gmail.com");
  const [adminPassword, setAdminPassword] = useState("123456jjj");
  const { adminLoading, adminResult, loginAdmin } = useAdminLogin();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0
    },
    exit: { 
      opacity: 0, 
      x: 20
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

  const inputVariants = {
    focus: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-green-50">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(2px 2px at 20px 30px, #eee, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent), radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 160px 30px, #ddd, transparent)",
            "radial-gradient(2px 2px at 40px 30px, #eee, transparent), radial-gradient(2px 2px at 60px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 110px 40px, #fff, transparent), radial-gradient(1px 1px at 150px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(2px 2px at 180px 30px, #ddd, transparent)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div 
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-3xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Login
        </motion.h1>

        {/* Toggle Button */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setMode("user")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`px-6 py-2 rounded-l-full border transition-all duration-200
              ${
                mode === "user"
                  ? "bg-blue-600 text-white border-blue-600 shadow"
                  : "bg-gray-100 text-gray-600 border-gray-100 hover:bg-blue-100"
              }
            `}
          >
            ผู้ใช้ (Access Code)
          </motion.button>
          <motion.button
            onClick={() => setMode("admin")}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`px-6 py-2 rounded-r-full border transition-all duration-200
              ${
                mode === "admin"
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-gray-100 text-gray-600 border-gray-100 hover:bg-green-100"
              }
            `}
          >
            แอดมิน (Admin)
          </motion.button>
        </motion.div>

        {/* ฟอร์ม Access Code */}
        <AnimatePresence mode="wait">
          {mode === "user" && (
            <motion.div 
              key="user-form"
              className="flex flex-col gap-4 text-black"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.label 
                className="text-gray-700 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Access Code
              </motion.label>
              <motion.input
                type="text"
                placeholder="กรอก Access Code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                variants={inputVariants}
                whileFocus="focus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              />
              <motion.button
                onClick={() => loginWithAccessCode(accessCode)}
                disabled={accessLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {accessLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </motion.button>
              <AnimatePresence>
                {accessResult && (
                  <motion.div 
                    className="mt-2 text-sm text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {accessResult}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ฟอร์ม Admin */}
          {mode === "admin" && (
            <motion.div 
              key="admin-form"
              className="flex flex-col gap-4 text-black"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.label 
                className="text-gray-700 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Email
              </motion.label>
              <motion.input
                type="email"
                placeholder="Email"
                value="Demo Email"
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border border-green-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                variants={inputVariants}
                whileFocus="focus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              />
              <motion.label 
                className="text-gray-700 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Password
              </motion.label>
              <motion.input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-green-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                variants={inputVariants}
                whileFocus="focus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              />
              <motion.button
                onClick={() => loginAdmin("passawit53@gmail.com", adminPassword)}
                disabled={adminLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {adminLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบแอดมิน"}
              </motion.button>
              <AnimatePresence>
                {adminResult && (
                  <motion.div 
                    className="mt-2 text-sm text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {adminResult}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
