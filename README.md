# 🏠 Interior Tracker

ระบบจัดการโปรเจ็คตกแต่งภายในที่ใช้งานง่ายและมีประสิทธิภาพ ติดตามความคืบหน้า จัดการงบประมาณ และควบคุมคุณภาพงานได้อย่างครบครัน

## 📌 Project Description

Interior Tracker เป็นแพลตฟอร์มจัดการโปรเจ็คตกแต่งภายในที่ช่วยให้ผู้ใช้สามารถ:

- สร้างและจัดการโปรเจ็คตกแต่งภายในได้อย่างเป็นระบบ
- ติดตามความคืบหน้าของงานแบบเรียลไทม์
- จัดการงบประมาณและค่าใช้จ่ายได้อย่างแม่นยำ
- อัปโหลดและจัดการรูปภาพงานได้อย่างเป็นระบบ
- ดูรายงานและสถิติต่างๆ ในรูปแบบกราฟ
- ระบบ Authentication ที่ปลอดภัยสำหรับ Admin และ Guest User

## 🧰 Technologies Used

### Frontend:
- ⚛️ **Next.js 15.3.4** - React Framework
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 📊 **Chart.js & React-Chartjs-2** - สำหรับแสดงกราฟและสถิติ
- 🖼️ **React-Dropzone** - สำหรับอัปโหลดไฟล์
- ✂️ **React-Image-Crop** - สำหรับตัดแต่งรูปภาพ

### Backend:
- 🛠️ **Supabase** - PostgreSQL Database & Backend as a Service
- 🔐 **Supabase Auth** - ระบบ Authentication
- 📁 **Supabase Storage** - จัดเก็บไฟล์และรูปภาพ

### Development Tools:
- 🔧 **TypeScript** - Type safety
- 🚀 **ESLint** - Code linting
- 📦 **Axios** - HTTP client

## 🌟 Key Features

### 🔐 User Management
- **ระบบ Authentication**: ลงทะเบียน, เข้าสู่ระบบ, จัดการโปรไฟล์
- **Role-based Access**: Admin และ Guest User
- **Access Code System**: สำหรับให้ลูกค้าเข้าถึงโปรเจ็คได้

### 📊 Project Management
- **สร้างโปรเจ็ค**: กำหนดชื่อ, คำอธิบาย, งบประมาณ, วันที่
- **ติดตามความคืบหน้า**: แสดงเปอร์เซ็นต์ความคืบหน้าแบบเรียลไทม์
- **สถานะโปรเจ็ค**: กำลังดำเนินการ, เสร็จสิ้น, ยกเลิก
- **จัดการรูปภาพ**: อัปโหลด, ดู, จัดการรูปภาพงาน

### 💰 Expense Management
- **บันทึกค่าใช้จ่าย**: เพิ่ม, แก้ไข, ลบค่าใช้จ่าย
- **หมวดหมู่ค่าใช้จ่าย**: จัดกลุ่มค่าใช้จ่ายตามประเภท
- **กราฟและสถิติ**: แสดงข้อมูลในรูปแบบกราฟแท่ง, เส้น, วงกลม
- **รายงานสรุป**: สถิติรวม, แนวโน้ม, การเปรียบเทียบ

### 📈 Analytics & Reporting
- **Dashboard**: แสดงภาพรวมโปรเจ็คทั้งหมด
- **กราฟความคืบหน้า**: ติดตามความคืบหน้าตามเวลา
- **สถิติค่าใช้จ่าย**: วิเคราะห์ค่าใช้จ่ายตามหมวดหมู่และเวลา
- **รายงานสรุป**: ส่งออกข้อมูลสำหรับการวิเคราะห์

## 💡 Why These Technologies?

- **Next.js & React**: สำหรับการพัฒนาเว็บแอปพลิเคชันที่รวดเร็ว, SEO-friendly และมีประสิทธิภาพ
- **Supabase**: ให้บริการ Backend ที่ครบครัน, ปลอดภัย และใช้งานง่าย
- **Tailwind CSS**: ช่วยในการออกแบบ UI ที่สวยงามและ responsive ได้อย่างรวดเร็ว
- **Chart.js**: แสดงข้อมูลสถิติและกราฟได้อย่างสวยงามและเข้าใจง่าย

## 📚 Table of Contents

