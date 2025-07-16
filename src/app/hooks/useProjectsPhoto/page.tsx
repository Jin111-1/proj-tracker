import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useProjectImages(projectId: string | undefined) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/project/${projectId}/images`);
      setImages(response.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'เกิดข้อผิดพลาดในการโหลดรูปภาพ');
      setImages([]);
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
    reload: fetchImages
  };
} 