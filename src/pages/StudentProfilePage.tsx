import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, ClassSession, AttendanceRecord, FeeRecord } from '../types/database';
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'classes' | 'notes'>('overview');

  useEffect(() => {
    if (user && id) {
      loadProfileData();
    }
  }, [user, id]);

  const loadProfileData = async () => {
    if (!user || !id) return;
    setLoading(true);
    try {
      const [allStudents, allClasses, allAttendance, allFees] = await Promise.all([
        dataService.getStudents(user.id),
        dataService.getClasses(user.id),
        dataService.getAttendance(user.id),
        dataService.getFees(user.id),
      ]);

      const found = allStudents.find((s) => s.id === id);
      if (found) {
        setStudent(found);
      }
      setClasses(allClasses.filter((c) => c.student_id === id));
      setAttendance(allAttendance.filter((a) => a.student_id === id));
      setFees(allFees.filter((f) => f.student_id === id));
    } catch (err) {
      console.error('Error loading student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900">Student not found</h3>
        <p className="text-xs text-slate-500 mt-1">This student may have been deleted or archived.</p>
        <Link
          to="/students"
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>
      </div>
    );
  }

  // Attendance stats
  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 100;

  // Fee stats
  const totalFees = fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const paidFees = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const pendingFees = totalFees - paidFees;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all students</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">{student.full_name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.grade || 'Grade'} • {student.school || 'School'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                {student.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.phone}</span>
                  </div>
                )}
                {student.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.email}</span>
                  </div>
                )}
                {student.parent_phone && (
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="font-semibold text-slate-700">Guardian:</span> {student.parent_name} ({student.parent_phone})
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/schedule?studentId=${student.id}&action=new`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Class</span>
            </button>
            <button
              onClick={() => navigate(`/fees?studentId=${student.id}&action=new`)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Add Fee</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">{attendanceRate}%</p>
            <p className="text-[10px] text-slate-500">{presentCount} classes present</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Balance</p>
            <p className={`text-lg font-bold mt-0.5 ${pendingFees > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
              ₹{pendingFees}
            </p>
            <p className="text-[10px] text-slate-500">{pendingFees > 0 ? 'Unsettled' : 'Fully Cleared'}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Lessons</p>
            <p className="text-lg font-bold text-indigo-600 mt-0.5">{classes.length}</p>
            <p className="text-[10px] text-slate-500">Scheduled sessions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        {(['overview', 'attendance', 'fees', 'classes', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-colors relative ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Subjects & Curriculum</h3>
            <div className="flex flex-wrap gap-2">
              {student.subjects?.map((sub) => (
                <span key={sub} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                  {sub}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 mb-1">Academic Notes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {student.notes || 'No custom notes logged yet.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming Schedule</h3>
            {classes.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming classes scheduled.</p>
            ) : (
              <div className="space-y-2">
                {classes.slice(0, 3).map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{new Date(c.start_time).toLocaleString()}</p>
                    </div>
                    {c.break_enabled && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {c.break_duration_minutes}m break
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Attendance History</h3>
          {attendance.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No attendance recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {attendance.map((att) => (
                <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-medium">{att.date}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    att.status === 'present' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Fee Invoices & Receipts</h3>
          {fees.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No fee invoices recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <div key={fee.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">₹{fee.amount}</p>
                    <p className="text-[10px] text-slate-400">Due: {fee.due_date} {fee.notes ? `• ${fee.notes}` : ''}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    fee.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {fee.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">All Classes</h3>
          {classes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No classes created yet for this student.</p>
          ) : (
            <div className="space-y-2">
              {classes.map((cls) => (
                <div key={cls.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{cls.title}</p>
                    <p className="text-[11px] text-slate-500">{new Date(cls.start_time).toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{cls.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Tutor Observations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {student.notes || 'No special tutor observations logged yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
