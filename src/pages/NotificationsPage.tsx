import React from 'react';
import { Bell, CheckCircle2, Clock, CreditCard, Sparkles } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const notifications = [
    {
      id: 1,
      title: 'Upcoming Class Reminder',
      description: 'Calculus Session 4 with Aarav Sharma starts in 45 minutes.',
      time: '15 mins ago',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      id: 2,
      title: 'Fee Payment Received',
      description: '₹3,000 received via UPI for Ananya Verma (October Tuition).',
      time: '2 hours ago',
      icon: CreditCard,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 3,
      title: 'Break Window Scheduled',
      description: 'Your lunch break (1:00 PM – 2:00 PM) is guarded against conflicts.',
      time: 'Today morning',
      icon: CheckCircle2,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time alerts for classes, fee settlements, and break reminders
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-50/50 transition-colors">
              <div className={`p-2.5 rounded-xl ${item.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <span className="text-[10px] text-slate-400">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
