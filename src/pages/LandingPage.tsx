import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Smartphone,
  Clock,
  ArrowRight,
  Coffee,
  Check,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <span className="font-extrabold text-lg">T</span>
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">TutorFlow</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Production V1
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#breaks" className="hover:text-indigo-600 transition-colors">Breaks & Scheduling</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 active:scale-95 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200/80 text-indigo-800 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Built Specifically for Private & Home Tutors</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            The modern digital operating system for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
              independent tutors
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate messy WhatsApp chats, forgotten payments, and paper diaries. TutorFlow manages your students, break-aware scheduling, attendance, fee collections, and lesson preparation in one mobile-first app.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              <span>Start Free (Up to 5 Students)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-2xs transition-all"
            >
              <span>Live Tutor Demo</span>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mobile-First Thumb Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>Smart Break & Conflict Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Pending Fee Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Gemini AI Lesson Tools</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="mt-14 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl shadow-indigo-900/20 border border-slate-800">
            <div className="bg-slate-950 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white border border-slate-800/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">tutorflow.app/dashboard</span>
                </div>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operational Shell
                </span>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Classes Today</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1">4 Lessons</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Next at 4:00 PM</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Active Students</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-300 mt-1">12 Enrolled</p>
                  <p className="text-[11px] text-slate-400 mt-1">Math, Physics, Chem</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Attendance Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">94.8%</p>
                  <p className="text-[11px] text-slate-400 mt-1">This month</p>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Pending Fees</p>
                  <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">₹5,500</p>
                  <p className="text-[11px] text-slate-400 mt-1">2 invoices due</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300 font-medium">
                    Break Protected: <span className="text-amber-300">1:00 PM – 2:00 PM</span> (Lunch & Prep)
                  </span>
                </div>
                <span className="text-indigo-400 font-semibold hidden sm:inline">Conflict Guard Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Production Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Everything an independent educator needs in one flow
            </p>
            <p className="mt-4 text-base text-slate-600">
              Designed around how real private tutors teach: on the go, between classes, on phones, and directly coordinating with parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Student & Guardian Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Centralized student profiles with grades, school, subjects, parent contact numbers, and complete history of attendance and fee payments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Class Scheduler & Day Views</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Schedule individual and batch lessons with student tags, locations, or video meeting links. Day, week, and month calendar perspectives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Break & Availability Protection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Configure mid-class student breaks (e.g. 50m lesson + 15m rest) and guard tutor lunch/break periods with automated conflict warning alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">One-Tap Attendance Logging</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Quickly mark Present, Absent, or Late directly from the class timeline or student roster. Instant attendance percentage calculation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Tuition Fee & Receipt Tracking</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Track pending, paid, and overdue tuition fees across all students. Record payment methods (UPI, Cash, Bank Transfer) with one tap.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Teaching Assistant</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Generate structured lesson plans, student practice tests, polite fee reminder drafts, and WhatsApp-ready parent updates in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: Breaks & Availability */}
      <section id="breaks" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4">
                <Clock className="w-3.5 h-3.5" />
                <span>Featured Innovation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Designed for human tutors with real energy limits
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Unlike generic calendars, TutorFlow treats breaks as first-class citizens. Set recurring lunch hours or unavailable slots, and TutorFlow actively prevents you from double-booking.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Configurable Mid-Class Breaks</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      For long 90-minute or 2-hour sessions, insert 5, 10, or 15-minute breaks in the middle so students don't lose focus.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Tutor Availability Blocks</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Block 1:00 PM – 2:00 PM every weekday for rest or meal times. The scheduling system will flag any class trying to overlap.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Mobile-First Instant Scheduling</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Schedule a class in under 15 seconds from your phone right after finishing a session.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule Preview</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Conflict Guard: Active
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-900">Maths: Grade 10 Trigonometry</p>
                    <p className="text-[11px] text-indigo-700">Aarav Sharma • 11:30 AM – 1:00 PM</p>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-200">
                    10m Mid-Break
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Tutor Lunch & Rest Window</p>
                      <p className="text-[11px] text-amber-700">1:00 PM – 2:00 PM (Protected Recurring)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Blocked</span>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-indigo-900">Physics: Motion & Dynamics</p>
                    <p className="text-[11px] text-indigo-700">Ananya Verma • 2:15 PM – 3:30 PM</p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-white px-2 py-1 rounded-md border border-emerald-200">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Experiment Section */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              Transparent Pricing
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Affordable plans built for individual tutors
            </p>
            <p className="mt-4 text-sm text-slate-600">
              Start completely free. Upgrade to Pro when you're ready to unlock unlimited students and AI power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Free Plan */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter Free</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-sm font-medium text-slate-500">/month</span>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  Ideal for solo tutors starting out with a small handful of students.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 5 active students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Class scheduling & calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Attendance logging & stats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fee tracking & due dates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>10 AI generations / month</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-7 rounded-3xl border-2 border-indigo-600 shadow-xl shadow-indigo-100 flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Tutor Pro</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹99</span>
                  <span className="text-sm font-medium text-slate-500">/month</span>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  For growing tutors who want complete automation and higher capacity.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 font-bold" />
                    <span className="font-semibold text-slate-900">Unlimited students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Smart Break & Conflict Protection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Higher AI allowance (Lesson plans & tests)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>WhatsApp fee reminder generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Receipt generator & monthly reports</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-200 transition-all"
              >
                Start 14-Day Pro Trial
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Yearly Value</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Save 16%
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-sm font-medium text-slate-500">/year</span>
                </div>
                <p className="mt-3 text-xs text-slate-600">
                  Full annual peace of mind with 2 months free and priority support.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>All Pro features included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Annual analytics & student progress cards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority feature requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dedicated onboarding assistance</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/signup"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Choose Yearly
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-slate-500">Everything you need to know about TutorFlow</p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Is TutorFlow mobile-friendly?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Yes! TutorFlow is built mobile-first. The bottom navigation bar and Quick Action modal allow you to log attendance, check fees, or schedule classes easily on any smartphone screen.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Can other tutors see my students or fees?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                No. TutorFlow enforces strict Row Level Security (RLS) on PostgreSQL. Each tutor's data is completely isolated and strictly accessible only by their authenticated credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">How do the AI features work?</h4>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                TutorFlow integrates Google Gemini through secure server-side execution. You can generate lesson outlines, student quiz questions, and polite WhatsApp fee reminders without needing any technical knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-tr from-indigo-700 to-purple-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your tutoring business?
          </h2>
          <p className="mt-4 text-base text-indigo-100 max-w-xl mx-auto">
            Join independent tutors managing classes, attendance, fees, and students with TutorFlow.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-50 font-bold text-sm shadow-xl active:scale-95 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              T
            </div>
            <span className="font-bold text-white text-sm">TutorFlow</span>
            <span className="text-slate-600 ml-2">© 2026 TutorFlow SaaS. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Tutor Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
