import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, Assignment } from '../types/database';
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Loader2,
  Users,
} from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Assignment Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const stdList = await dataService.getStudents(user.id);
      setStudents(stdList);

      const key = `tutorflow_assignments_${user.id}`;
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (saved.length === 0) {
        // Initial sample
        const initial = [
          {
            id: 'asg_1',
            tutor_id: user.id,
            student_id: stdList[0]?.id || null,
            title: 'Trigonometry Problem Set 3',
            description: 'Solve questions 1 through 15 on page 142. Show all step workings.',
            due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            status: 'assigned' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];
        localStorage.setItem(key, JSON.stringify(initial));
        setAssignments(initial);
      } else {
        setAssignments(saved);
      }
    } catch (err) {
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setSaving(true);
    const key = `tutorflow_assignments_${user.id}`;
    const newAsg: Assignment = {
      id: 'asg_' + Math.random().toString(36).substring(2, 9),
      tutor_id: user.id,
      student_id: studentId || null,
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate,
      status: 'assigned',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newAsg, ...assignments];
    localStorage.setItem(key, JSON.stringify(updated));
    setAssignments(updated);
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setSaving(false);
  };

  const handleToggleStatus = (id: string) => {
    if (!user) return;
    const key = `tutorflow_assignments_${user.id}`;
    const updated = assignments.map((a) => {
      if (a.id === id) {
        const nextStatus = a.status === 'assigned' ? 'reviewed' : 'assigned';
        return { ...a, status: nextStatus as any };
      }
      return a;
    });
    localStorage.setItem(key, JSON.stringify(updated));
    setAssignments(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Assignments & Tasks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign homework, track student deadlines, and review submissions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Assignment</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-14">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No assignments created yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Create your first assignment for students</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map((asg) => {
              const student = students.find((s) => s.id === asg.student_id);

              return (
                <div
                  key={asg.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{asg.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          asg.status === 'reviewed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>

                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      Student: {student?.full_name || 'All Enrolled Students'}
                    </p>

                    {asg.description && (
                      <p className="text-xs text-slate-600 mt-1 max-w-xl">{asg.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due date: {asg.due_date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(asg.id)}
                    className="self-end sm:self-auto px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    {asg.status === 'reviewed' ? 'Mark as Pending' : 'Mark as Reviewed'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD ASSIGNMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Assignment</h3>
                <p className="text-xs text-slate-500">Set task requirements and submission deadline</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Practice Questions"
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">All Students</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.grade || 'Student'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instructions / Homework Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Complete questions 1 to 10 from textbook..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
