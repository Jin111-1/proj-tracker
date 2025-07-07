-- Database Setup Script for Interior Tracker
-- Run this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR,
  phone VARCHAR,
  role VARCHAR DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table (if not exists)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  access_code VARCHAR NOT NULL UNIQUE,
  bucket_name VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  budget NUMERIC,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_size INTEGER,
  description TEXT,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  description TEXT,
  document_type VARCHAR,
  uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_type VARCHAR NOT NULL CHECK (sender_type IN ('customer', 'admin')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR,
  google_calendar_event_id VARCHAR,
  status VARCHAR DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  description VARCHAR NOT NULL,
  expense_date DATE NOT NULL,
  category VARCHAR,
  vendor VARCHAR,
  receipt_path VARCHAR,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create revenues table
CREATE TABLE IF NOT EXISTS public.revenues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  description VARCHAR NOT NULL,
  revenue_date DATE NOT NULL,
  payment_method VARCHAR,
  reference_number VARCHAR,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_access_code ON public.projects(access_code);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_photos_project_id ON public.photos(project_id);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON public.photos(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON public.documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON public.documents(file_type);
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_sender_type ON public.messages(sender_type);
CREATE INDEX IF NOT EXISTS idx_appointments_project_id ON public.appointments(project_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON public.expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_revenues_project_id ON public.revenues(project_id);
CREATE INDEX IF NOT EXISTS idx_revenues_revenue_date ON public.revenues(revenue_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for projects table
CREATE POLICY "Users can view projects they created" ON public.projects
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update projects they created" ON public.projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update all projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for photos table
CREATE POLICY "Users can view photos of their projects" ON public.photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = photos.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project photos" ON public.photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can upload photos to their projects" ON public.photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = photos.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can upload photos to any project" ON public.photos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for documents table
CREATE POLICY "Users can view documents of their projects" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = documents.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can upload documents to their projects" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = documents.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can upload documents to any project" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for messages table
CREATE POLICY "Users can view messages of their projects" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = messages.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can send messages to their projects" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = messages.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can send messages to any project" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for appointments table
CREATE POLICY "Users can view appointments of their projects" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = appointments.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create appointments for their projects" ON public.appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = appointments.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can create appointments for any project" ON public.appointments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for expenses table
CREATE POLICY "Users can view expenses of their projects" ON public.expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = expenses.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project expenses" ON public.expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create expenses for their projects" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = expenses.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can create expenses for any project" ON public.expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create RLS policies for revenues table
CREATE POLICY "Users can view revenues of their projects" ON public.revenues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = revenues.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can view all project revenues" ON public.revenues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can create revenues for their projects" ON public.revenues
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects WHERE projects.id = revenues.project_id AND projects.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can create revenues for any project" ON public.revenues
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users WHERE users.id::text = auth.uid()::text AND users.role = 'admin'
    )
  );

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing policies if they exist (to avoid conflicts)
DO $$
BEGIN
    -- Drop policies for users table
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    
    -- Drop policies for projects table
    DROP POLICY IF EXISTS "Users can view projects they created" ON public.projects;
    DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
    DROP POLICY IF EXISTS "Users can update projects they created" ON public.projects;
    DROP POLICY IF EXISTS "Admins can update all projects" ON public.projects;
    
    -- Drop policies for photos table
    DROP POLICY IF EXISTS "Users can view photos of their projects" ON public.photos;
    DROP POLICY IF EXISTS "Admins can view all project photos" ON public.photos;
    DROP POLICY IF EXISTS "Users can upload photos to their projects" ON public.photos;
    DROP POLICY IF EXISTS "Admins can upload photos to any project" ON public.photos;
    
    -- Drop policies for documents table
    DROP POLICY IF EXISTS "Users can view documents of their projects" ON public.documents;
    DROP POLICY IF EXISTS "Admins can view all project documents" ON public.documents;
    DROP POLICY IF EXISTS "Users can upload documents to their projects" ON public.documents;
    DROP POLICY IF EXISTS "Admins can upload documents to any project" ON public.documents;
    
    -- Drop policies for messages table
    DROP POLICY IF EXISTS "Users can view messages of their projects" ON public.messages;
    DROP POLICY IF EXISTS "Admins can view all project messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can send messages to their projects" ON public.messages;
    DROP POLICY IF EXISTS "Admins can send messages to any project" ON public.messages;
    
    -- Drop policies for appointments table
    DROP POLICY IF EXISTS "Users can view appointments of their projects" ON public.appointments;
    DROP POLICY IF EXISTS "Admins can view all project appointments" ON public.appointments;
    DROP POLICY IF EXISTS "Users can create appointments for their projects" ON public.appointments;
    DROP POLICY IF EXISTS "Admins can create appointments for any project" ON public.appointments;
    
    -- Drop policies for expenses table
    DROP POLICY IF EXISTS "Users can view expenses of their projects" ON public.expenses;
    DROP POLICY IF EXISTS "Admins can view all project expenses" ON public.expenses;
    DROP POLICY IF EXISTS "Users can create expenses for their projects" ON public.expenses;
    DROP POLICY IF EXISTS "Admins can create expenses for any project" ON public.expenses;
    
    -- Drop policies for revenues table
    DROP POLICY IF EXISTS "Users can view revenues of their projects" ON public.revenues;
    DROP POLICY IF EXISTS "Admins can view all project revenues" ON public.revenues;
    DROP POLICY IF EXISTS "Users can create revenues for their projects" ON public.revenues;
    DROP POLICY IF EXISTS "Admins can create revenues for any project" ON public.revenues;
END $$;

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    -- Create trigger for users table
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_users_updated_at'
    ) THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Create trigger for projects table
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_projects_updated_at'
    ) THEN
        CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Create trigger for appointments table
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_appointments_updated_at'
    ) THEN
        CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample admin user (optional - remove in production)
-- INSERT INTO public.users (email, full_name, role) VALUES ('admin@example.com', 'Admin User', 'admin')
-- ON CONFLICT (email) DO NOTHING; 