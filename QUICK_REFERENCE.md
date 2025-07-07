# 📋 Quick Reference - Interior Tracker

## 🎯 ภาพรวม
**Interior Tracker** - ระบบ Web App สำหรับติดตามงานตกแต่งภายใน
- **ลูกค้า**: เข้าดูความคืบหน้าด้วย Access Code
- **แอดมิน**: จัดการงาน, รูปภาพ, นัดหมาย, วิเคราะห์ต้นทุน

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## 📁 โครงสร้างหลัก
```
src/app/
├── api/           # API Routes
├── hooks/         # Custom Hooks
├── pages/         # Pages
└── utils/         # Utilities
```

## 🔐 Authentication
- **Admin**: Email/Password + Role 'admin'
- **Customer**: Access Code (6 chars: A-Z, 0-9)

## 📊 Database Tables
- `users` - ผู้ใช้ (admin/guest)
- `projects` - โปรเจ็ค
- `project_images` - รูปภาพ
- `project_documents` - เอกสาร
- `project_messages` - ข้อความ
- `project_appointments` - นัดหมาย
- `project_expenses` - รายรับรายจ่าย

## 🚀 สถานะการพัฒนา

### ✅ เสร็จแล้ว
- โครงสร้างโปรเจ็ค
- Authentication (Admin + Access Code)
- หน้าเข้าสู่ระบบ
- API สร้างโปรเจ็ค
- แดชบอร์ดแอดมินพื้นฐาน

### 🔄 กำลังพัฒนา
- ระบบอัปโหลดรูปภาพ
- แดชบอร์ดลูกค้า
- ระบบข้อความ

### 📋 ต้องทำ
- ระบบนัดหมาย (Google Calendar)
- ระบบเอกสาร
- ระบบวิเคราะห์ต้นทุน
- UI/UX ปรับปรุง

## 🔧 การรันโปรเจ็ค
```bash
npm install
npm run dev
```

## 🌐 Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 📞 API Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/loginWithAccessCode` - Customer login
- `POST /api/create-proj` - สร้างโปรเจ็ค
- `GET /api/project/[id]` - ดูโปรเจ็ค

## 🎨 UI Components
- **Buttons**: Primary, Secondary, Danger
- **Cards**: Project, Image, Document
- **Forms**: Input, Textarea, File Upload
- **Navigation**: Sidebar, Breadcrumb

## 📱 Responsive Design
- Mobile First
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

## 🔒 Security
- JWT tokens
- Row Level Security (RLS)
- Input validation
- File type/size limits

## 📈 Performance
- Image compression (client-side)
- Lazy loading
- Code splitting
- Caching strategy

## 🧪 Testing
- Unit tests (Jest)
- Component tests (RTL)
- E2E tests (Cypress)

## 📊 Monitoring
- Error tracking
- Performance monitoring
- User analytics

---

**เอกสารเพิ่มเติม**:
- `PROJECT_OVERVIEW.md` - ภาพรวมละเอียด
- `TECHNICAL_DETAILS.md` - รายละเอียดทางเทคนิค
- `DEVELOPMENT_ROADMAP.md` - แผนการพัฒนา

**เวอร์ชัน**: 0.1.0
**อัปเดตล่าสุด**: วันที่สร้างเอกสารนี้ 