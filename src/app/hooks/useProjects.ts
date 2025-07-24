"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Project } from './useEditProject';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/projects');
      setProjects(response.data || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error loading projects:', err);
        setError(err.message || 'เกิดข้อผิดพลาดในการโหลดโปรเจ็ค');
      } else {
        setError('เกิดข้อผิดพลาดในการโหลดโปรเจ็ค');
      }
    } finally {
      setLoading(false);
    }
  };

  // โหลดโปรเจ็คเมื่อ component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // กรองโปรเจ็คตาม search และ status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.access_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // สถิติโปรเจ็ค
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    cancelled: projects.filter(p => p.status === 'cancelled').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  };

  return {
    projects,
    filteredProjects,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    loadProjects,
    stats,
  };
} 