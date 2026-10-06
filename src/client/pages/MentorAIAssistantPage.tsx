import React, { useState } from 'react';
import { api } from '../api/apiClient.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  Send,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  ListTodo,
  Compass,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface MentorAIAssistantPageProps {
  onNavigateToMentors: () => void;
}

export const MentorAIAssistantPage: React.FC<MentorAIAssistantPageProps> = ({
  onNavigateToMentors
}) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([
    {
      query: 'I want to become a software engineer but I do not know whether to focus on DSA or development.',
      response: {
        understanding: 'You are struggling with time allocation between LeetCode algorithmic problem solving (DSA) and building portfolio projects (full-stack web development).',
        direction: 'In the Indian tech market, DSA is essential for clearing automated online assessments (OAs) and preliminary screening rounds. However, depth in full-stack architecture wins the final interview discussions. Do not treat them as mutually exclusive: dedicate 70% of weekday mornings to DSA patterns, and reserve weekends for full-stack system architecture.',
        recommendedMentorType: 'Software Engineer II at Microsoft or Amazon who navigated campus placements and transitioned from college web development to corporate engineering.',
        immediateNextSteps: [
          'Choose one primary language for algorithms (C++ or Java) and one for backend (TypeScript / Node.js).',
          'Master Two Pointers, Sliding Window, and Tree Traversals (solve 25 curated LeetCode mediums).',
          'Deploy one production web project with real database indexing and authentication on your GitHub.',
          'Schedule a 1-on-1 strategy call on Mentor Connect AI with an alumnus from DTU or DU.'
        ],
        questionsForMentor: [
          'How did you divide your daily study hours between DSA and development during 3rd year?',
          'What specific backend projects stood out on your resume during technical rounds?',
          'How do interviewers evaluate candidates when DSA rounds are borderline?',
          'Which company online assessments (OAs) emphasize system design over competitive programming?'
        ],
        disclaimer: 'AI-generated guidance. Verify important career decisions with a qualified mentor.'
      }
    }
  ]);

  const quickQuestions = [
    'I want to become a software engineer but I don\'t know whether to focus on DSA or development.',
    'I want to prepare for GATE CS while managing college semester exams.',
    'How do I crack an off-campus internship at top product startups from a tier-3 college?',
    'I am confused between web development and applied AI/ML engineering.'
  ];

  const handleAsk = async (textToAsk: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await api.askMentorAI(q.trim());
      setHistory(prev => [
        {
          query: q.trim(),
          response: res.response
        },
        ...prev
      ]);
      setQuery('');
    } catch (err: any) {
      alert(err.message || 'AI Assistant temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Server-Side Gemini 3.8 Flash • Indian Academic Grounding</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          MentorAI Career Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Not sure what kind of mentorship you need? MentorAI analyzes your collegiate situation, suggests direction, and generates the exact questions you should ask a human senior.
        </p>
      </div>

      {/* Input Box & Quick Questions */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-4">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            placeholder="Ask anything: 'Confused between DSA vs Web Dev', 'GATE vs Placements', 'Tier-3 to Microsoft path'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <span>Consult MentorAI</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Prompts */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Demo Presets for Live Judging:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(qq);
                  handleAsk(qq);
                }}
                className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer text-left"
              >
                "{qq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation Cards */}
      <div className="space-y-6">
        {history.map((item, idx) => {
          const resp = item.response;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* User Prompt */}
              <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  You
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    "{item.query}"
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Profile Context: Computer Science Undergraduate • DU
                  </span>
                </div>
              </div>

              {/* AI Structured Output */}
              <div className="space-y-5">
                {/* 1. Understanding */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    1. Problem Diagnosis
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {resp.understanding}
                  </p>
                </div>

                {/* 2. Suggested Direction */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wide">
                    2. Recommended Strategic Direction
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/60">
                    {resp.direction}
                  </p>
                </div>

                {/* 3. Recommended Mentor Persona */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                    3. Recommended Human Mentor Persona
                  </span>
                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-emerald-950 font-semibold">
                      {resp.recommendedMentorType}
                    </p>
                    <button
                      onClick={onNavigateToMentors}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Find Matching Mentors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 4. Immediate Next Steps */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    4. Immediate Actionable Next Steps
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {resp.immediateNextSteps?.map((step: string, sIdx: number) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 flex items-start gap-2 border border-slate-200/60"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. High-Impact Questions for Mentor */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide">
                    5. High-Impact Questions to Ask Your Mentor in the 1-on-1 Call
                  </span>
                  <div className="space-y-1.5">
                    {resp.questionsForMentor?.map((q: string, qIdx: number) => (
                      <div
                        key={qIdx}
                        className="p-2.5 bg-purple-50/40 rounded-xl text-xs text-purple-950 flex items-start gap-2 border border-purple-100/60"
                      >
                        <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <span>"{q}"</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mandatory Disclaimer from Prompt Section 8 */}
                <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl text-[11px] text-amber-800 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {resp.disclaimer || 'AI-generated guidance. Verify important career decisions with a qualified mentor.'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
