import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, ClassSession, FeeRecord, AvailabilityBlock, AttendanceRecord } from '../types/database';
import {
  Calendar,
  Users,
  CheckCircle2,
  CreditCard,
  Plus,
  Coffee,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MapPin,
  Check,
  AlertTriangle,
  Loader2,
  Video,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [breaks, setBreaks] = useState<AvailabilityBlock[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Seed initial demo data if user is starting fresh
      await dataService.seedDemoDataIfEmpty(user.id);

      const [stdList, clsList, feeList, brkList, attList] = await Promise.all([
        dataService.getStudents(user.id),
        dataService.getClasses(user.id),
        dataService.getFees(user.id),
        dataService.getAvailabilityBlocks(user.id),
        dataService.getAttendance(user.id, todayStr),
      ]);

      setStudents(stdList);
      setClasses(clsList);
      setFees(feeList);
      setBreaks(brkList);
      setTodayAttendance(attList);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations from real data
  const todayClasses = classes.filter((c) => {
    if (!c.start_time) return false;
    return c.start_time.startsWith(todayStr);
  });

  const activeStudents = students.filter((s) => s.status === 'active');

  const pendingFeesTotal = fees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const overdueFeesCount = fees.filter((f) => f.status === 'overdue').length;

  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const attendanceRate = todayClasses.length > 0
    ? Math.round((presentCount / todayClasses.length) * 100)
    : 100;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
        <p className="text-xs text-slate-500 font-medium">Syncing dashboard statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-700/60 text-indigo-200 text-[11px] font-semibold mb-2">
            <span>Operational Day</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {profile?.full_name || 'Tutor'}
          </h1>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            You have {todayClasses.length} {todayClasses.length === 1 ? 'class' : 'classes'} scheduled today. Break protection is active for your calendar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigate('/schedule?action=new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Class</span>
          </button>
        </div>
      </div>

      {/* Real Statistics 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Classes Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Classes Today</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{todayClasses.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {todayClasses.length > 0 ? 'Upcoming lessons' : 'No lessons scheduled'}
          </p>
        </div>

        {/* Active Students */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Students</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeStudents.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Enrolled in curriculum
          </p>
        </div>

        {/* Attendance Today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Attendance Today</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {todayClasses.length > 0 ? `${presentCount}/${todayClasses.length}` : '—'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {todayClasses.length > 0 ? `${attendanceRate}% verified` : 'No sessions today'}
          </p>
        </div>

        {/* Pending / Overdue Fees */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Fees</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            ₹{pendingFeesTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {overdueFeesCount > 0 ? `${overdueFeesCount} overdue` : 'All on track'}
          </p>
        </div>
      </div>

      {/* Quick Actions Shortcuts Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Instant Operations
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/students?action=new')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-slate-700 hover:text-blue-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-blue-600 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Add Student</span>
          </button>

          <button
            onClick={() => navigate('/schedule?action=new')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-indigo-600 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Schedule Class</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Attendance</span>
          </button>

          <button
            onClick={() => navigate('/fees?action=new')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 text-slate-700 hover:text-amber-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-amber-600 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Add Fee</span>
          </button>

          <button
            onClick={() => navigate('/assignments?action=new')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 text-slate-700 hover:text-purple-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-purple-600 group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Assignment</span>
          </button>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 hover:bg-pink-50 border border-slate-100 hover:border-pink-200 text-slate-700 hover:text-pink-700 transition-all text-center group"
          >
            <div className="p-2 rounded-lg bg-white shadow-2xs mb-1.5 text-pink-600 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold">Ask AI</span>
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Today's Schedule & Breaks + Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Today's Classes & Break Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Today's Schedule & Breaks</h2>
                <p className="text-xs text-slate-500">Live order of lessons and protected windows</p>
              </div>
              <button
                onClick={() => navigate('/schedule')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Break Notification Banner */}
            {breaks.length > 0 && (
              <div className="mx-4 sm:mx-5 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-amber-900 font-medium">
                    Break Protected: <span className="font-bold">{breaks[0].title}</span> ({breaks[0].start_time} – {breaks[0].end_time})
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  Guarded
                </span>
              </div>
            )}

            <div className="p-4 sm:p-5">
              {todayClasses.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No classes scheduled for today</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Use the scheduler to add your lesson times</p>
                  <button
                    onClick={() => navigate('/schedule?action=new')}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule a Class</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayClasses.map((cls) => {
                    const student = students.find((s) => s.id === cls.student_id);
                    const startTime = cls.start_time ? new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    const endTime = cls.end_time ? new Date(cls.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                    return (
                      <div
                        key={cls.id}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-indigo-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{cls.title}</h4>
                              {cls.break_enabled && (
                                <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-100 text-amber-800 rounded-md">
                                  {cls.break_duration_minutes}m Break
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-indigo-600 font-medium mt-0.5">
                              {student?.full_name || 'Individual Student'}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                              <span>{startTime} – {endTime}</span>
                              {cls.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{cls.location}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {cls.meeting_link && (
                            <a
                              href={cls.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Join Video Link"
                            >
                              <Video className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => navigate('/attendance')}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Overdue / Pending Fees & AI Spotlight */}
        <div className="space-y-4">
          {/* Fee Management Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fee Invoices</h3>
                <p className="text-[11px] text-slate-500">Unsettled tuition payments</p>
              </div>
              <button
                onClick={() => navigate('/fees')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {fees.filter((f) => f.status !== 'paid').slice(0, 3).map((fee) => {
                const student = students.find((s) => s.id === fee.student_id);
                return (
                  <div
                    key={fee.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{student?.full_name || 'Student'}</p>
                      <p className="text-[10px] text-slate-400">Due: {fee.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-amber-600">₹{fee.amount}</p>
                      <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        {fee.status}
                      </span>
                    </div>
                  </div>
                );
              })}

              {fees.filter((f) => f.status !== 'paid').length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <span>All tuition fees are up to date!</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Spotlight Preview */}
          <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border border-purple-200/60 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                AI Teaching Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Generate custom homework questions, comprehensive lesson plans, or polite parent fee reminders in 1 click.
            </p>
            <button
              onClick={() => navigate('/ai-assistant')}
              className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore AI Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
