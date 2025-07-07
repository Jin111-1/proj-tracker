# 🔧 รายละเอียดทางเทคนิค - Interior Tracker

## 🏗️ สถาปัตยกรรมระบบ

### Frontend Architecture
```
Next.js App Router
├── Layout (Root)
├── Pages
│   ├── Landing (Login)
│   ├── Admin Dashboard
│   ├── User Dashboard
│   └── Project Detail
├── API Routes
│   ├── Authentication
│   ├── Project Management
│   └── File Upload
└── Components & Hooks
```

### Backend Architecture
```
Supabase
├── Authentication
│   ├── Email/Password (Admin)
│   └── Access Code (Customer)
├── Database (PostgreSQL)
│   ├── users
│   ├── projects
│   └── project_relations
└── Storage
    ├── project_images
    └── project_documents
```

## 🔐 ระบบ Authentication

### Access Code System
```typescript
// การสร้าง Access Code
function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

### Guest User Creation
- สร้างอัตโนมัติเมื่อ login ด้วย access code
- Email format: `{access_code}@example.com`
- Password: ใช้ access code เป็น password
- Role: ไม่มี role พิเศษ (guest)

### Admin User
- ลงทะเบียนด้วย email/password
- Role: 'admin'
- สามารถสร้างและจัดการโปรเจ็คได้

## 📊 โครงสร้างฐานข้อมูล

### ตาราง users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ตาราง projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  access_code TEXT UNIQUE NOT NULL,
  bucket_name TEXT,
  status TEXT,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  budget DECIMAL(10,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### ตารางที่ต้องสร้างเพิ่ม
```sql
-- รูปภาพในโปรเจ็ค
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- เอกสารแนบ
CREATE TABLE project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ข้อความ
CREATE TABLE project_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- นัดหมาย
CREATE TABLE project_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  google_calendar_event_id TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- รายรับรายจ่าย
CREATE TABLE project_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT,
  date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI/UX Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3b82f6;
--primary-green: #10b981;
--primary-red: #ef4444;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-800: #1f2937;
--gray-900: #111827;

/* Status Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

### Component Library
- **Buttons**: Primary, Secondary, Danger
- **Cards**: Project Card, Image Card, Document Card
- **Forms**: Input, Textarea, Select, File Upload
- **Navigation**: Sidebar, Breadcrumb, Pagination
- **Feedback**: Loading, Success, Error, Empty State

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Layout Patterns
- **Mobile**: Single column, stacked elements
- **Tablet**: Two columns, sidebar navigation
- **Desktop**: Multi-column, dashboard layout

## 🔄 State Management

### Client State
```typescript
// React Hooks
const [projects, setProjects] = useState<Project[]>([]);
const [currentProject, setCurrentProject] = useState<Project | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Server State
- ใช้ Supabase Realtime สำหรับ live updates
- Optimistic updates สำหรับ UX ที่ดี
- Error boundaries สำหรับ error handling

## 📁 File Upload System

### Image Upload
```typescript
// Client-side compression
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### Storage Structure
```
supabase-storage/
├── project-images/
│   └── {project_id}/
│       ├── original/
│       └── compressed/
├── project-documents/
│   └── {project_id}/
└── temp/
```

## 🔒 Security Measures

### Authentication Security
- JWT tokens with short expiry
- Refresh token rotation
- CSRF protection
- Rate limiting

### Data Security
- Row Level Security (RLS) ใน Supabase
- Input validation และ sanitization
- File type validation
- File size limits

### API Security
```typescript
// Middleware สำหรับตรวจสอบ authentication
export async function authMiddleware(req: NextRequest) {
  const supabase = createSupabaseServerClient(req);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.next();
}
```

## 🚀 Performance Optimization

### Frontend
- **Code Splitting**: Dynamic imports
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Intersection Observer
- **Caching**: React Query, SWR

### Backend
- **Database Indexing**: สำหรับ queries ที่ใช้บ่อย
- **Connection Pooling**: Supabase handles
- **CDN**: สำหรับ static assets

## 📊 Analytics & Monitoring

### User Analytics
- Page views และ user flow
- Feature usage tracking
- Error tracking และ reporting

### Performance Monitoring
- Core Web Vitals
- API response times
- Database query performance

## 🔧 Development Tools

### Code Quality
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks

### Testing
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing

### Deployment
- **Vercel**: Frontend deployment
- **Supabase**: Backend hosting
- **GitHub Actions**: CI/CD pipeline

---

**หมายเหตุ**: เอกสารนี้จะอัปเดตตามการพัฒนาของโปรเจ็ค 