"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface ProjectImage {
  id: string;
  data?: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  description?: string;
  created_at: string;
  uploaded_by?: string;
  users?: {
    email?: string;
    full_name?: string;
  };
}

export function useProjectImages(projectId: string | undefined) {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/project/${projectId}/images`);
      console.log(response.data);
      setImages(response.data.data as ProjectImage[]);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    fetchImages,
  };
} 