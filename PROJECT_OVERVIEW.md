# 🏠 Interior Tracker - ระบบติดตามงานตกแต่งภายใน

## 📋 ภาพรวมโปรเจ็ค

**Interior Tracker** เป็นระบบ Web Application สำหรับให้ "ลูกค้า" เข้าดูความคืบหน้างานตกแต่งภายใน และให้ "แอดมิน" จัดการงาน, รูปภาพ, นัดหมาย และวิเคราะห์ต้นทุน

## 🎯 แนวทางการใช้งาน

### ✅ ฝั่งลูกค้า (Customer Portal)
- **เข้าสู่ระบบด้วย Access Code**: ใช้รหัสโปรเจ็คที่ได้รับจากแอดมิน
- **ดูภาพอัปเดตงาน**: แสดงภาพแบบเรียงตามวัน
- **Progress Bar**: แสดงเปอร์เซ็นต์ความคืบหน้างาน
- **นัดหมายกับทีมงาน**: เชื่อมต่อกับ Google Calendar
- **เอกสารแนบ**: ดูใบเสนอราคา, แบบ, เอกสารต่างๆ
- **ฝากข้อความ**: ส่งข้อความถึงทีมงาน
- **ดาวน์โหลดภาพ**: ดาวน์โหลด ZIP ไฟล์ภาพทั้งหมด

### ✅ ฝั่งแอดมิน (Admin Portal)
- **สร้างโปรเจ็คใหม่**: สร้าง bucket storage สำหรับอัปโหลดภาพ
- **อัปโหลดรูป**: พร้อมบีบอัดฝั่ง client
- **จัดการความคืบหน้า**: เพิ่ม/แก้ไขเปอร์เซ็นต์ความคืบหน้า
- **ตอบข้อความ**: ตอบกลับข้อความจากลูกค้า
- **อัปโหลดเอกสาร**: PDF, DWG, Excel และไฟล์อื่นๆ
- **วิเคราะห์ต้นทุน**: ใส่รายรับรายจ่าย + Dashboard วิเคราะห์

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Next.js 15.3.4**: React Framework
- **React 19**: UI Library
- **TypeScript**: Type Safety
- **Tailwind CSS**: Styling Framework
- **Axios**: HTTP Client

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Storage (สำหรับรูปภาพและไฟล์)
  - Real-time subscriptions

### Authentication
- **Supabase Auth**: ระบบยืนยันตัวตน
- **Access Code Login**: สำหรับลูกค้า
- **Email/Password**: สำหรับแอดมิน
- **Cookie-based Sessions**: จัดการ session

## 📁 โครงสร้างโปรเจ็ค

```
inte-track/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/              # Authentication APIs
│   │   │   │   ├── login/
│   │   │   │   ├── loginWithAccessCode/
│   │   │   │   ├── logout/
│   │   │   │   ├── register/
│   │   │   │   └── user/
│   │   │   ├── create-proj/       # สร้างโปรเจ็ค
│   │   │   ├── create-table/      # สร้างตาราง
│   │   │   └── project/[id]/      # จัดการโปรเจ็ค
│   │   ├── hooks/                 # Custom Hooks
│   │   │   ├── useAccessCodeLogin/
│   │   │   ├── useAdminLogin/
│   │   │   └── useCreateProjects/
│   │   ├── pages/                 # หน้าต่างๆ
│   │   │   ├── adminDashboard/    # แดชบอร์ดแอดมิน
│   │   │   ├── userDashboard/     # แดชบอร์ดลูกค้า
│   │   │   ├── project/[id]/      # หน้าโปรเจ็ค
│   │   │   ├── createTable/       # สร้างตาราง
│   │   │   └── home-landing/      # หน้าเข้าสู่ระบบ
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── utils/                     # Utilities
│       ├── supabase.ts           # Supabase Client
│       ├── supabaseCookie.ts     # Cookie Management
│       └── decodeSupabaseAuthCookie.ts
├── public/                        # Static Files
├── package.json
└── README.md
```

## 🔐 ระบบ Authentication

### ลูกค้า (Customer)
- **Access Code Login**: ใช้รหัส 6 ตัวอักษร (A-Z, 0-9)
- **Guest User**: สร้างอัตโนมัติเมื่อ login ด้วย access code
- **Session Management**: ใช้ cookies

### แอดมิน (Admin)
- **Email/Password**: ลงทะเบียนและเข้าสู่ระบบ
- **Role-based Access**: กำหนด role เป็น 'admin'
- **Secure Routes**: ป้องกันการเข้าถึงหน้าแอดมิน

## 📊 โครงสร้างฐานข้อมูล

### ตารางหลัก
1. **users**: ข้อมูลผู้ใช้ (admin และ guest)
2. **projects**: ข้อมูลโปรเจ็ค
   - name, description, access_code
   - progress_percentage, status
   - start_date, estimated_end_date, actual_end_date
   - budget, bucket_name
   - created_by (user_id)

### ตารางที่ต้องเพิ่ม
1. **project_images**: รูปภาพในโปรเจ็ค
2. **project_documents**: เอกสารแนบ
3. **project_messages**: ข้อความระหว่างลูกค้า-แอดมิน
4. **project_appointments**: นัดหมาย
5. **project_expenses**: รายรับรายจ่าย

## 🚀 สถานะการพัฒนา

### ✅ เสร็จแล้ว
- [x] โครงสร้างโปรเจ็ค Next.js
- [x] การเชื่อมต่อ Supabase
- [x] ระบบ Authentication (Admin + Access Code)
- [x] หน้าเข้าสู่ระบบ (Toggle User/Admin)
- [x] API สร้างโปรเจ็ค
- [x] แดชบอร์ดแอดมิน (สร้างโปรเจ็ค)
- [x] หน้าแสดงรายละเอียดโปรเจ็ค
- [x] ระบบ Access Code Generation

### 🔄 กำลังพัฒนา
- [ ] ระบบอัปโหลดรูปภาพ
- [ ] แดชบอร์ดลูกค้า
- [ ] ระบบข้อความ
- [ ] ระบบนัดหมาย

### 📋 ต้องทำ
- [ ] ระบบอัปโหลดเอกสาร
- [ ] ระบบวิเคราะห์ต้นทุน
- [ ] การเชื่อมต่อ Google Calendar
- [ ] ระบบดาวน์โหลด ZIP
- [ ] UI/UX ปรับปรุง
- [ ] ระบบแจ้งเตือน
- [ ] Dashboard Analytics

## 🔧 การติดตั้งและรัน

```bash
# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev

# Build สำหรับ production
npm run build

# รันในโหมด production
npm start
```

## 🌐 Environment Variables

สร้างไฟล์ `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 หมายเหตุ

- โปรเจ็คใช้ Supabase เป็น Backend-as-a-Service
- ระบบ Access Code สร้างแบบสุ่ม 6 ตัวอักษร
- ใช้ Cookie-based authentication สำหรับ session management
- รองรับการอัปโหลดไฟล์ผ่าน Supabase Storage
- ใช้ TypeScript เพื่อ type safety

---

**อัปเดตล่าสุด**: วันที่สร้างเอกสารนี้
**เวอร์ชัน**: 0.1.0
**สถานะ**: กำลังพัฒนา 