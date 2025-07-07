"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Upload, Image, FileText, MessageSquare, Calendar, DollarSign, ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  access_code: string;
  status: string;
  progress_percentage: number;
  start_date: string;
  estimated_end_date: string;
  actual_end_date: string;
  budget: number;
  bucket_name: string;
  created_at: string;
}

interface ProjectImage {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  description: string;
  created_at: string;
  uploaded_by: string;
  users: {
    email: string;
    full_name: string;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  
  const [project, setProject] = useState<Project | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'images' | 'documents' | 'messages' | 'appointments' | 'expenses'>('overview');
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!id) return;
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [projectRes, imagesRes] = await Promise.all([
        axios.get(`/api/project/${id}`),
        axios.get(`/api/project/${id}/images`)
      ]);
      setProject(projectRes.data);
      setImages(imagesRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'ไม่พบโปรเจ็ค');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      await axios.post(`/api/project/${id}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reload images
      const imagesRes = await axios.get(`/api/project/${id}/images`);
      setImages(imagesRes.data || []);
      setSelectedFiles([]);
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatCurrency = (amount: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลโปรเจ็ค...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status === 'completed' ? 'เสร็จสิ้น' :
                 project.status === 'in_progress' ? 'กำลังดำเนินการ' :
                 project.status || 'รอดำเนินการ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">ความคืบหน้า</h3>
            <span className="text-2xl font-bold text-blue-600">{project.progress_percentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${project.progress_percentage || 0}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'ภาพรวม', icon: Eye },
                { id: 'images', label: 'รูปภาพ', icon: Image },
                { id: 'documents', label: 'เอกสาร', icon: FileText },
                { id: 'messages', label: 'ข้อความ', icon: MessageSquare },
                { id: 'appointments', label: 'นัดหมาย', icon: Calendar },
                { id: 'expenses', label: 'ต้นทุน', icon: DollarSign },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลโปรเจ็ค</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">รายละเอียด:</span>
                        <span className="text-gray-900">{project.description || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">รหัสการเข้าถึง:</span>
                        <span className="font-mono text-gray-900">{project.access_code}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">งบประมาณ:</span>
                        <span className="text-gray-900">{formatCurrency(project.budget)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">กำหนดเวลา</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่เริ่ม:</span>
                        <span className="text-gray-900">{formatDate(project.start_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่คาดว่าจะเสร็จ:</span>
                        <span className="text-gray-900">{formatDate(project.estimated_end_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">วันที่เสร็จจริง:</span>
                        <span className="text-gray-900">{formatDate(project.actual_end_date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          เลือกรูปภาพเพื่ออัปโหลด
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG, GIF ขนาดไม่เกิน 10MB
                        </span>
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          handleFileSelect(files);
                        }}
                      />
                    </div>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-2">
                        เลือกแล้ว {selectedFiles.length} ไฟล์
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpload}
                          disabled={uploading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                        >
                          {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                        </button>
                        <button
                          onClick={() => setSelectedFiles([])}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Images Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="group relative">
                        <img
                          src={image.file_path}
                          alt={image.file_name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <div>{image.file_name}</div>
                          <div>{new Date(image.created_at).toLocaleDateString('th-TH')}</div>
                          {image.users && (
                            <div>โดย: {image.users.full_name || image.users.email}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">ยังไม่มีรูปภาพ</h3>
                    <p className="mt-1 text-sm text-gray-500">เริ่มต้นโดยการอัปโหลดรูปภาพแรก</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">ระบบเอกสาร</h3>
                <p className="mt-1 text-sm text-gray-500">กำลังพัฒนา - จะเปิดใช้งานเร็วๆ นี้</p>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">ระบบข้อความ</h3>
                <p className="mt-1 text-sm text-gray-500">กำลังพัฒนา - จะเปิดใช้งานเร็วๆ นี้</p>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">ระบบนัดหมาย</h3>
                <p className="mt-1 text-sm text-gray-500">กำลังพัฒนา - จะเปิดใช้งานเร็วๆ นี้</p>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">ระบบวิเคราะห์ต้นทุน</h3>
                <p className="mt-1 text-sm text-gray-500">กำลังพัฒนา - จะเปิดใช้งานเร็วๆ นี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 