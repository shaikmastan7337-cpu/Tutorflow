import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../lib/dataService';
import {
  User,
  Phone,
  MapPin,
  BookOpen,
  Coffee,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Plus,
  Sparkles,
} from 'lucide-react';

const COMMON_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Literature',
  'Computer Science / Coding',
  'Economics',
  'Accountancy',
];

export const OnboardingPage: React.FC = () => {
  const { user, profile, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Profile info
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || '');
  const [bio, setBio] = useState(profile?.bio || '');

  // Step 2: Subjects
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [customSubject, setCustomSubject] = useState('');

  // Step 3: Break & Availability defaults
  const [teachingMode, setTeachingMode] = useState<string>('hybrid');
  const [lunchBreakStart, setLunchBreakStart] = useState('13:00');
  const [lunchBreakEnd, setLunchBreakEnd] = useState('14:00');
  const [enableLunchProtection, setEnableLunchProtection] = useState(true);

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject.trim()) return;
    const trimmed = customSubject.trim();
    if (!selectedSubjects.includes(trimmed)) {
      setSelectedSubjects([...selectedSubjects, trimmed]);
    }
    setCustomSubject('');
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedSubjects.length === 0) {
        setError('Please select or add at least one subject you teach.');
        return;
      }
      setStep(3);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setError(null);
    setSubmitting(true);

    try {
      // 1. Complete onboarding profile & subjects
      const res = await completeOnboarding({
        fullName,
        phone,
        city,
        bio,
        subjects: selectedSubjects,
      });

      if (res.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }

      // 2. Pre-configure tutor lunch availability block if enabled
      if (enableLunchProtection) {
        try {
          await dataService.addAvailabilityBlock(user.id, {
            type: 'lunch',
            title: 'Tutor Lunch & Rest Break',
            start_time: lunchBreakStart,
            end_time: lunchBreakEnd,
            recurrence_rule: 'mon,tue,wed,thu,fri',
            specific_date: null,
          });
        } catch (e) {
          console.error('Failed to create default break block:', e);
        }
      }

      // 3. Seed demo students & classes if starting fresh
      await dataService.seedDemoDataIfEmpty(user.id);

      // 4. Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred completing onboarding';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-xl w-full mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Welcome to TutorFlow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Set up your teaching workspace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Customize your schedule, subjects, and break preferences in 2 minutes
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between mb-8 max-w-sm mx-auto px-4">
          <div className="flex items-center flex-col gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Profile</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center flex-col gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Subjects</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          <div className="flex items-center flex-col gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span className="text-[10px] font-semibold text-slate-600">Breaks</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* STEP 1: TUTOR DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Your Tutor Profile</h3>
                <p className="text-xs text-slate-500">How you will appear to parents and students</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Title *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar or Priya Sen"
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Area
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Pune, Delhi"
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Bio or Specialty
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. 10+ years helping high school students master Board & Competitive exam Mathematics."
                  className="block w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SUBJECTS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Subjects Taught</h3>
                <p className="text-xs text-slate-500">Select all areas you tutor or add custom ones</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {COMMON_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom subject */}
              <form onSubmit={handleAddCustomSubject} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Add another subject (e.g. SAT Verbal, French)"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Selected ({selectedSubjects.length}):</span>{' '}
                {selectedSubjects.join(', ')}
              </div>
            </div>
          )}

          {/* STEP 3: BREAKS & SCHEDULE */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Teaching Mode & Break Protection</h3>
                <p className="text-xs text-slate-500">TutorFlow prevents burnout by guarding your schedule</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Primary Teaching Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'hybrid', label: 'Hybrid' },
                    { id: 'home', label: 'Home Visits' },
                    { id: 'online', label: 'Online' },
                    { id: 'center', label: 'Center' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTeachingMode(mode.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        teachingMode === mode.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Daily Lunch & Rest Protection</h4>
                      <p className="text-[11px] text-amber-700">Blocks classes from overlapping your rest time</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableLunchProtection}
                    onChange={(e) => setEnableLunchProtection(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-amber-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {enableLunchProtection && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                        Break Start Time
                      </label>
                      <input
                        type="time"
                        value={lunchBreakStart}
                        onChange={(e) => setLunchBreakStart(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                        Break End Time
                      </label>
                      <input
                        type="time"
                        value={lunchBreakEnd}
                        onChange={(e) => setLunchBreakEnd(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Launching Workspace...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete & Go to Dashboard</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
