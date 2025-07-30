"use client";
import { useState, useCallback } from 'react';
import axios from 'axios';

// เพิ่ม type/interface สำหรับ Expense และ Payload
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

export interface ExpensePayload {
  project_id: string;
  amount: number;
  description: string;
  detail?: string | null;
  expense_date: string;
  category?: string | null;
  vendor?: string | null;
}

export function useExpenses(projectId?: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = projectId ? `/api/expenses/project/${projectId}` : '/api/expenses';
      const response = await axios.get(url);
      const data = response.data;
      // ถ้า data เป็น object และมี expenses ให้ใช้ expenses
      if (data && typeof data === 'object' && 'expenses' in data && Array.isArray(data.expenses)) {
        setExpenses(data.expenses);
      } else if (Array.isArray(data)) {
        setExpenses(data);
      } else {
        setExpenses([]);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addExpense = useCallback(async (payload: ExpensePayload) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/expenses', payload);
      await fetchExpenses();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
      } else {
        setError('เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id: string, payload: Partial<ExpensePayload>) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/api/expenses/${id}`, payload);
      await fetchExpenses();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      } else {
        setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/expenses/${id}`);
      await fetchExpenses();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
      } else {
        setError('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
} 