import { useState, useCallback } from 'react';
import axios from 'axios';

// สร้าง type สำหรับ Category
export type Category = {
  id: number;
  name: string;
  // เพิ่ม field อื่นๆ ถ้ามี
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ดึงหมวดหมู่
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // เพิ่มหมวดหมู่ใหม่ (option)
  const addCategory = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/categories', { name });
      await fetchCategories();
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory
  };
} 