- [Project Description](#-project-description)
- [Technologies Used](#-technologies-used)
- [Key Features](#-key-features)
- [Why These Technologies?](#-why-these-technologies)
- [Installation & Usage](#️-installation--usage)
- [Usage Guide](#-usage-guide)
- [Project Architecture](#-project-architecture)
- [Database Schema](#-database-schema)
- [Contributors](#-contributors)

## ⚙️ Installation & Usage

### 1. Clone the repository
```bash
git clone <repository-url>
cd inte-track
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set environment variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์หลักและกรอกค่าต่อไปนี้:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the development server
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่: http://localhost:3000

## 🎯 Usage Guide

### สำหรับ Admin
- **จัดการโปรเจ็ค**: สร้าง, แก้ไข, ลบโปรเจ็ค
- **ดูสถิติ**: ดูภาพรวมโปรเจ็คทั้งหมดและค่าใช้จ่าย
- **จัดการผู้ใช้**: ควบคุมการเข้าถึงระบบ

### สำหรับ Guest User (ลูกค้า)
- **เข้าถึงโปรเจ็ค**: ใช้ Access Code เพื่อเข้าถึงโปรเจ็ค
- **ดูความคืบหน้า**: ติดตามความคืบหน้าของงาน
- **ดูรูปภาพ**: ดูรูปภาพงานที่อัปโหลดแล้ว

### การใช้งานหลัก
1. **สร้างโปรเจ็ค**: Admin สร้างโปรเจ็คใหม่พร้อม Access Code
2. **แชร์ Access Code**: ส่ง Access Code ให้ลูกค้า
3. **ติดตามงาน**: อัปโหลดรูปภาพและบันทึกความคืบหน้า
4. **จัดการค่าใช้จ่าย**: บันทึกค่าใช้จ่ายและดูสถิติ
5. **ดูรายงาน**: วิเคราะห์ข้อมูลผ่านกราฟและสถิติ

## 📂 Project Architecture

```
interior-tracker/
├── 📦 inte-track/                    # โปรเจ็คหลัก
│   ├── 🌐 public/                    # ไฟล์ static
│   │   └── 🖼️ *.svg                 # ไอคอนและรูปภาพ
│   │
│   ├── 💻 src/                       # โค้ดหลัก
│   │   ├── 📄 app/                   # Next.js App Router
│   │   │   ├── 🔌 api/               # API Endpoints
│   │   │   │   ├── 🔐 auth/          # Authentication APIs
│   │   │   │   ├── 📊 expenses/      # Expense Management APIs
│   │   │   │   ├── 🏗️ project/       # Project Management APIs
│   │   │   │   └── 📋 categories/    # Category Management APIs
│   │   │   │
│   │   │   ├── 🎣 hooks/             # Custom React Hooks
│   │   │   │   ├── useAuth.ts        # Authentication hooks
│   │   │   │   ├── useProjects.ts    # Project management hooks
│   │   │   │   ├── useExpenses/      # Expense management hooks
│   │   │   │   └── useProjectUtils/  # Utility hooks
│   │   │   │
│   │   │   ├── 📄 pages/             # Application Pages
│   │   │   │   ├── 🏠 home-landing/  # หน้าหลัก
│   │   │   │   ├── 👤 userDashboard/ # แดชบอร์ดผู้ใช้
│   │   │   │   ├── 👨‍💼 adminDashboard/ # แดชบอร์ดแอดมิน
│   │   │   │   ├── 🏗️ project/       # หน้าโปรเจ็ค
│   │   │   │   └── 💰 expensesSection/ # หน้าจัดการค่าใช้จ่าย
│   │   │   │
│   │   │   ├── 📄 layout.tsx         # Layout หลัก
│   │   │   ├── 📄 page.tsx           # หน้าแรก
│   │   │   └── 🎨 globals.css        # Global styles
│   │   │
│   │   └── 🛠️ utils/                 # Utility functions
│   │       ├── supabase.ts           # Supabase configuration
│   │       └── supabaseCookie.ts     # Cookie management
│   │
│   ├── ⚙️ next.config.ts             # Next.js configuration
│   ├── 📝 package.json               # Dependencies
│   ├── 🎨 tailwind.config.js         # Tailwind configuration
│   └── 🔧 tsconfig.json              # TypeScript configuration
│
└── 📜 README.md                      # Project documentation
```

## 🗄️ Database Schema

### Core Tables

#### Users
- `id` - User ID (UUID)
- `email` - Email address
- `full_name` - Full name
- `role` - User role (admin/guest)
- `created_at` - Creation timestamp

#### Projects
- `id` - Project ID (UUID)
- `name` - Project name
- `description` - Project description
- `access_code` - Unique access code for guests
- `status` - Project status
- `progress_percentage` - Progress percentage
- `budget` - Project budget
- `start_date` - Start date
- `estimated_end_date` - Estimated end date
- `actual_end_date` - Actual end date
- `bucket_name` - Storage bucket name
- `created_at` - Creation timestamp

#### Expenses
- `id` - Expense ID (UUID)
- `project_id` - Reference to project
- `category` - Expense category
- `description` - Expense description
- `amount` - Expense amount
- `expense_date` - Expense date
- `created_at` - Creation timestamp

#### Project_Images
- `id` - Image ID (UUID)
- `project_id` - Reference to project
- `file_name` - Original file name
- `file_path` - Storage file path
- `file_size` - File size
- `created_at` - Creation timestamp

## 👨‍💻 Contributors

- **Development Team** - Interior Tracker Development Team
- **UI/UX Design** - Modern and intuitive interface design
- **Backend Architecture** - Scalable and secure backend implementation

## 🙏 Acknowledgments

- **Supabase** - สำหรับ Backend services ที่ครบครัน
- **Next.js Team** - สำหรับ React framework ที่ยอดเยี่ยม
- **Tailwind CSS** - สำหรับ CSS framework ที่ใช้งานง่าย
- **Chart.js** - สำหรับ library แสดงกราฟที่สวยงาม

---
