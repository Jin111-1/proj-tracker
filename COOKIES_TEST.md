# 🍪 Cookies Testing Guide

## ✅ ตอบคำถาม: เมื่อ Login มีการแนบ Cookies กลับไปด้วยมั้ย?

**คำตอบ: ใช่ครับ!** เมื่อ login สำเร็จ จะมีการแนบ cookies กลับไปด้วย

## 🔍 Cookies ที่จะได้รับ

### 1. **Session Cookies** (เมื่อ login สำเร็จ)
```
sb-[project-ref]-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
sb-[project-ref]-auth-token.sig=...
```

### 2. **Cookie Properties**
- **HttpOnly:** ✅ (ป้องกัน XSS)
- **Secure:** ✅ (ใน production)
- **SameSite:** Lax
- **Path:** /
- **Max-Age:** 7 วัน (ถ้า remember=true) หรือ session cookie

## 🧪 วิธีการทดสอบ Cookies

### 1. ทดสอบใน Browser Developer Tools

#### ขั้นตอนที่ 1: Login
1. เปิด Browser Developer Tools (F12)
2. ไปที่ Tab "Application" หรือ "Storage"
3. เลือก "Cookies" → "http://localhost:3000"
4. ส่ง POST request ไปที่ `/api/auth/login`
5. ตรวจสอบ cookies ที่เพิ่มขึ้น

#### ขั้นตอนที่ 2: ตรวจสอบ Cookies
```javascript
// ใน Browser Console
document.cookie
// หรือ
console.log(document.cookie)
```

### 2. ทดสอบใน Postman

#### ขั้นตอนที่ 1: ส่ง Login Request
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

#### ขั้นตอนที่ 2: ตรวจสอบ Response Headers
ใน Postman Response จะเห็น:
```
Set-Cookie: sb-[project-ref]-auth-token=...; Path=/; HttpOnly; SameSite=Lax
Set-Cookie: sb-[project-ref]-auth-token.sig=...; Path=/; HttpOnly; SameSite=Lax
```

#### ขั้นตอนที่ 3: ทดสอบ Get User
```http
GET http://localhost:3000/api/auth/user
```
Postman จะส่ง cookies กลับไปอัตโนมัติ

### 3. ทดสอบใน cURL

#### ขั้นตอนที่ 1: Login และบันทึก Cookies
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

#### ขั้นตอนที่ 2: ใช้ Cookies ในการเรียก API อื่น
```bash
curl -X GET http://localhost:3000/api/auth/user \
  -b cookies.txt
```

## 📊 ตัวอย่าง Cookies ที่ได้รับ

### Login Success Response
```http
HTTP/1.1 200 OK
Set-Cookie: sb-abc123-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1NzI4MDAwLCJpYXQiOjE3MzU3MjQ0MDAsImlzcyI6Imh0dHBzOi8vYWJjMTIzLnN1cGFiYXNlLmNvIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJzdWIiOiJ1c2VyLXV1aWQifQ.signature; Path=/; HttpOnly; SameSite=Lax
Set-Cookie: sb-abc123-auth-token.sig=signature; Path=/; HttpOnly; SameSite=Lax
Content-Type: application/json

{
  "message": "Login สำเร็จ"
}
```

### Logout Response (ลบ Cookies)
```http
HTTP/1.1 200 OK
Set-Cookie: sb-abc123-auth-token=deleted; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Set-Cookie: sb-abc123-auth-token.sig=deleted; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT
Content-Type: application/json

{
  "message": "Logout สำเร็จ"
}
```

## 🔧 การแก้ไขปัญหา Cookies

### ปัญหา: Cookies ไม่ถูกส่งกลับ
- ตรวจสอบว่าใช้ response object เดียวกัน
- ตรวจสอบ Supabase SSR configuration

### ปัญหา: Cookies ไม่ถูกส่งไป API อื่น
- ตรวจสอบ domain และ path
- ตรวจสอบ SameSite policy

### ปัญหา: Session หมดอายุเร็ว
- ตรวจสอบ Max-Age setting
- ตรวจสอบ remember parameter

## 🎯 สรุป

✅ **Login:** สร้าง session cookies  
✅ **Register:** สร้าง session cookies (ถ้า auto-login)  
✅ **Logout:** ลบ session cookies  
✅ **Get User:** ใช้ session cookies เพื่อตรวจสอบ authentication  

Cookies จะถูกจัดการอัตโนมัติโดย Supabase SSR และ Next.js! 🎉 