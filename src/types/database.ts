export type UserStatus = 'active' | 'inactive' | 'archived';
export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type FeeStatus = 'pending' | 'paid' | 'overdue' | 'partially_paid';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card' | 'other';
export type AssignmentStatus = 'assigned' | 'submitted' | 'reviewed' | 'late';
export type AvailabilityType = 'break' | 'unavailable' | 'holiday' | 'lunch';
export type ReminderType = 'class' | 'fee' | 'assignment' | 'custom';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed';
export type SubscriptionPlan = 'free' | 'pro' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete';
export type AIToolType = 'message' | 'lesson_plan' | 'assignment' | 'student_summary' | 'fee_reminder';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_image_url?: string | null;
  bio?: string | null;
  city?: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  tutor_id: string;
  name: string;
  description?: string | null;
  color_code?: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  tutor_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  date_of_birth?: string | null;
  grade?: string | null;
  school?: string | null;
  subjects?: string[] | null;
  profile_image_url?: string | null;
  notes?: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface ClassSession {
  id: string;
  tutor_id: string;
  student_id?: string | null;
  subject_id?: string | null;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location?: string | null;
  meeting_link?: string | null;
  status: ClassStatus;
  break_enabled?: boolean;
  break_duration_minutes?: number;
  break_start_time?: string | null;
  created_at: string;
  // joined relations
  student?: Student;
  subject?: Subject;
}

export interface AvailabilityBlock {
  id: string;
  tutor_id: string;
  type: AvailabilityType;
  title: string;
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  recurrence_rule?: string | null; // e.g. 'mon,tue,wed,thu,fri'
  specific_date?: string | null;   // YYYY-MM-DD
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  tutor_id: string;
  student_id: string;
  class_id?: string | null;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string | null;
  created_at: string;
  student?: Student;
}

export interface FeeRecord {
  id: string;
  tutor_id: string;
  student_id: string;
  amount: number;
  due_date: string;
  paid_date?: string | null;
  payment_method?: PaymentMethod | null;
  status: FeeStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
}

export interface Assignment {
  id: string;
  tutor_id: string;
  student_id?: string | null;
  subject_id?: string | null;
  title: string;
  description?: string | null;
  due_date: string;
  status: AssignmentStatus;
  score?: number | null;
  feedback?: string | null;
  created_at: string;
  updated_at: string;
  student?: Student;
  subject?: Subject;
}

export interface Note {
  id: string;
  tutor_id: string;
  student_id?: string | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  student?: Student;
}

export interface Reminder {
  id: string;
  tutor_id: string;
  student_id?: string | null;
  type: ReminderType;
  title: string;
  message?: string | null;
  scheduled_for: string;
  status: ReminderStatus;
  created_at: string;
}

export interface AIGeneration {
  id: string;
  tutor_id: string;
  type: AIToolType;
  prompt: string;
  result: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  tutor_id: string;
  plan: SubscriptionPlan;
  provider: string;
  provider_subscription_id?: string | null;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end?: string | null;
  created_at: string;
  updated_at: string;
}
