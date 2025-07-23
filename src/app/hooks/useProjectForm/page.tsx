import { useState } from 'react';
import { useCreateProject } from '@/app/hooks/useCreateProjects';
import { useRouter } from 'next/navigation';

export interface ProjectFormData {
  name: string;
  description: string;
  access_code: string;
  bucket_name: string;
  status: string;
  progress_percentage: string;
  start_date: string;
  estimated_end_date: string;
  actual_end_date: string;
  budget: string;
}

const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  access_code: '',
  bucket_name: '',
  status: 'active',
  progress_percentage: '0',
  start_date: '',
  estimated_end_date: '',
  actual_end_date: '',
  budget: '',
};

export function useProjectForm(onSuccess?: () => void) {
  const [form, setForm] = useState<ProjectFormData>(initialFormData);
  const [isOpen, setIsOpen] = useState(false);
  const { createProject, loading, error } = useCreateProject();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormData);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      name, description, access_code, bucket_name, status, progress_percentage,
      start_date, estimated_end_date, actual_end_date, budget
    } = form;
    
    try {
      const result = await createProject({
        name,
        description,
        access_code,
        bucket_name: bucket_name || undefined,
        status: status || undefined,
        progress_percentage: progress_percentage ? Number(progress_percentage) : undefined,
        start_date: start_date || undefined,
        estimated_end_date: estimated_end_date || undefined,
        actual_end_date: actual_end_date || undefined,
        budget: budget ? Number(budget) : undefined,
      });
      
      // นำทางไปยังหน้าโปรเจ็ค
      if (result?.data?.project_id) {
        router.push(`/pages/project/${result.data.project_id}`);
      }
      
      // รีเซ็ตฟอร์มและปิด modal
      resetForm();
      closeModal();
      
      // เรียก callback function ถ้ามี
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return {
    form,
    isOpen,
    loading,
    error,
    handleChange,
    handleSubmit,
    openModal,
    closeModal,
    resetForm
  };
} 