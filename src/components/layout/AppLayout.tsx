import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Settings,
  ShieldCheck,
  LogOut,
  Plus,
  Bell,
  Database,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from './BottomNav';
import { QuickActionModal } from './QuickActionModal';

export const AppLayout: React.FC = () => {
  const { profile, signOut, isConfigured } = useAuth();
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/schedule', label: 'Schedule & Breaks', icon: Calendar },
    { to: '/attendance', label: 'Attendance', icon: CheckCircle2 },
    { to: '/fees', label: 'Fees & Invoicing', icon: CreditCard },
    { to: '/assignments', label: 'Assignments', icon: FileSpreadsheet },
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'V2 Preview' },
  ];

  const secondaryLinks = [
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/billing', label: 'Subscription & Plans', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-30">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
            <NavLink to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
                <span className="font-extrabold text-lg">T</span>
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight">TutorFlow</span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-600">SaaS Operating System</span>
              </div>
            </NavLink>
          </div>

          {/* Quick Create Action in Sidebar */}
          <div className="px-4 py-3">
            <button
              onClick={() => setQuickActionOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Quick Action</span>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management
            </div>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-indigo-100 text-indigo-700 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            <div className="pt-4 px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Account & Config
            </div>
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Tutor Profile Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {profile?.full_name || 'Tutor User'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{profile?.city || 'Private Tutor'}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Brand indicator */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="font-bold text-slate-900 text-sm">TutorFlow</span>
            </div>

            {/* Cloud Database Sync Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 text-slate-600 border-slate-200">
              <Database className={`w-3 h-3 ${isConfigured ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span>
                {isConfigured ? 'Supabase PostgreSQL' : 'Local Persistence (Ready for .env)'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setQuickActionOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Action</span>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>

            {/* Mobile / Header Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'T'}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{profile?.full_name || 'Tutor'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{profile?.email}</p>
                  </div>
                  <NavLink
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </NavLink>
                  <NavLink
                    to="/billing"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Billing & Plan</span>
                  </NavLink>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation with Floating Action Button */}
      <BottomNav onOpenQuickAction={() => setQuickActionOpen(true)} />

      {/* Speed Quick Actions Modal */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
      />
    </div>
  );
};
