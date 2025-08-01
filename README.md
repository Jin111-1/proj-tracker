#  Interior Tracker

An easy-to-use and efficient interior design project management system. Track progress, manage budgets, and control work quality comprehensively.

## 📌 Project Description

Interior Tracker is an interior design project management platform that helps users:

- Create and manage interior design projects systematically
- Track project progress in real-time
- Manage budgets and expenses accurately
- Upload and manage project images systematically
- View reports and statistics in various chart formats
- Secure authentication system for Admin and Guest Users

## 🧰 Technologies Used

### Frontend:
- ⚛️ **Next.js 15.3.4** - React Framework
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 📊 **Chart.js & React-Chartjs-2** - For displaying charts and statistics
- 🖼️ **React-Dropzone** - For file uploads
- ✂️ **React-Image-Crop** - For image cropping

### Backend:
- 🛠️ **Supabase** - PostgreSQL Database & Backend as a Service
- 🔐 **Supabase Auth** - Authentication system
- 📁 **Supabase Storage** - File and image storage

### Development Tools:
- 🔧 **TypeScript** - Type safety
- 🚀 **ESLint** - Code linting
- 📦 **Axios** - HTTP client

## 🌟 Key Features

### 🔐 User Management
- **Authentication System**: Register, login, profile management
- **Role-based Access**: Admin and Guest User
- **Access Code System**: For clients to access projects

### 📊 Project Management
- **Create Projects**: Define name, description, budget, dates
- **Track Progress**: Display real-time progress percentage
- **Project Status**: In Progress, Completed, Cancelled
- **Image Management**: Upload, view, manage project images

### 💰 Expense Management
- **Record Expenses**: Add, edit, delete expenses
- **Expense Categories**: Group expenses by type
- **Charts and Statistics**: Display data in bar, line, and pie charts
- **Summary Reports**: Total statistics, trends, comparisons

### 📈 Analytics & Reporting
- **Dashboard**: Display overview of all projects
- **Progress Charts**: Track progress over time
- **Expense Statistics**: Analyze expenses by category and time
- **Summary Reports**: Export data for analysis

## 💡 Why These Technologies?

- **Next.js & React**: For fast, SEO-friendly, and efficient web application development
- **Supabase**: Provides comprehensive, secure, and easy-to-use backend services
- **Tailwind CSS**: Helps create beautiful and responsive UI designs quickly
- **Chart.js**: Displays statistics and charts beautifully and understandably

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
Create a `.env.local` file in the main folder and fill in the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the development server
```bash
npm run dev
```

Open your browser at: http://localhost:3000

## 🎯 Usage Guide

### For Admin
- **Manage Projects**: Create, edit, delete projects
- **View Statistics**: View overview of all projects and expenses
- **Manage Users**: Control system access

### For Guest User (Clients)
- **Access Projects**: Use Access Code to access projects
- **View Progress**: Track work progress
- **View Images**: View uploaded project images

### Main Usage
1. **Create Project**: Admin creates new project with Access Code
2. **Share Access Code**: Send Access Code to clients
3. **Track Work**: Upload images and record progress
4. **Manage Expenses**: Record expenses and view statistics
5. **View Reports**: Analyze data through charts and statistics

## 📂 Project Architecture

```
interior-tracker/
├── 📦 inte-track/                    # Main project
│   ├── 🌐 public/                    # Static files
│   │   └── 🖼️ *.svg                 # Icons and images
│   │
│   ├── 💻 src/                       # Main code
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
│   │   │   │   ├── 🏠 home-landing/  # Home page
│   │   │   │   ├── 👤 userDashboard/ # User dashboard
│   │   │   │   ├── 👨‍💼 adminDashboard/ # Admin dashboard
│   │   │   │   ├── 🏗️ project/       # Project page
│   │   │   │   └── 💰 expensesSection/ # Expense management page
│   │   │   │
│   │   │   ├── 📄 layout.tsx         # Main layout
│   │   │   ├── 📄 page.tsx           # Home page
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

- **Supabase** - For comprehensive backend services
- **Next.js Team** - For the excellent React framework
- **Tailwind CSS** - For the easy-to-use CSS framework
- **Chart.js** - For the beautiful chart display library

---
