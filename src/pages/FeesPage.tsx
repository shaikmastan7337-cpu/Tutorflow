import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import type { Student, FeeRecord, FeeStatus, PaymentMethod } from '../types/database';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Receipt,
  X,
  Loader2,
  DollarSign,
  Share2,
} from 'lucide-react';

export const FeesPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Add Fee Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('2500');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Monthly tuition fee');
  const [savingFee, setSavingFee] = useState(false);

  // Receipt Modal
  const [receiptFee, setReceiptFee] = useState<FeeRecord | null>(null);

  useEffect(() => {
    if (user) {
      loadFees();
    }
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'new') {
      setIsAddModalOpen(true);
      const preStudent = params.get('studentId');
      if (preStudent) setStudentId(preStudent);
    }
  }, [user, location.search]);

  const loadFees = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [feeList, stdList] = await Promise.all([
        dataService.getFees(user.id),
        dataService.getStudents(user.id),
      ]);
      setFees(feeList);
      setStudents(stdList);
      if (stdList.length > 0 && !studentId) {
        setStudentId(stdList[0].id);
      }
    } catch (err) {
      console.error('Error loading fees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !studentId || !amount) return;

    setSavingFee(true);
    try {
      const created = await dataService.addFee(user.id, {
        student_id: studentId,
        amount: Number(amount),
        due_date: dueDate,
        status: 'pending',
        notes: notes.trim() || null,
      });

      setFees([created, ...fees]);
      setIsAddModalOpen(false);
      resetFeeForm();
    } catch (err) {
      console.error('Error adding fee:', err);
    } finally {
      setSavingFee(false);
    }
  };

  const handleMarkPaid = async (feeId: string, method: PaymentMethod = 'upi') => {
    if (!user) return;
    const now = new Date().toISOString().split('T')[0];

    // Optimistic update
    setFees((prev) =>
      prev.map((f) =>
        f.id === feeId
          ? { ...f, status: 'paid', paid_date: now, payment_method: method }
          : f
      )
    );

    // Save to store
    const key = `tutorflow_fees_${user.id}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const idx = list.findIndex((f: FeeRecord) => f.id === feeId);
    if (idx !== -1) {
      list[idx].status = 'paid';
      list[idx].paid_date = now;
      list[idx].payment_method = method;
      localStorage.setItem(key, JSON.stringify(list));
    }
  };

  const resetFeeForm = () => {
    setAmount('2500');
    setDueDate(new Date().toISOString().split('T')[0]);
    setNotes('Monthly tuition fee');
  };

  const handleSendReminder = (fee: FeeRecord) => {
    const student = students.find((s) => s.id === fee.student_id);
    const parentPhone = student?.parent_phone || student?.phone || '';
    const cleanPhone = parentPhone.replace(/[^0-9]/g, '');

    const message = `Hello ${student?.parent_name || 'Parent'}, this is a polite reminder from your tutor regarding the tuition fee of ₹${fee.amount} for ${student?.full_name}, due on ${fee.due_date}. Thank you!`;

    const encoded = encodeURIComponent(message);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Metrics
  const totalCollected = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const totalPending = fees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + Number(f.amount || 0), 0);

  const overdueCount = fees.filter((f) => f.status === 'overdue').length;

  const filteredFees = fees.filter((f) => {
    if (filterStatus === 'all') return true;
    return f.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Fee Management & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log tuition invoices, verify payments via UPI or cash, and share WhatsApp reminders
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Fee Invoice</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Collected</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ₹{totalCollected.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Cleared payments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Balance</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            ₹{totalPending.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting settlement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Overdue Invoices</span>
            <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {overdueCount} Invoices
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Follow up with parents</p>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {(['all', 'pending', 'paid', 'overdue'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Fees Invoices Table/List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredFees.length === 0 ? (
          <div className="text-center py-14">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No fee records found in this category</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click New Fee Invoice to add a record</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredFees.map((fee) => {
              const student = students.find((s) => s.id === fee.student_id);

              return (
                <div
                  key={fee.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      ₹
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">₹{fee.amount}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            fee.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : fee.status === 'overdue'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {fee.status}
                        </span>
                      </div>

                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                        {student?.full_name || 'Student'} {student?.parent_name ? `• Parent: ${student.parent_name}` : ''}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Due: {fee.due_date}</span>
                        {fee.paid_date && <span>• Paid on {fee.paid_date} via {fee.payment_method?.toUpperCase()}</span>}
                        {fee.notes && <span>• {fee.notes}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                    {fee.status !== 'paid' && (
                      <>
                        <button
                          onClick={() => handleMarkPaid(fee.id, 'upi')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleSendReminder(fee)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors"
                          title="Send WhatsApp Reminder"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setReceiptFee(fee)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="View Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE FEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create Fee Invoice</h3>
                <p className="text-xs text-slate-500">Log an upcoming or current tuition fee</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFee} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Student *
                </label>
                <select
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Choose student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.grade || 'Student'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fee Description / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Monthly tuition fee for October"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
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
                  disabled={savingFee}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {savingFee && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Invoice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT PREVIEW MODAL */}
      {receiptFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Official Tuition Receipt</span>
              <button
                onClick={() => setReceiptFee(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-xs text-slate-400">TUTORFLOW VERIFIED RECEIPT</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1">₹{receiptFee.amount}</h3>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  receiptFee.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {receiptFee.status}
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">
                    {students.find((s) => s.id === receiptFee.student_id)?.full_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoice ID:</span>
                  <span className="font-mono text-slate-600">{receiptFee.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="text-slate-800">{receiptFee.due_date}</span>
                </div>
                {receiptFee.paid_date && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid Date:</span>
                    <span className="text-slate-800">{receiptFee.paid_date}</span>
                  </div>
                )}
                {receiptFee.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Mode:</span>
                    <span className="text-slate-800 uppercase font-semibold">{receiptFee.payment_method}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
