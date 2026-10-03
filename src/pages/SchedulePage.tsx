import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, ClassSession, AvailabilityBlock } from '../types/database';
import {
  Calendar as CalendarIcon,
  Clock,
  Coffee,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Video,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [breaks, setBreaks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);

  // View mode
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  // New Class Form State
  const [title, setTitle] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:15');
  const [locationStr, setLocationStr] = useState('Home Tuition');
  const [meetingLink, setMeetingLink] = useState('');
  const [breakEnabled, setBreakEnabled] = useState(false);
  const [breakDuration, setBreakDuration] = useState(15);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [savingClass, setSavingClass] = useState(false);

  // New Break Form State
  const [breakTitle, setBreakTitle] = useState('Lunch & Rest Break');
  const [breakType, setBreakType] = useState<'lunch' | 'break' | 'unavailable' | 'holiday'>('lunch');
  const [breakStartTime, setBreakStartTime] = useState('13:00');
  const [breakEndTime, setBreakEndTime] = useState('14:00');
  const [breakRecurrence, setBreakRecurrence] = useState('mon,tue,wed,thu,fri');
  const [savingBreak, setSavingBreak] = useState(false);

  useEffect(() => {
    if (user) {
      loadSchedule();
    }
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setIsClassModalOpen(true);
      const preselectedStudent = params.get('studentId');
      if (preselectedStudent) {
        setStudentId(preselectedStudent);
      }
    }
  }, [user, location.search]);

  const loadSchedule = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [clsList, stdList, brkList] = await Promise.all([
        dataService.getClasses(user.id),
        dataService.getStudents(user.id),
        dataService.getAvailabilityBlocks(user.id),
      ]);
      setClasses(clsList);
      setStudents(stdList);
      setBreaks(brkList);
    } catch (err) {
      console.error('Error loading schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  // Conflict Detection Engine
  const checkForConflicts = (date: string, start: string, end: string): string | null => {
    const newStart = new Date(`${date}T${start}:00`).getTime();
    const newEnd = new Date(`${date}T${end}:00`).getTime();

    if (newEnd <= newStart) {
      return 'End time must be after start time.';
    }

    // 1. Check overlap with existing scheduled classes
    for (const cls of classes) {
      if (cls.status === 'cancelled') continue;
      if (!cls.start_time || !cls.end_time) continue;
      const existingStart = new Date(cls.start_time).getTime();
      const existingEnd = new Date(cls.end_time).getTime();

      // Overlap condition
      if (Math.max(newStart, existingStart) < Math.min(newEnd, existingEnd)) {
        return `Conflict Detected: Overlaps existing class "${cls.title}" (${new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(cls.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}).`;
      }
    }

    // 2. Check overlap with tutor availability blocks (breaks)
    for (const brk of breaks) {
      const brkStart = new Date(`${date}T${brk.start_time}:00`).getTime();
      const brkEnd = new Date(`${date}T${brk.end_time}:00`).getTime();

      if (Math.max(newStart, brkStart) < Math.min(newEnd, brkEnd)) {
        return `Tutor Break Conflict: This time overlaps your protected "${brk.title}" (${brk.start_time} - ${brk.end_time}). Please choose another slot or adjust your break.`;
      }
    }

    return null;
  };

  // Update conflict warning in real time as user changes time
  useEffect(() => {
    if (isClassModalOpen && classDate && startTime && endTime) {
      const conflict = checkForConflicts(classDate, startTime, endTime);
      setConflictWarning(conflict);
    }
  }, [classDate, startTime, endTime, classes, breaks, isClassModalOpen]);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    // Check conflict
    const conflict = checkForConflicts(classDate, startTime, endTime);
    if (conflict) {
      setConflictWarning(conflict);
      return;
    }

    setSavingClass(true);
    try {
      const newClass = await dataService.addClass(user.id, {
        student_id: studentId || null,
        title: title.trim(),
        start_time: `${classDate}T${startTime}:00`,
        end_time: `${classDate}T${endTime}:00`,
        location: locationStr.trim() || null,
        meeting_link: meetingLink.trim() || null,
        status: 'scheduled',
        break_enabled: breakEnabled,
        break_duration_minutes: breakEnabled ? breakDuration : 0,
      });

      setClasses([...classes, newClass]);
      setIsClassModalOpen(false);
      resetClassForm();
    } catch (err) {
      console.error('Error saving class:', err);
    } finally {
      setSavingClass(false);
    }
  };

  const handleCreateBreak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !breakTitle.trim()) return;

    setSavingBreak(true);
    try {
      const created = await dataService.addAvailabilityBlock(user.id, {
        type: breakType,
        title: breakTitle.trim(),
        start_time: breakStartTime,
        end_time: breakEndTime,
        recurrence_rule: breakRecurrence,
        specific_date: null,
      });

      setBreaks([...breaks, created]);
      setIsBreakModalOpen(false);
    } catch (err) {
      console.error('Error saving break:', err);
    } finally {
      setSavingBreak(false);
    }
  };

  const resetClassForm = () => {
    setTitle('');
    setStudentId('');
    setClassDate(new Date().toISOString().split('T')[0]);
    setStartTime('16:00');
    setEndTime('17:15');
    setLocationStr('Home Tuition');
    setMeetingLink('');
    setBreakEnabled(false);
    setConflictWarning(null);
  };

  // Filter classes for selected day
  const displayedClasses = classes.filter((c) => {
    if (!c.start_time) return false;
    return c.start_time.startsWith(selectedDate);
  });

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Class Scheduler & Breaks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule lessons, configure mid-session pauses, and protect your rest availability
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsBreakModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-semibold transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Break Window</span>
          </button>

          <button
            onClick={() => setIsClassModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Class</span>
          </button>
        </div>
      </div>

      {/* Date Navigation & View Mode Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                viewMode === mode
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Break Protection Notice */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <Coffee className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-amber-900">Protected Tutor Rest Hours: </span>
            <span className="text-amber-800">
              {breaks.length > 0
                ? breaks.map((b) => `${b.title} (${b.start_time} - ${b.end_time})`).join(', ')
                : 'No recurring breaks set. Set your lunch block to avoid scheduling fatigue.'}
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase tracking-wider self-start sm:self-auto">
          Conflict Guard Active
        </span>
      </div>

      {/* Timeline of the Selected Day */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Day Schedule Timeline • {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : displayedClasses.length === 0 ? (
          <div className="text-center py-14 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <CalendarIcon className="w-9 h-9 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">No classes scheduled on this date</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Click below to book a lesson slot</p>
            <button
              onClick={() => {
                setClassDate(selectedDate);
                setIsClassModalOpen(true);
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Class for this Day</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedClasses.map((cls) => {
              const student = students.find((s) => s.id === cls.student_id);
              const startTime = new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = new Date(cls.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={cls.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 bg-white hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 mb-0.5" />
                      <span className="text-[10px]">{startTime}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{cls.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                          {cls.status}
                        </span>
                        {cls.break_enabled && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            ☕ {cls.break_duration_minutes}m Mid-Class Break
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-indigo-600 font-semibold mt-1">
                        Student: {student?.full_name || 'Individual Class'}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                        <span>{startTime} – {endTime}</span>
                        {cls.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{cls.location}</span>
                          </span>
                        )}
                        {cls.meeting_link && (
                          <a
                            href={cls.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-indigo-600 hover:underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Meeting Link</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SCHEDULE CLASS MODAL (with Real-time Break Conflict Check & Mid-Break Setting) */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule a Class</h3>
                <p className="text-xs text-slate-500">Includes conflict detection & break support</p>
              </div>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Conflict Warning Box */}
              {conflictWarning && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Scheduling Warning:</span>
                    <p className="mt-0.5">{conflictWarning}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 10 Calculus - Session 4"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign Student
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select an enrolled student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.grade || 'Student'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={classDate}
                    onChange={(e) => setClassDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Mid-Class Break Setting */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800">Mid-Class Student Break</span>
                      <p className="text-[10px] text-slate-500">Insert a rest pause for long lessons</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={breakEnabled}
                    onChange={(e) => setBreakEnabled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {breakEnabled && (
                  <div className="pt-2 flex items-center gap-2">
                    <label className="text-xs text-slate-600 font-medium">Break Duration:</label>
                    <select
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes (Standard)</option>
                      <option value={20}>20 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Mode
                  </label>
                  <input
                    type="text"
                    value={locationStr}
                    onChange={(e) => setLocationStr(e.target.value)}
                    placeholder="e.g. Home Visit / Offline Center"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meeting Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClass || Boolean(conflictWarning)}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-40"
                >
                  {savingClass && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BREAK / UNAVAILABILITY MODAL */}
      {isBreakModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Protected Break Block</h3>
                <p className="text-xs text-slate-500">Blocks classes from conflicting with your rest</p>
              </div>
              <button
                onClick={() => setIsBreakModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBreak} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Break Title *
                </label>
                <input
                  type="text"
                  required
                  value={breakTitle}
                  onChange={(e) => setBreakTitle(e.target.value)}
                  placeholder="e.g. Lunch & Rest / Travel Time"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Type
                </label>
                <select
                  value={breakType}
                  onChange={(e) => setBreakType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="lunch">Lunch Time</option>
                  <option value="break">Short Rest Break</option>
                  <option value="unavailable">Unavailable Slot</option>
                  <option value="holiday">Holiday / Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={breakStartTime}
                    onChange={(e) => setBreakStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={breakEndTime}
                    onChange={(e) => setBreakEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recurrence
                </label>
                <select
                  value={breakRecurrence}
                  onChange={(e) => setBreakRecurrence(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="mon,tue,wed,thu,fri">Every Weekday (Mon–Fri)</option>
                  <option value="daily">Every Day</option>
                  <option value="sat,sun">Weekends Only</option>
                  <option value="once">One-Time Only</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBreakModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBreak}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {savingBreak && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Protected Break</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
