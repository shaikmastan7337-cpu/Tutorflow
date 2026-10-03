import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, ClassSession, AttendanceRecord, AttendanceStatus } from '../types/database';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Users,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [records, setRecords] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAttendanceData();
    }
  }, [user, selectedDate]);

  const loadAttendanceData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [stdList, clsList, attList] = await Promise.all([
        dataService.getStudents(user.id),
        dataService.getClasses(user.id),
        dataService.getAttendance(user.id, selectedDate),
      ]);

      setStudents(stdList);
      setClasses(clsList.filter((c) => c.start_time?.startsWith(selectedDate)));

      // Map existing records
      const recordMap: Record<string, { status: AttendanceStatus; notes: string }> = {};
      attList.forEach((att) => {
        recordMap[att.student_id] = {
          status: att.status,
          notes: att.notes || '',
        };
      });
      setRecords(recordMap);
    } catch (err) {
      console.error('Error loading attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (studentId: string, status: AttendanceStatus, notes = '') => {
    if (!user) return;
    setSavingId(studentId);

    // Optimistic update
    setRecords((prev) => ({
      ...prev,
      [studentId]: { status, notes },
    }));

    try {
      await dataService.markAttendance(user.id, {
        student_id: studentId,
        date: selectedDate,
        status,
        notes: notes || null,
      });
    } catch (err) {
      console.error('Failed to save attendance:', err);
    } finally {
      setSavingId(null);
    }
  };

  const handleMarkAllPresent = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const promises = students.map((std) =>
        dataService.markAttendance(user.id, {
          student_id: std.id,
          date: selectedDate,
          status: 'present',
          notes: null,
        })
      );
      await Promise.all(promises);

      const updated: Record<string, { status: AttendanceStatus; notes: string }> = {};
      students.forEach((s) => {
        updated[s.id] = { status: 'present', notes: '' };
      });
      setRecords(updated);
    } catch (err) {
      console.error('Error marking all present:', err);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const total = students.length;
  const presentCount = Object.values(records).filter((r) => r.status === 'present').length;
  const absentCount = Object.values(records).filter((r) => r.status === 'absent').length;
  const lateCount = Object.values(records).filter((r) => r.status === 'late').length;
  const markedTotal = presentCount + absentCount + lateCount;
  const percentage = markedTotal > 0 ? Math.round((presentCount / markedTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log student attendance for lessons and calculate verified completion percentages
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleMarkAllPresent}
            disabled={students.length === 0 || loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-xl bg-white"
          />

          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-1"
          >
            Today
          </button>
        </div>

        <div className="text-xs font-semibold text-slate-600 hidden sm:block">
          {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Present</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{presentCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Students attended</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Absent</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{absentCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Missed class</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Late</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lateCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Delayed entry</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500">Attendance Rate</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{percentage}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{markedTotal} of {total} logged</p>
        </div>
      </div>

      {/* Student Roster Attendance Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Student Roll Call</h2>
            <p className="text-xs text-slate-500">Tap status to mark attendance instantly</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {students.length} Students Active
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-14">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No students enrolled yet</p>
            <p className="text-[11px] text-slate-400">Add students in the Students tab first</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {students.map((std) => {
              const currentStatus = records[std.id]?.status;

              return (
                <div
                  key={std.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {std.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{std.full_name}</h3>
                      <p className="text-[11px] text-slate-500">
                        {std.grade || 'Student'} • {std.subjects?.join(', ') || 'General'}
                      </p>
                    </div>
                  </div>

                  {/* 3 Status Buttons: Present, Late, Absent */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleMark(std.id, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      onClick={() => handleMark(std.id, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        currentStatus === 'late'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>

                    <button
                      onClick={() => handleMark(std.id, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                        currentStatus === 'absent'
                          ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:bg-red-50/50'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
