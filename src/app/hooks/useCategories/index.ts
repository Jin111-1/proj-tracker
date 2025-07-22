import { useState, useCallback } from 'react';
import axios from 'axios';

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ดึงหมวดหมู่
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
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
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
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