import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Check,
  Sparkles,
  CreditCard,
  Zap,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'yearly'>('free');
  const [upgraded, setUpgraded] = useState(false);

  const handleSelectPlan = (plan: 'free' | 'pro' | 'yearly') => {
    setCurrentPlan(plan);
    setUpgraded(true);
    setTimeout(() => setUpgraded(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Subscription & Plans
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Simple pricing designed for individual tutors and home educators
        </p>
      </div>

      {upgraded && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          🎉 Plan updated to {currentPlan.toUpperCase()}!
        </div>
      )}

      {/* Current Active Plan Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-300">Current Subscription</span>
          <h2 className="text-xl font-bold mt-1">
            {currentPlan === 'free' ? 'Starter Free Tier' : currentPlan === 'pro' ? 'Tutor Pro' : 'Annual Value'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentPlan === 'free'
              ? 'Up to 5 students, basic attendance & fees, 10 AI generations/month'
              : 'Unlimited students, conflict break protection, advanced AI and WhatsApp reminders'}
          </p>
        </div>

        <div className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
          Active Plan
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Starter Free</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">₹0</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              For tutors starting out with a few individual students.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Up to 5 active students</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Schedule & calendar</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Attendance tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>10 AI generations / month</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('free')}
            disabled={currentPlan === 'free'}
            className="mt-6 w-full py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-600 shadow-lg shadow-indigo-100 flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase">
            Recommended
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-indigo-600 tracking-wider">Tutor Pro</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">₹99</span>
              <span className="text-xs text-slate-400">/month</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Unlimited students and advanced break-aware scheduling.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                <span className="font-semibold text-slate-900">Unlimited students</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>Smart Break conflict protection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>Unlimited AI lesson prep</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>WhatsApp fee reminder templates</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('pro')}
            className={`mt-6 w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
              currentPlan === 'pro'
                ? 'bg-slate-100 text-slate-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro (₹99)'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Yearly Saver</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                16% OFF
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">₹999</span>
              <span className="text-xs text-slate-400">/year</span>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Get 2 months free with full Pro features all year round.
            </p>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Pro features included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Priority email support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Annual student progress report export</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('yearly')}
            className={`mt-6 w-full py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
              currentPlan === 'yearly'
                ? 'bg-slate-100 text-slate-600'
                : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            {currentPlan === 'yearly' ? 'Current Plan' : 'Select Yearly (₹999)'}
          </button>
        </div>
      </div>
    </div>
  );
};
