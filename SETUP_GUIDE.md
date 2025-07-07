# 🚀 คู่มือการติดตั้งและใช้งาน - Interior Tracker

## 📋 ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- npm หรือ yarn
- Supabase account
- Git

## 🔧 การติดตั้ง

### 1. Clone โปรเจ็ค
```bash
git clone <repository-url>
cd inte-track
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. ตั้งค่าฐานข้อมูล Supabase

#### 4.1 สร้างโปรเจ็ค Supabase
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจ็คใหม่
3. เก็บ URL และ Anon Key ไว้

#### 4.2 รัน SQL Script
1. ไปที่ SQL Editor ใน Supabase Dashboard
2. คัดลอกเนื้อหาจากไฟล์ `database-setup.sql`
3. รัน script ใน SQL Editor

**หมายเหตุ**: หากเกิดข้อผิดพลาด "trigger already exists" ให้รันไฟล์ `fix-trigger-error.sql` แทน

#### 4.3 ตั้งค่า Storage
1. ไปที่ Storage ใน Supabase Dashboard
2. สร้าง bucket ชื่อ `project-images`
3. ตั้งค่าเป็น Public

### 5. รันโปรเจ็ค
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 👥 การใช้งาน

### สำหรับแอดมิน

#### 1. ลงทะเบียนแอดมิน
1. ไปที่หน้าเข้าสู่ระบบ
2. เลือก "แอดมิน (Admin)"
3. คลิก "ลงทะเบียน" (ถ้ายังไม่มีบัญชี)
4. กรอก email และ password
5. ระบบจะสร้างบัญชีแอดมินให้อัตโนมัติ

#### 2. สร้างโปรเจ็คใหม่
1. เข้าสู่ระบบด้วยบัญชีแอดมิน
2. คลิก "สร้างโปรเจ็ค"
3. กรอกข้อมูลโปรเจ็ค:
   - ชื่อโปรเจ็ค
   - รายละเอียด
   - วันที่เริ่ม/เสร็จ
   - งบประมาณ
4. ระบบจะสร้าง Access Code อัตโนมัติ
5. ส่ง Access Code ให้ลูกค้า

#### 3. จัดการโปรเจ็ค
1. คลิกที่โปรเจ็คเพื่อดูรายละเอียด
2. อัปโหลดรูปภาพในแท็บ "รูปภาพ"
3. อัปเดตความคืบหน้า
4. ตอบข้อความจากลูกค้า

### สำหรับลูกค้า

#### 1. เข้าสู่ระบบ
1. ไปที่หน้าเข้าสู่ระบบ
2. เลือก "ผู้ใช้ (Access Code)"
3. กรอก Access Code ที่ได้รับจากแอดมิน
4. คลิก "เข้าสู่ระบบ"

#### 2. ดูความคืบหน้า
1. ดูภาพรวมโปรเจ็คในแท็บ "ภาพรวม"
2. ดูรูปภาพอัปเดตในแท็บ "รูปภาพ"
3. ดูความคืบหน้าใน Progress Bar

## 🛠️ การพัฒนา

### โครงสร้างโปรเจ็ค
```
src/
├── app/
│   ├── api/              # API Routes
│   ├── hooks/            # Custom Hooks
│   ├── pages/            # Pages
│   └── utils/            # Utilities
├── components/           # React Components
└── types/               # TypeScript Types
```

### การเพิ่มฟีเจอร์ใหม่

#### 1. สร้าง API Route
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Your API logic here
  return NextResponse.json({ message: 'Success' });
}
```

#### 2. สร้าง Page
```typescript
// src/app/pages/example/page.tsx
"use client"

export default function ExamplePage() {
  return (
    <div>
      <h1>Example Page</h1>
    </div>
  );
}
```

#### 3. สร้าง Component
```typescript
// src/components/Example.tsx
interface ExampleProps {
  title: string;
}

export default function Example({ title }: ExampleProps) {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}
```

### การทดสอบ
```bash
# รัน unit tests
npm test

# รัน e2e tests
npm run test:e2e

# รัน linting
npm run lint
```

## 🔒 ความปลอดภัย

### Authentication
- ใช้ Supabase Auth
- JWT tokens
- Session management ด้วย cookies

### Authorization
- Row Level Security (RLS) ในฐานข้อมูล
- Role-based access control
- API route protection

### Data Validation
- Input sanitization
- File type validation
- File size limits

## 📊 การติดตามและ Monitoring

### Error Tracking
- Console logging
- Error boundaries
- API error handling

### Performance
- Image optimization
- Code splitting
- Lazy loading

## 🚀 การ Deploy

### Vercel (แนะนำ)
1. เชื่อมต่อ GitHub repository กับ Vercel
2. ตั้งค่า environment variables
3. Deploy อัตโนมัติ

### Manual Deployment
```bash
# Build สำหรับ production
npm run build

# รันในโหมด production
npm start
```

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

#### 1. ไม่สามารถเชื่อมต่อ Supabase ได้
- ตรวจสอบ environment variables
- ตรวจสอบ Supabase project URL และ key
- ตรวจสอบ network connection

#### 2. ไม่สามารถอัปโหลดรูปภาพได้
- ตรวจสอบ Storage bucket settings
- ตรวจสอบ RLS policies
- ตรวจสอบ file size และ type

#### 3. ไม่สามารถเข้าสู่ระบบได้
- ตรวจสอบ Supabase Auth settings
- ตรวจสอบ email/password
- ตรวจสอบ Access Code

### การ Debug
```bash
# เปิด debug mode
DEBUG=* npm run dev

# ดู logs
npm run dev 2>&1 | tee logs.txt
```

### การแก้ไขปัญหา SQL
```sql
-- หากเกิดข้อผิดพลาด "trigger already exists"
-- รันไฟล์ fix-trigger-error.sql ใน Supabase SQL Editor

-- ตรวจสอบ triggers ที่มีอยู่
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- ตรวจสอบ policies ที่มีอยู่
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📞 การสนับสนุน

### การรายงานปัญหา
1. สร้าง issue ใน GitHub repository
2. อธิบายปัญหาอย่างละเอียด
3. แนบ screenshots หรือ error logs

### การขอฟีเจอร์
1. สร้าง feature request ใน GitHub
2. อธิบายฟีเจอร์ที่ต้องการ
3. ให้ตัวอย่างการใช้งาน

## 📝 การอัปเดต

### การอัปเดต Dependencies
```bash
# ตรวจสอบ dependencies ที่อัปเดตได้
npm outdated

# อัปเดต dependencies
npm update

# อัปเดต dependencies หลัก
npm install package@latest
```

### การอัปเดต Database Schema
1. แก้ไขไฟล์ `database-setup.sql`
2. รัน migration script
3. ทดสอบการทำงาน

---

**หมายเหตุ**: คู่มือนี้อาจมีการอัปเดตตามการพัฒนาของโปรเจ็ค 