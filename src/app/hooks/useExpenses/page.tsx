import { useState, useCallback } from 'react';
import axios from 'axios';

export function useExpenses(projectId?: string) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ดึง expenses ตาม project
  const fetchExpenses = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/expenses/project/${projectId}`);
      setExpenses(res.data.expenses || []);
      setTotal(res.data.totalAmount || 0);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // เพิ่ม expense
  const addExpense = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/expenses', payload);
      await fetchExpenses();
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  // แก้ไข expense
  const updateExpense = useCallback(async (id: string, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/expenses/${id}`, payload);
      await fetchExpenses();
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  // ลบ expense
  const deleteExpense = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/expenses/${id}`);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  // ดึงข้อมูลสำหรับกราฟ
  const fetchChartData = useCallback(async (groupBy: 'date' | 'category' = 'date') => {
    if (!projectId) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/expenses/chart-data?project_id=${projectId}&group_by=${groupBy}`);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    expenses,
    total,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchChartData
  };
} 