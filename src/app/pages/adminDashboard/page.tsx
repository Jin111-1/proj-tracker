"use client"

import { useState } from 'react';
import { useProjects } from '@/app/hooks/useProjects/page';
import { useAuth } from '@/app/hooks/useAuth/page';
import { useProjectForm } from '@/app/hooks/useProjectForm/page';
import { useProjectUtils } from '@/app/hooks/useProjectUtils/page';
import { useEditProject, type Project } from '@/app/hooks/useEditProject/page';
import { Plus, Eye, Edit, Trash2, Search, Filter, Calendar, DollarSign, Users, LogOut, X } from 'lucide-react';

export default function AdminDashboard() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Hooks
  const { 
    filteredProjects, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    loadProjects, 
    stats 
  } = useProjects();
  
  const { logout } = useAuth();
  const { 
    form, 
    isOpen: open, 
    loading: createLoading, 
    handleChange, 
    handleSubmit, 
    openModal: setOpen, 
    closeModal 
  } = useProjectForm(loadProjects);
  
  const { editProject, deleteProject, loading: editLoading } = useEditProject();
  const { 
    formatDate, 
    formatCurrency, 
    getStatusColor, 
    getStatusText 
  } = useProjectUtils();



  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setEditModalOpen(true);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบโปรเจ็คนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้')) {
      try {
        await deleteProject(projectId);
        loadProjects(); // โหลดโปรเจ็คใหม่
        alert('ลบโปรเจ็คสำเร็จ');
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('เกิดข้อผิดพลาดในการลบโปรเจ็ค');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updateData: any = {
        id: editingProject.id
      };

      // เตรียมข้อมูลสำหรับอัปเดต
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const access_code = formData.get('access_code') as string;
      const status = formData.get('status') as string;
      const progress_percentage = formData.get('progress_percentage') as string;
      const start_date = formData.get('start_date') as string;
      const estimated_end_date = formData.get('estimated_end_date') as string;
      const actual_end_date = formData.get('actual_end_date') as string;
      const budget = formData.get('budget') as string;

      if (name && name !== editingProject.name) updateData.name = name;
      if (description !== editingProject.description) updateData.description = description;
      if (access_code && access_code !== editingProject.access_code) updateData.access_code = access_code;
      if (status && status !== editingProject.status) updateData.status = status;
      if (progress_percentage !== (editingProject.progress_percentage || 0).toString()) {
        updateData.progress_percentage = Number(progress_percentage);
      }
      // จัดการวันที่ - ส่ง null ถ้าว่าง
      if (start_date !== editingProject.start_date) {
        updateData.start_date = start_date || null;
      }
      if (estimated_end_date !== editingProject.estimated_end_date) {
        updateData.estimated_end_date = estimated_end_date || null;
      }
      if (actual_end_date !== editingProject.actual_end_date) {
        updateData.actual_end_date = actual_end_date || null;
      }
      if (budget !== (editingProject.budget || 0).toString()) {
        updateData.budget = budget ? Number(budget) : null;
      }

      await editProject(updateData);
      loadProjects(); // โหลดโปรเจ็คใหม่
      setEditModalOpen(false);
      setEditingProject(null);
      alert('อัปเดตโปรเจ็คสำเร็จ');
    } catch (err) {
      console.error('Error updating project:', err);
      alert('เกิดข้อผิดพลาดในการอัปเดตโปรเจ็ค');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>จัดการโปรเจ็คทั้งหมด</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                <span>สร้างโปรเจ็ค</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">โปรเจ็คทั้งหมด</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">กำลังดำเนินการ</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">งบประมาณรวม</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาโปรเจ็ค..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="active">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">รายการโปรเจ็ค</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">กำลังโหลดโปรเจ็ค...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีโปรเจ็ค</h3>
              <p className="mt-1 text-sm text-gray-500">เริ่มต้นโดยการสร้างโปรเจ็คแรก</p>
        <button 
          onClick={() => setOpen(true)} 
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          สร้างโปรเจ็ค
        </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      โปรเจ็ค
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Access Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ความคืบหน้า
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      งบประมาณ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่สร้าง
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การดำเนินการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.description || '-'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{project.access_code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${project.progress_percentage || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{project.progress_percentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(project.budget)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(project.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => window.location.href = `/pages/project/${project.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditProject(project)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition"
                            title="แก้ไข"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition"
                            title="ลบ"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">สร้างโปรเจ็คใหม่</h2>
              </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อโปรเจ็ค *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสการเข้าถึง *
                </label>
                <input
                  type="text"
                  name="access_code"
                  value={form.access_code}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะ
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เปอร์เซ็นต์ความคืบหน้า
                </label>
                <input
                  type="number"
                  name="progress_percentage"
                  value={form.progress_percentage}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่เริ่ม
                </label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่คาดว่าจะเสร็จ
                </label>
                  <input
                    type="date"
                    name="estimated_end_date"
                    value={form.estimated_end_date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
              </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  งบประมาณ
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {createLoading ? 'กำลังสร้าง...' : 'สร้างโปรเจ็ค'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editModalOpen && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">แก้ไขโปรเจ็ค</h2>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อโปรเจ็ค *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProject.name}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียด
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProject.description || ''}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสการเข้าถึง *
                </label>
                <input
                  type="text"
                  name="access_code"
                  defaultValue={editingProject.access_code}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะ
                </label>
                <select
                  name="status"
                  defaultValue={editingProject.status}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">กำลังดำเนินการ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เปอร์เซ็นต์ความคืบหน้า
                </label>
                <input
                  type="number"
                  name="progress_percentage"
                  defaultValue={editingProject.progress_percentage || 0}
                  min={0}
                  max={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่เริ่ม
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={editingProject.start_date || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่คาดว่าจะเสร็จ
                  </label>
                  <input
                    type="date"
                    name="estimated_end_date"
                    defaultValue={editingProject.estimated_end_date || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่เสร็จสิ้นจริง
                </label>
                <input
                  type="date"
                  name="actual_end_date"
                  defaultValue={editingProject.actual_end_date || ''}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  งบประมาณ
                </label>
                <input
                  type="number"
                  name="budget"
                  defaultValue={editingProject.budget || ''}
                  min={0}
                  step="0.01"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                >
                  {editLoading ? 'กำลังอัปเดต...' : 'อัปเดตโปรเจ็ค'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}