"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/app/hooks/useProjects";
import { useProjectImages, ProjectImage } from "@/app/hooks/useProjectsPhoto";
import { useProjectUtils } from "@/app/hooks/useProjectUtils/useProjectUtils";
import {
  Eye,
  Calendar,
  DollarSign,
  Percent,
  Image as ImageIcon,
  Maximize2,
  X,
  LogOut,
} from "lucide-react";
import NextImage from "next/image";
import axios from "axios";

interface UserProject {
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

export default function UserDashboard() {
  const router = useRouter();
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(
    null
  );
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "images">("overview");

  const { formatDate, formatCurrency, getStatusColor, getStatusText } =
    useProjectUtils();

  // โหลดโปรเจ็คของผู้ใช้
  const loadUserProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("/api/projects");
      setUserProjects(response.data || []);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(
          (err as { message?: string }).message ||
            "เกิดข้อผิดพลาดในการโหลดโปรเจ็ค"
        );
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดโปรเจ็ค");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProjects();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProjectClick = (project: UserProject) => {
    setSelectedProject(project);
    setActiveTab("overview");
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadUserProjects}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // แสดงรายการโปรเจ็ค
  if (!selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                แดชบอร์ดผู้ใช้
              </h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <LogOut className="h-4 w-4" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {userProjects.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                ไม่มีโปรเจ็ค
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                โปรเจ็คจะปรากฏที่นี่เมื่อมีการสร้าง
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        project.status || ""
                      )}`}
                    >
                      {getStatusText(project.status || "")}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || "ไม่มีคำอธิบาย"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ความคืบหน้า:</span>
                      <span className="font-medium">
                        {project.progress_percentage || 0}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${project.progress_percentage || 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">วันที่เริ่ม:</span>
                      <span className="font-medium">
                        {formatDate(project.start_date || "")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    <Eye className="h-4 w-4 mr-1" />
                    ดูรายละเอียด
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // แสดงรายละเอียดโปรเจ็ค
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToProjects}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                ← กลับไปยังรายการโปรเจ็ค
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedProject.name}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ภาพรวม
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "images"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              รูปภาพ
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ข้อมูลพื้นฐาน */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ข้อมูลโปรเจ็ค
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ชื่อโปรเจ็ค
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProject.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      คำอธิบาย
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedProject.description || "ไม่มีคำอธิบาย"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      รหัสเข้าถึง
                    </label>
                    <p className="mt-1 font-mono text-sm text-gray-900">
                      {selectedProject.access_code}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      สถานะ
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        selectedProject.status || ""
                      )}`}
                    >
                      {getStatusText(selectedProject.status || "")}
                    </span>
                  </div>
                </div>
              </div>

              {/* สถิติและความคืบหน้า */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ความคืบหน้าและงบประมาณ
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ความคืบหน้า
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              selectedProject.progress_percentage || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedProject.progress_percentage || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        วันที่เริ่ม
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedProject.start_date || "")}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        วันที่คาดว่าจะเสร็จ
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedProject.estimated_end_date || "")}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        วันที่เสร็จสิ้นจริง
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedProject.actual_end_date
                          ? formatDate(selectedProject.actual_end_date)
                          : "ยังไม่เสร็จสิ้น"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "images" && (
          <ProjectImagesSection
            projectId={selectedProject.id}
            onImageClick={setSelectedImage}
          />
        )}
      </div>

      {/* Modal แสดงภาพเต็มจอ */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow hover:bg-opacity-100 transition z-10"
              title="ปิด"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
            <NextImage
              src={selectedImage.file_path}
              alt={selectedImage.file_name || "project image"}
              width={800}
              height={600}
              className="w-full max-h-[80vh] object-contain rounded-lg bg-white"
            />
            <div className="mt-4 text-center text-white">
              <div className="font-semibold">{selectedImage.file_name}</div>
              <div>
                {new Date(selectedImage.created_at).toLocaleDateString("th-TH")}
              </div>
              {selectedImage.users && (
                <div>
                  โดย:{" "}
                  {selectedImage.users.full_name || selectedImage.users.email}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component สำหรับแสดงรูปภาพ
function ProjectImagesSection({
  projectId,
  onImageClick,
}: {
  projectId: string;
  onImageClick: (image: ProjectImage) => void;
}) {
  const { images, loading, error, fetchImages } = useProjectImages(projectId);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">กำลังโหลดรูปภาพ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchImages}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">รูปภาพโปรเจ็ค</h2>
        <button
          onClick={fetchImages}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          รีเฟรช
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            ยังไม่มีรูปภาพ
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            รูปภาพจะปรากฏที่นี่เมื่อมีการอัปโหลด
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image: ProjectImage) => (
            <div key={image.id} className="group relative">
              <NextImage
                src={image.file_path}
                alt={image.file_name || "project image"}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => onImageClick(image)}
              />
              <button
                onClick={() => onImageClick(image)}
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition opacity-0 group-hover:opacity-100"
                title="แสดงภาพเต็มจอ"
              >
                <Maximize2 className="h-4 w-4 text-gray-700" />
              </button>
              <div className="mt-2 text-xs text-gray-500">
                <div className="font-medium truncate">{image.file_name}</div>
                <div>
                  {new Date(image.created_at).toLocaleDateString("th-TH")}
                </div>
                {image.users && (
                  <div className="truncate">
                    โดย: {image.users.full_name || image.users.email}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
