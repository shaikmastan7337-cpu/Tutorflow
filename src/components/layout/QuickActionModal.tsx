import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Sparkles,
  X,
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect?: (action: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onActionSelect,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const actions = [
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Enroll a new student and parent contact details',
      icon: UserPlus,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('add-student');
        else navigate('/students?action=new');
      },
    },
    {
      id: 'schedule-class',
      title: 'Schedule Class',
      description: 'Create lesson with student, time and break options',
      icon: CalendarPlus,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('schedule-class');
        else navigate('/schedule?action=new');
      },
    },
    {
      id: 'record-attendance',
      title: 'Record Attendance',
      description: 'Mark present, absent, or late for today\'s classes',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('record-attendance');
        else navigate('/attendance');
      },
    },
    {
      id: 'add-fee',
      title: 'Add Fee Invoice',
      description: 'Log tuition fees, due dates or payment received',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('add-fee');
        else navigate('/fees?action=new');
      },
    },
    {
      id: 'add-assignment',
      title: 'Add Assignment',
      description: 'Assign tasks, homework or test papers to students',
      icon: FileSpreadsheet,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('add-assignment');
        else navigate('/assignments?action=new');
      },
    },
    {
      id: 'ask-ai',
      title: 'Ask AI Assistant',
      description: 'Generate lesson plans, parent messages or practice tests',
      icon: Sparkles,
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      action: () => {
        onClose();
        if (onActionSelect) onActionSelect('ask-ai');
        else navigate('/ai-assistant');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
            <p className="text-xs text-slate-500">Fast workflows for your teaching day</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 grid grid-cols-1 gap-2 max-h-[75vh] overflow-y-auto">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.action}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-all group"
              >
                <div className={`p-2.5 rounded-lg border ${act.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {act.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {act.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
