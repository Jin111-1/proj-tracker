"use client";
import { useState, useCallback } from 'react';
import axios from 'axios';

export function useExpenses(projectId?: string) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = projectId ? `/api/expenses/project/${projectId}` : '/api/expenses';
      const response = await axios.get(url);
      setExpenses(response.data || []);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addExpense = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/expenses', payload);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id: string, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/api/expenses/${id}`, payload);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
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