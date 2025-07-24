"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";

export interface CreateProjectPayload {
  name: string;
  description?: string;
  access_code?: string;
  bucket_name?: string;
  status?: string;
  progress_percentage?: number;
  start_date?: string;
  estimated_end_date?: string;
  actual_end_date?: string;
  budget?: number;
}

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AxiosResponse | null>(null);

  const createProject = async (payload: CreateProjectPayload) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // ดึง user id จาก /api/auth/user
      const userRes = await axios.get('/api/auth/user');
      const userId = userRes.data?.user?.id;
      if (!userId) throw new Error('ไม่พบข้อมูลผู้ใช้ กรุณา login ใหม่');
      // แนบ created_by ไปกับ payload
      const result = await axios.post("/api/create-proj", { ...payload, created_by: userId });
      if (result.status !== 200) throw new Error(result.data.error || "เกิดข้อผิดพลาด");
      setData(result);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "เกิดข้อผิดพลาด");
        throw err;
      } else {
        setError("เกิดข้อผิดพลาด");
        throw new Error("เกิดข้อผิดพลาด");
      }
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error, data };
} 