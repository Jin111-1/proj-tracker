# 🔄 การเปลี่ยนแปลงฐานข้อมูล - Interior Tracker

## 📋 สรุปการเปลี่ยนแปลง

SQL script ได้รับการปรับปรุงให้ตรงกับโครงสร้างฐานข้อมูลที่มีอยู่แล้ว โดยมีการเปลี่ยนแปลงหลักดังนี้:

## 🗄️ การเปลี่ยนแปลงชื่อตาราง

### ตารางเดิม → ตารางใหม่
- `project_images` → `photos`
- `project_documents` → `documents`
- `project_messages` → `messages`
- `project_appointments` → `appointments`
- `project_expenses` → `expenses`
- `project_revenues` → `revenues` (ใหม่)

## 📊 โครงสร้างตารางที่ปรับปรุง

### 1. **ตาราง users**
```sql
-- เพิ่มฟิลด์ใหม่
full_name VARCHAR,
phone VARCHAR,
-- เปลี่ยน role จาก 'user' เป็น 'customer'
role VARCHAR DEFAULT 'customer' CHECK (role IN ('admin', 'customer'))
```

### 2. **ตาราง projects**
```sql
-- เปลี่ยน status options
status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
-- เปลี่ยน budget type
budget NUMERIC
```

### 3. **ตาราง photos** (เดิม project_images)
```sql
-- เพิ่มฟิลด์ใหม่
description TEXT,
-- เปลี่ยนชื่อฟิลด์
uploaded_at → created_at
```

### 4. **ตาราง documents** (เดิม project_documents)
```sql
-- เพิ่มฟิลด์ใหม่
description TEXT,
document_type VARCHAR,
-- เปลี่ยนชื่อฟิลด์
uploaded_at → created_at
```

### 5. **ตาราง messages** (เดิม project_messages)
```sql
-- เปลี่ยนโครงสร้าง
sender_id UUID → sender_type VARCHAR CHECK (sender_type IN ('customer', 'admin'))
-- ลบ foreign key constraint
```

### 6. **ตาราง appointments** (เดิม project_appointments)
```sql
-- เปลี่ยนโครงสร้าง
appointment_date TIMESTAMP → start_time TIMESTAMP, end_time TIMESTAMP
-- เพิ่มฟิลด์ใหม่
location VARCHAR,
status VARCHAR DEFAULT 'scheduled'
-- เพิ่มฟิลด์
updated_at TIMESTAMP
```

### 7. **ตาราง expenses** (เดิม project_expenses)
```sql
-- เปลี่ยนโครงสร้าง
title VARCHAR → description VARCHAR
type VARCHAR → แยกเป็นตาราง revenues แยกต่างหาก
-- เพิ่มฟิลด์ใหม่
vendor VARCHAR,
receipt_path VARCHAR
```

### 8. **ตาราง revenues** (ใหม่)
```sql
-- แยกจาก expenses สำหรับรายรับ
amount NUMERIC,
description VARCHAR,
revenue_date DATE,
payment_method VARCHAR,
reference_number VARCHAR
```

## 🔧 การเปลี่ยนแปลงในโค้ด

### 1. **API Endpoints**
- `src/app/api/project/[id]/upload-images/route.ts`
  - เปลี่ยนจาก `project_images` → `photos`
- `src/app/api/project/[id]/images/route.ts`
  - เปลี่ยนจาก `project_images` → `photos`
  - ปรับ query fields

### 2. **Frontend Components**
- `src/app/pages/project/[id]/page.tsx`
  - อัปเดต interface `ProjectImage`
  - เพิ่มการแสดงข้อมูลผู้อัปโหลด

## 🚀 วิธีใช้งาน

### 1. **รัน SQL Script ใหม่**
```sql
-- ไปที่ Supabase SQL Editor
-- รันไฟล์ database-setup.sql ที่อัปเดตแล้ว
```

### 2. **ตรวจสอบการเปลี่ยนแปลง**
```sql
-- ตรวจสอบว่าตารางถูกสร้างแล้ว
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('photos', 'documents', 'messages', 'appointments', 'expenses', 'revenues');
```

### 3. **ทดสอบระบบ**
- ทดสอบการอัปโหลดรูปภาพ
- ตรวจสอบการแสดงผลในหน้า project detail
- ทดสอบ API endpoints

## ⚠️ หมายเหตุสำคัญ

### **การ Migration ข้อมูล**
หากมีข้อมูลเดิมอยู่แล้ว ต้องทำการ migration:

```sql
-- ตัวอย่าง: ย้ายข้อมูลจาก project_images ไป photos
INSERT INTO photos (id, project_id, file_name, file_path, file_size, created_at, uploaded_by)
SELECT id, project_id, file_name, file_path, file_size, uploaded_at, uploaded_by
FROM project_images;

-- ลบตารางเก่า (หลังจากย้ายข้อมูลแล้ว)
DROP TABLE project_images;
```

### **การอัปเดต RLS Policies**
RLS policies ใหม่จะถูกสร้างอัตโนมัติจาก SQL script

### **การทดสอบ**
- ทดสอบการเข้าสู่ระบบ
- ทดสอบการสร้างโปรเจ็ค
- ทดสอบการอัปโหลดรูปภาพ
- ทดสอบการแสดงผล

## 📝 สถานะการพัฒนา

### ✅ เสร็จแล้ว
- [x] อัปเดต SQL script
- [x] แก้ไข API endpoints
- [x] อัปเดต frontend components
- [x] สร้างเอกสาร migration

### 🔄 กำลังพัฒนา
- [ ] ทดสอบระบบหลัง migration
- [ ] เพิ่มฟีเจอร์ใหม่ตามโครงสร้างฐานข้อมูล

### 📋 ต้องทำ
- [ ] สร้าง API endpoints สำหรับ documents, messages, appointments
- [ ] พัฒนา UI สำหรับฟีเจอร์ใหม่
- [ ] ทดสอบความปลอดภัย

---

**หมายเหตุ**: การเปลี่ยนแปลงนี้ทำให้ระบบมีความยืดหยุ่นและรองรับฟีเจอร์ในอนาคตได้ดีขึ้น 