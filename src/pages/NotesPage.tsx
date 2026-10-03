import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, Note } from '../types/database';
import { FileText, Plus, X, Search, Trash2 } from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    if (!user) return;
    const stds = await dataService.getStudents(user.id);
    setStudents(stds);

    const key = `tutorflow_notes_${user.id}`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (saved.length === 0) {
      const initial: Note[] = [
        {
          id: 'note_1',
          tutor_id: user.id,
          student_id: stds[0]?.id || null,
          title: 'Calculus Progress & Strengths',
          content: 'Aarav is very strong with derivative power rules, but struggles slightly with the chain rule when combined with trigonometric substitutions. Need 1 dedicated practice hour on Friday.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      localStorage.setItem(key, JSON.stringify(initial));
      setNotes(initial);
    } else {
      setNotes(saved);
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    const key = `tutorflow_notes_${user.id}`;
    const newNote: Note = {
      id: 'nt_' + Math.random().toString(36).substring(2, 9),
      tutor_id: user.id,
      student_id: studentId || null,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    localStorage.setItem(key, JSON.stringify(updated));
    setNotes(updated);
    setIsAddModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleDeleteNote = (id: string) => {
    if (!user) return;
    const key = `tutorflow_notes_${user.id}`;
    const updated = notes.filter((n) => n.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    setNotes(updated);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tutor Teaching Notes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log student observations, teaching plans, and exam revision reminders
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const student = students.find((s) => s.id === note.student_id);

          return (
            <div
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-900">{note.title}</h3>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {student && (
                  <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold mb-2">
                    {student.full_name}
                  </span>
                )}

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                Created: {new Date(note.created_at).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD NOTE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add Teaching Note</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Related Student (Optional)</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">General Tutor Note</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your notes and observations..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
