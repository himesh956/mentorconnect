import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sparkles, User, Shield, GraduationCap, BookOpen, Layers } from 'lucide-react';
import { DemoGuideModal } from './DemoGuideModal.tsx';

interface DemoBarProps {
  onNavigate: (path: string) => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onNavigate }) => {
  const { user, loginAs } = useAuth();
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wider text-slate-200">
              RETHINK 26 HACKATHON DEMO
            </span>
            <span className="hidden sm:inline text-slate-400">
              • Team <strong className="text-indigo-300">Parallax</strong> (Maharaja Agrasen College, DU)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium hidden md:inline">Quick Role Switch:</span>

            <button
              onClick={() => {
                loginAs('student');
                onNavigate('/dashboard');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                user?.role === 'student'
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student (Himesh)</span>
            </button>

            <button
              onClick={() => {
                loginAs('mentor');
                onNavigate('/mentor/dashboard');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                user?.role === 'mentor'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mentor (Aditya, Microsoft)</span>
            </button>

            <button
              onClick={() => {
                loginAs('admin');
                onNavigate('/admin');
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                user?.role === 'admin'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-400/50 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin (Sakshi)</span>
            </button>

            <button
              onClick={() => setShowGuide(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:brightness-110 transition-all cursor-pointer shadow-xs ml-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>7-Min Pitch Guide</span>
            </button>
          </div>
        </div>
      </div>

      <DemoGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onJumpTo={onNavigate}
      />
    </>
  );
};
