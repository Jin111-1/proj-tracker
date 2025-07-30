import { useState, useCallback } from 'react';
import axios from 'axios';

// สร้าง type สำหรับ Expense
export interface Expense {
  id: string;
  project_id: string;
  amount: number;
  description: string;
  detail?: string | null;
  expense_date: string;
  category?: string | null;
  vendor?: string | null;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// type สำหรับ payload ที่ใช้สร้าง/แก้ไข expense
export interface ExpensePayload {
  project_id: string;
  amount: number;
  description: string;
  detail?: string | null;
  expense_date: string;
  category?: string | null;
  vendor?: string | null;
}

// สร้าง type สำหรับข้อมูล chart data
export interface ChartData {
  label: string;
  total: number;
}

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.data?.error && typeof err.response.data.error === 'string') {
      return err.response.data.error;
    }
    if (err.message) {
      return err.message;
    }
  } else if (typeof err === 'object' && err !== null) {
    if ('message' in err && typeof (err as { message?: string }).message === 'string') {
      return (err as { message?: string }).message as string;
    }
  }
  return 'เกิดข้อผิดพลาด';
}

export function useExpenses(projectId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // เพิ่ม expense
  const addExpense = useCallback(async (payload: ExpensePayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/expenses', payload);
      await fetchExpenses();
      return res.data as Expense;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  // แก้ไข expense
  const updateExpense = useCallback(async (id: string, payload: Partial<ExpensePayload>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/expenses/${id}`, payload);
      await fetchExpenses();
      return res.data as Expense;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  // ดึงข้อมูลสำหรับกราฟ
  const fetchChartData = useCallback(async (groupBy: 'date' | 'category' = 'date'): Promise<ChartData[]> => {
    if (!projectId) return [];
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/expenses/chart-data?project_id=${projectId}&group_by=${groupBy}`);
      return res.data as ChartData[];
    } catch (err: unknown) {
      setError(getErrorMessage(err));
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