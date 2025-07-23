"use client";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useAuth() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/pages/home-landing');
    } catch (err) {
      console.error('Error logging out:', err);
      // แม้จะเกิดข้อผิดพลาดก็ให้ redirect ไปหน้า landing
      router.push('/pages/home-landing');
    }
  };

  return { logout };
} 