import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">
                Mentor Connect AI
              </span>
              <p className="text-xs text-slate-500">
                Don't just give students information. Connect them with someone who walked the path.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-500 text-center sm:text-right">
            <div>
              Built for <strong className="text-slate-800">Rethink 26 Hackathon</strong>
              <span className="mx-1.5">•</span>
              Maharaja Agrasen College, University of Delhi
            </div>
            <div className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Team Parallax: Himesh • Sakshi • Arush • Raj
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Mentor Connect AI. All rights reserved.</span>
          <span>Verified Alumni Mentorship Network • WebRTC Peer Video • Explainable Matching</span>
        </div>
      </div>
    </footer>
  );
};
