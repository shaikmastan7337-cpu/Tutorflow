import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  FileSpreadsheet,
  UserCheck,
  CreditCard,
  Copy,
  Check,
  Send,
  Loader2,
  Lock,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<
    'message' | 'lesson_plan' | 'assignment' | 'fee_reminder' | 'student_summary'
  >('message');

  // Input states
  const [promptTopic, setPromptTopic] = useState('Polynomial factorisation and quadratic equations');
  const [gradeLevel, setGradeLevel] = useState('Grade 10');
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [usageCount, setUsageCount] = useState(3);
  const maxUsage = 10; // Free plan limit

  const handleGenerate = () => {
    if (usageCount >= maxUsage) return;
    setGenerating(true);
    setCopied(false);

    setTimeout(() => {
      let output = '';
      if (activeTool === 'message') {
        output = `Dear Parent, this is an update regarding ${studentName}'s recent tutoring sessions. We have been making solid progress in ${promptTopic}. ${studentName} is participating actively and showing great grasping speed. Please remind them to review the chapter 4 summary before our next session. Warm regards!`;
      } else if (activeTool === 'lesson_plan') {
        output = `# Lesson Plan: ${promptTopic} (${gradeLevel})

## 1. Learning Objectives
- Master fundamental definitions and geometric interpretations.
- Solve standard textbook problems within 3-5 minutes per problem.

## 2. Concept Breakdown (20 mins)
- Real-world motivation and visual graphs.
- Step-by-step formula breakdown with worked examples.

## 3. Guided Practice (25 mins)
- 3 foundational problem examples solved on whiteboard.
- 2 student practice problems with immediate feedback.

## 4. Student Rest Break (10 mins)
- Brain refresh window to maintain peak retention.

## 5. Rapid Quiz & Homework (15 mins)
- 5 multiple-choice questions to test concept grasp.
- Homework: Questions 1 to 8 on page 84.`;
      } else if (activeTool === 'fee_reminder') {
        output = `Hello! Hope you are having a wonderful week. This is a gentle note from your tutor regarding the tuition fee for ${studentName}. The current invoice is due shortly. Kindly transfer via UPI or your preferred payment mode at your earliest convenience. Thank you for your continued support!`;
      } else if (activeTool === 'assignment') {
        output = `# Practice Quiz: ${promptTopic}

**Level**: ${gradeLevel} | **Total Marks**: 20

1. **Question 1 (2 Marks)**: State the primary theorem and explain why the condition must hold true.
2. **Question 2 (4 Marks)**: Solve for x: 2x² - 7x + 3 = 0. Show full factorization steps.
3. **Question 3 (4 Marks)**: Find the roots and verify the relationship between roots and coefficients.
4. **Answer Key & Scoring Guide**:
   - Q1: Definition (1 mark) + condition (1 mark)
   - Q2: x = 3, x = 1/2
   - Q3: Sum of roots = -b/a, product = c/a`;
      } else {
        output = `### Student Academic Summary: ${studentName}
- **Curriculum**: ${gradeLevel} Mathematics & Physics
- **Attendance**: 94% Verified Present (Consistent attendance)
- **Strengths**: High algebraic manipulation speed and conceptual confidence.
- **Focus Areas**: Needs careful checking of calculation signs during multi-step exam questions.`;
      }

      setGeneratedResult(output);
      setUsageCount((prev) => prev + 1);
      setGenerating(false);
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(generatedResult);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              AI Teaching Assistant
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-pink-100 text-pink-700">
              Gemini Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Accelerate your teaching preparation: lesson plans, quizzes, parent messages, and fee reminders
          </p>
        </div>

        {/* Free Plan Usage Counter */}
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div>
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-semibold text-slate-700">Monthly Usage</span>
              <span className="font-bold text-indigo-600">
                {usageCount} / {maxUsage}
              </span>
            </div>
            <div className="w-32 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${(usageCount / maxUsage) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'message', label: 'Parent Update', icon: MessageSquare },
          { id: 'lesson_plan', label: 'Lesson Planner', icon: BookOpen },
          { id: 'assignment', label: 'Quiz Generator', icon: FileSpreadsheet },
          { id: 'fee_reminder', label: 'Fee Reminder', icon: CreditCard },
          { id: 'student_summary', label: 'Student Summary', icon: UserCheck },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id as any);
                setGeneratedResult('');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                activeTool === t.id
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-2xs font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Two Column Layout: Generator inputs & Results preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Generation Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class / Grade Level
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="Grade 10"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Topic or Specific Prompt
            </label>
            <textarea
              rows={3}
              value={promptTopic}
              onChange={(e) => setPromptTopic(e.target.value)}
              placeholder="e.g. Quadratic equations, factorisation methods..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating || usageCount >= maxUsage}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating with AI...</span>
              </>
            ) : usageCount >= maxUsage ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Monthly Limit Reached (Upgrade to Pro)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Output Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Generated Output
              </h2>
              {generatedResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                    title="Copy text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                    title="Share on WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              )}
            </div>

            {generatedResult ? (
              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
                {generatedResult}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No output generated yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Select a tool, fill in the topic details, and tap Generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
