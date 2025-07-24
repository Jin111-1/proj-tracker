"use client";
import { useState } from "react";
import axios from "axios";

export interface EditProjectPayload {
  id: string | null;
  name?: string | null;
  description?: string | null;
  access_code?: string | null;
  bucket_name?: string | null;
  status?: 'active' | 'completed' | 'cancelled' | null;
  progress_percentage?: number | null;
  start_date?: string | null;
  estimated_end_date?: string | null;
  actual_end_date?: string | null;
  budget?: number | null;
}

export interface Project {
  id: string | null;
  name: string | null;
  description: string | null;
  access_code: string | null;
  bucket_name: string | null;
  status: string | null;
  progress_percentage: number | null;
  start_date: string | null;
  estimated_end_date: string | null;
  actual_end_date: string | null;
  budget: number | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useEditProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Project | null>(null);

  const editProject = async (payload: EditProjectPayload): Promise<Project> => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const result = await axios.put("/api/edit-proj", payload);
      if (result.status !== 200) throw new Error(result.data.error || "เกิดข้อผิดพลาด");
      setData(result.data as Project);
      return result.data as Project;
    } catch (err: unknown) {
      let errorMessage = "เกิดข้อผิดพลาด";
      if (err && typeof err === "object") {
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
          errorMessage = (err.response.data as { error?: string }).error || errorMessage;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const result = await axios.delete(`/api/edit-proj?id=${projectId}`);
      if (result.status !== 200) throw new Error(result.data.error || "เกิดข้อผิดพลาด");
      setData(null);
      return { success: true, message: result.data?.message };
    } catch (err: unknown) {
      let errorMessage = "เกิดข้อผิดพลาด";
      if (err && typeof err === "object") {
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'error' in err.response.data) {
          errorMessage = (err.response.data as { error?: string }).error || errorMessage;
        } else if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { editProject, deleteProject, loading, error, data };
} 