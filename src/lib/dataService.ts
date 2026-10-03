import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Student,
  ClassSession,
  AttendanceRecord,
  FeeRecord,
  Assignment,
  AvailabilityBlock,
  Note,
} from '../types/database';

export const dataService = {
  // --- STUDENTS ---
  async getStudents(tutorId: string): Promise<Student[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('tutor_id', tutorId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Student[]) || [];
    }
    const key = `tutorflow_students_${tutorId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  async addStudent(tutorId: string, studentData: Omit<Student, 'id' | 'tutor_id' | 'created_at' | 'updated_at'>): Promise<Student> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('students')
        .insert({
          tutor_id: tutorId,
          ...studentData,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Student;
    }
    const key = `tutorflow_students_${tutorId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newStudent: Student = {
      id: 'std_' + Math.random().toString(36).substring(2, 9),
      tutor_id: tutorId,
      ...studentData,
      created_at: now,
      updated_at: now,
    };
    list.unshift(newStudent);
    localStorage.setItem(key, JSON.stringify(list));
    return newStudent;
  },

  // --- CLASSES ---
  async getClasses(tutorId: string): Promise<ClassSession[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('classes')
        .select('*, student:students(*), subject:subjects(*)')
        .eq('tutor_id', tutorId)
        .order('start_time', { ascending: true });
      if (error) throw error;
      return (data as ClassSession[]) || [];
    }
    const key = `tutorflow_classes_${tutorId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  async addClass(tutorId: string, classData: Omit<ClassSession, 'id' | 'tutor_id' | 'created_at'>): Promise<ClassSession> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          tutor_id: tutorId,
          ...classData,
          created_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data as ClassSession;
    }
    const key = `tutorflow_classes_${tutorId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newClass: ClassSession = {
      id: 'cls_' + Math.random().toString(36).substring(2, 9),
      tutor_id: tutorId,
      ...classData,
      created_at: now,
    };
    list.push(newClass);
    localStorage.setItem(key, JSON.stringify(list));
    return newClass;
  },

  // --- ATTENDANCE ---
  async getAttendance(tutorId: string, date?: string): Promise<AttendanceRecord[]> {
    if (isSupabaseConfigured) {
      let query = supabase.from('attendance').select('*, student:students(*)').eq('tutor_id', tutorId);
      if (date) query = query.eq('date', date);
      const { data, error } = await query;
      if (error) throw error;
      return (data as AttendanceRecord[]) || [];
    }
    const key = `tutorflow_attendance_${tutorId}`;
    const list: AttendanceRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (date) {
      return list.filter((a) => a.date === date);
    }
    return list;
  },

  async markAttendance(tutorId: string, record: Omit<AttendanceRecord, 'id' | 'tutor_id' | 'created_at'>): Promise<AttendanceRecord> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('attendance')
        .upsert({
          tutor_id: tutorId,
          ...record,
          created_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data as AttendanceRecord;
    }
    const key = `tutorflow_attendance_${tutorId}`;
    const list: AttendanceRecord[] = JSON.parse(localStorage.getItem(key) || '[]');
    const existingIndex = list.findIndex(
      (a) => a.student_id === record.student_id && a.date === record.date
    );
    const newRecord: AttendanceRecord = {
      id: existingIndex >= 0 ? list[existingIndex].id : 'att_' + Math.random().toString(36).substring(2, 9),
      tutor_id: tutorId,
      ...record,
      created_at: now,
    };
    if (existingIndex >= 0) {
      list[existingIndex] = newRecord;
    } else {
      list.push(newRecord);
    }
    localStorage.setItem(key, JSON.stringify(list));
    return newRecord;
  },

  // --- FEES ---
  async getFees(tutorId: string): Promise<FeeRecord[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('fees')
        .select('*, student:students(*)')
        .eq('tutor_id', tutorId)
        .order('due_date', { ascending: false });
      if (error) throw error;
      return (data as FeeRecord[]) || [];
    }
    const key = `tutorflow_fees_${tutorId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  async addFee(tutorId: string, feeData: Omit<FeeRecord, 'id' | 'tutor_id' | 'created_at' | 'updated_at'>): Promise<FeeRecord> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('fees')
        .insert({
          tutor_id: tutorId,
          ...feeData,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data as FeeRecord;
    }
    const key = `tutorflow_fees_${tutorId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newFee: FeeRecord = {
      id: 'fee_' + Math.random().toString(36).substring(2, 9),
      tutor_id: tutorId,
      ...feeData,
      created_at: now,
      updated_at: now,
    };
    list.unshift(newFee);
    localStorage.setItem(key, JSON.stringify(list));
    return newFee;
  },

  // --- AVAILABILITY BLOCKS (Breaks) ---
  async getAvailabilityBlocks(tutorId: string): Promise<AvailabilityBlock[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('availability_blocks')
        .select('*')
        .eq('tutor_id', tutorId);
      if (error) throw error;
      return (data as AvailabilityBlock[]) || [];
    }
    const key = `tutorflow_availability_${tutorId}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  },

  async addAvailabilityBlock(
    tutorId: string,
    block: Omit<AvailabilityBlock, 'id' | 'tutor_id' | 'created_at'>
  ): Promise<AvailabilityBlock> {
    const now = new Date().toISOString();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('availability_blocks')
        .insert({
          tutor_id: tutorId,
          ...block,
          created_at: now,
        })
        .select()
        .single();
      if (error) throw error;
      return data as AvailabilityBlock;
    }
    const key = `tutorflow_availability_${tutorId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newBlock: AvailabilityBlock = {
      id: 'blk_' + Math.random().toString(36).substring(2, 9),
      tutor_id: tutorId,
      ...block,
      created_at: now,
    };
    list.push(newBlock);
    localStorage.setItem(key, JSON.stringify(list));
    return newBlock;
  },

  // --- SEED SAMPLE DATA FOR INITIAL TESTING IF EMPTY ---
  async seedDemoDataIfEmpty(tutorId: string): Promise<void> {
    const studentsKey = `tutorflow_students_${tutorId}`;
    const existing = localStorage.getItem(studentsKey);
    if (!existing || JSON.parse(existing).length === 0) {
      const demoStudents: Student[] = [
        {
          id: 'std_1',
          tutor_id: tutorId,
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+91 98765 43210',
          parent_name: 'Rajesh Sharma',
          parent_phone: '+91 98765 43211',
          grade: 'Grade 10',
          school: 'St. Xavier High School',
          subjects: ['Mathematics', 'Physics'],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'std_2',
          tutor_id: tutorId,
          full_name: 'Ananya Verma',
          email: 'ananya.v@example.com',
          phone: '+91 98111 22334',
          parent_name: 'Sunita Verma',
          parent_phone: '+91 98111 22335',
          grade: 'Grade 12',
          school: 'Delhi Public School',
          subjects: ['Chemistry', 'Biology'],
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(studentsKey, JSON.stringify(demoStudents));

      // Classes
      const classesKey = `tutorflow_classes_${tutorId}`;
      const today = new Date().toISOString().split('T')[0];
      const demoClasses: ClassSession[] = [
        {
          id: 'cls_1',
          tutor_id: tutorId,
          student_id: 'std_1',
          title: 'Class 10 Calculus & Trigonometry',
          start_time: `${today}T16:00:00`,
          end_time: `${today}T17:15:00`,
          location: 'Home Tuition / In-Person',
          status: 'scheduled',
          break_enabled: true,
          break_duration_minutes: 10,
          created_at: new Date().toISOString(),
        },
        {
          id: 'cls_2',
          tutor_id: tutorId,
          student_id: 'std_2',
          title: 'Class 12 Organic Chemistry Mechanisms',
          start_time: `${today}T17:30:00`,
          end_time: `${today}T18:45:00`,
          meeting_link: 'https://meet.google.com/xyz-demo',
          location: 'Online (Google Meet)',
          status: 'scheduled',
          break_enabled: true,
          break_duration_minutes: 15,
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(classesKey, JSON.stringify(demoClasses));

      // Fees
      const feesKey = `tutorflow_fees_${tutorId}`;
      const demoFees: FeeRecord[] = [
        {
          id: 'fee_1',
          tutor_id: tutorId,
          student_id: 'std_1',
          amount: 2500,
          due_date: `${today}`,
          status: 'pending',
          notes: 'Monthly tuition fee for Math & Physics',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'fee_2',
          tutor_id: tutorId,
          student_id: 'std_2',
          amount: 3000,
          due_date: '2026-10-10',
          status: 'paid',
          paid_date: `${today}`,
          payment_method: 'upi',
          notes: 'October tuition fee',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(feesKey, JSON.stringify(demoFees));

      // Availability / Breaks
      const availKey = `tutorflow_availability_${tutorId}`;
      const demoBreaks: AvailabilityBlock[] = [
        {
          id: 'blk_1',
          tutor_id: tutorId,
          type: 'lunch',
          title: 'Lunch & Rest Period',
          start_time: '13:00',
          end_time: '14:00',
          recurrence_rule: 'mon,tue,wed,thu,fri',
          created_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(availKey, JSON.stringify(demoBreaks));
    }
  },
};
