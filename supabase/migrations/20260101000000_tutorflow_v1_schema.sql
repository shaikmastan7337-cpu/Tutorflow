-- TUTORFLOW DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Production-Ready Migration for PostgreSQL / Supabase

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  profile_image_url TEXT,
  bio TEXT,
  city TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#4f46e5',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  date_of_birth DATE,
  grade TEXT,
  school TEXT,
  subjects TEXT[] DEFAULT '{}',
  profile_image_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CLASSES TABLE (with break support)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  break_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  break_duration_minutes INTEGER DEFAULT 0,
  break_start_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. AVAILABILITY BLOCKS (Tutor Recurring / One-time Breaks)
CREATE TABLE IF NOT EXISTS public.availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'break' CHECK (type IN ('break', 'unavailable', 'holiday', 'lunch')),
  title TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  recurrence_rule TEXT, -- e.g., 'mon,tue,wed,thu,fri' or 'daily'
  specific_date DATE,   -- NULL for recurring, non-null for one-time
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. FEES TABLE
CREATE TABLE IF NOT EXISTS public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_method TEXT CHECK (payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partially_paid')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'reviewed', 'late')),
  score NUMERIC(5, 2),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'class' CHECK (type IN ('class', 'fee', 'assignment', 'custom')),
  title TEXT NOT NULL,
  message TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. AI GENERATIONS TABLE (usage tracking & history)
CREATE TABLE IF NOT EXISTS public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'lesson_plan', 'assignment', 'student_summary', 'fee_reminder')),
  prompt TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'yearly')),
  provider TEXT DEFAULT 'razorpay',
  provider_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete')),
  current_period_start TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_students_tutor_id ON public.students(tutor_id);
CREATE INDEX IF NOT EXISTS idx_classes_tutor_id ON public.classes(tutor_id);
CREATE INDEX IF NOT EXISTS idx_classes_start_time ON public.classes(start_time);
CREATE INDEX IF NOT EXISTS idx_attendance_tutor_id ON public.attendance(tutor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_fees_tutor_id ON public.fees(tutor_id);
CREATE INDEX IF NOT EXISTS idx_fees_due_date ON public.fees(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_tutor_id ON public.assignments(tutor_id);
CREATE INDEX IF NOT EXISTS idx_notes_tutor_id ON public.notes(tutor_id);
CREATE INDEX IF NOT EXISTS idx_availability_tutor_id ON public.availability_blocks(tutor_id);

-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ROW LEVEL SECURITY POLICIES: PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ROW LEVEL SECURITY POLICIES: TUTOR OWNED TABLES
-- Macro: tutor_id must equal auth.uid()

-- Subjects
CREATE POLICY "Tutor manage subjects" ON public.subjects
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Students
CREATE POLICY "Tutor manage students" ON public.students
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Classes
CREATE POLICY "Tutor manage classes" ON public.classes
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Availability Blocks
CREATE POLICY "Tutor manage availability" ON public.availability_blocks
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Attendance
CREATE POLICY "Tutor manage attendance" ON public.attendance
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Fees
CREATE POLICY "Tutor manage fees" ON public.fees
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Assignments
CREATE POLICY "Tutor manage assignments" ON public.assignments
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Notes
CREATE POLICY "Tutor manage notes" ON public.notes
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Reminders
CREATE POLICY "Tutor manage reminders" ON public.reminders
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- AI Generations
CREATE POLICY "Tutor manage ai_generations" ON public.ai_generations
  FOR ALL USING (auth.uid() = tutor_id) WITH CHECK (auth.uid() = tutor_id);

-- Subscriptions
CREATE POLICY "Tutor view subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = tutor_id);

-- AUTH HOOK TRIGGER: Auto-create profile & default free subscription on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.subscriptions (tutor_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
