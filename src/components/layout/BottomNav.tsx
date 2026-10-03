import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  CreditCard,
  Menu,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  X,
  CreditCard as BillingIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  onOpenQuickAction: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenQuickAction }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowMoreMenu(false);
    await signOut();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 py-1 px-1 text-xs font-medium transition-colors ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 pb-safe safe-area-inset-bottom">
        <div className="flex items-center justify-between h-16 max-w-lg mx-auto">
          {/* Home */}
          <NavLink to="/dashboard" className={navItemClass}>
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </NavLink>

          {/* Students */}
          <NavLink to="/students" className={navItemClass}>
            <Users className="w-5 h-5 mb-0.5" />
            <span>Students</span>
          </NavLink>

          {/* Floating Action Button */}
          <div className="flex items-center justify-center flex-1 -mt-5">
            <button
              onClick={onOpenQuickAction}
              className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
              aria-label="Create new"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Schedule */}
          <NavLink to="/schedule" className={navItemClass}>
            <Calendar className="w-5 h-5 mb-0.5" />
            <span>Schedule</span>
          </NavLink>

          {/* Fees */}
          <NavLink to="/fees" className={navItemClass}>
            <CreditCard className="w-5 h-5 mb-0.5" />
            <span>Fees</span>
          </NavLink>

          {/* More Menu Trigger */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More Drawer */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200">
          <div 
            className="w-full bg-white rounded-t-2xl p-5 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{profile?.full_name || 'Tutor'}</p>
                <p className="text-xs text-slate-500">{profile?.email}</p>
              </div>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                onClick={() => { setShowMoreMenu(false); navigate('/attendance'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">Attendance</span>
              </button>

              <button
                onClick={() => { setShowMoreMenu(false); navigate('/assignments'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-slate-800">Assignments</span>
              </button>

              <button
                onClick={() => { setShowMoreMenu(false); navigate('/notes'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800">Notes</span>
              </button>

              <button
                onClick={() => { setShowMoreMenu(false); navigate('/ai-assistant'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-semibold text-slate-800">AI Assistant</span>
              </button>

              <button
                onClick={() => { setShowMoreMenu(false); navigate('/settings'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold text-slate-800">Settings</span>
              </button>

              <button
                onClick={() => { setShowMoreMenu(false); navigate('/billing'); }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 text-left transition-colors"
              >
                <BillingIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-slate-800">Billing & Plans</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <button
                onClick={() => { setShowMoreMenu(false); navigate('/'); }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Visit Landing Page</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
