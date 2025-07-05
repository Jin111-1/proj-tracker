"use client"

import { useState } from 'react';
import { useCreateProject } from '@/app/hooks/useCreateProjects/page';

export default function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const { createProject, loading, error, data } = useCreateProject();

  // State สำหรับแต่ละฟิลด์
  const [form, setForm] = useState({
    name: '',
    description: '',
    access_code: '',
    bucket_name: '',
    status: '',
    progress_percentage: '',
    start_date: '',
    estimated_end_date: '',
    actual_end_date: '',
    budget: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ส่งเฉพาะฟิลด์ที่จำเป็นและมีค่า
    const {
      name, description, access_code, bucket_name, status, progress_percentage,
      start_date, estimated_end_date, actual_end_date, budget
    } = form;
    await createProject({
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
  };

  return (
    <div style={{ color: '#000', backgroundColor: '#fff' }}>
      <h1>Admin Dashboard</h1>
      
      <div style={{ margin: '16px 0' }}>
        <button 
          onClick={() => setOpen(true)} 
          style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          สร้างโปรเจ็ค
        </button>
      </div>

      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 400 }}>
            <h2>สร้างโปรเจ็คใหม่</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label>ชื่อโปรเจ็ค*<br/>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>รายละเอียด<br/>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={2} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>รหัสการเข้าถึง*<br/>
                  <input type="text" name="access_code" value={form.access_code} onChange={handleChange} required style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>ชื่อ bucket<br/>
                  <input type="text" name="bucket_name" value={form.bucket_name} onChange={handleChange} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>สถานะ<br/>
                  <input type="text" name="status" value={form.status} onChange={handleChange} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>เปอร์เซ็นต์ความคืบหน้า<br/>
                  <input type="number" name="progress_percentage" value={form.progress_percentage} onChange={handleChange} min={0} max={100} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>วันที่เริ่ม<br/>
                  <input type="date" name="start_date" value={form.start_date} onChange={handleChange} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>วันที่คาดว่าจะเสร็จ<br/>
                  <input type="date" name="estimated_end_date" value={form.estimated_end_date} onChange={handleChange} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>วันที่เสร็จจริง<br/>
                  <input type="date" name="actual_end_date" value={form.actual_end_date} onChange={handleChange} style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>งบประมาณ<br/>
                  <input type="number" name="budget" value={form.budget} onChange={handleChange} min={0} step="0.01" style={{ width: '100%' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setOpen(false)}>ยกเลิก</button>
                <button type="submit">สร้างโปรเจ็ค</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}