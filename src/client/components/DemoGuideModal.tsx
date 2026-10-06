import React from 'react';
import { X, Clock, CheckCircle2, Sparkles, Video, ShieldCheck, Map, ArrowRight } from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpTo: (stepPath: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpTo
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      time: '0:00 - 0:30',
      title: 'Problem & Vision',
      speaker: 'Himesh',
      desc: 'Introduce the Indian student mentorship crisis: scattered advice vs. connecting with verified seniors who walked the exact path.',
      action: 'Show Landing Page with live stats & philosophy',
      path: '/'
    },
    {
      time: '0:30 - 1:15',
      title: 'Student Dashboard & Profile',
      speaker: 'Himesh',
      desc: 'Demonstrate real student profile (Maharaja Agrasen College CS), Career Readiness score (64%), and structured goals.',
      action: 'Open Student Dashboard',
      path: '/dashboard'
    },
    {
      time: '1:15 - 2:00',
      title: 'MentorAI Career Assistant',
      speaker: 'Arush Pratap',
      desc: 'Ask MentorAI a real student dilemma ("I want to become an SDE but confused between DSA vs Web Dev"). Show instant structured guidance + questions to ask mentor.',
      action: 'Open MentorAI Assistant',
      path: '/mentor-ai'
    },
    {
      time: '2:00 - 2:45',
      title: 'Deterministic Matching Engine',
      speaker: 'Raj Kurele',
      desc: 'Show 94% compatibility with Aditya Sharma (Microsoft / DTU). Click badge to reveal explainable breakdown (Skills, Role, Schedule, College).',
      action: 'Explore Mentor Matches',
      path: '/mentors'
    },
    {
      time: '2:45 - 3:45',
      title: 'Anti-Double Booking System',
      speaker: 'Raj Kurele',
      desc: 'Select available slot, book live session. Show strict server-side conflict detection preventing double booking.',
      action: 'Book Mentor Slot',
      path: '/mentors'
    },
    {
      time: '3:45 - 5:15',
      title: 'Live WebRTC Video & Screen Share',
      speaker: 'Himesh & Sakshi',
      desc: 'Launch real P2P encrypted video call with media controls, screen sharing, in-call chat, and graceful audio fallback.',
      action: 'Start Mentorship Session',
      path: '/sessions'
    },
    {
      time: '5:15 - 5:45',
      title: 'Personalized Career Roadmap',
      speaker: 'Arush Pratap',
      desc: 'Interactive 5-phase career roadmap. Check off tasks to watch Career Readiness % update dynamically.',
      action: 'View Career Roadmap',
      path: '/roadmap'
    },
    {
      time: '5:45 - 6:30',
      title: 'Admin Verification & Trust Engine',
      speaker: 'Sakshi Singh',
      desc: 'Switch to Admin. Inspect mentor uploaded document with AI OCR confidence score (98%) and approve to grant the Verified badge.',
      action: 'Open Admin Verification',
      path: '/admin/verification'
    },
    {
      time: '6:30 - 7:00',
      title: 'Admin Analytics & Closing Impact',
      speaker: 'Sakshi Singh',
      desc: 'Review verification funnels, session analytics, and category distributions with live Recharts visualizations.',
      action: 'Open Admin Analytics',
      path: '/admin'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-linear-to-r from-indigo-50/50 to-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                7-Minute Hackathon Demo Blueprint
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Rethink 26 • Maharaja Agrasen College, DU • Team Parallax (Himesh, Sakshi, Arush, Raj)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Steps Content */}
        <div className="p-6 overflow-y-auto space-y-3.5">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <span>
              💡 <strong>Judge Presentation Tip:</strong> Every button on Mentor Connect AI performs actual state mutations. Use the quick action buttons below to jump directly to any step during the presentation.
            </span>
          </div>

          <div className="space-y-3">
            {demoSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-2xs hover:shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      <Clock className="w-3 h-3" />
                      {step.time}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Speaker: {step.speaker}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xl">
                    {step.desc}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onJumpTo(step.path);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 rounded-lg transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  <span>{step.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Ready for 7-min pitch + 3-min technical Q&amp;A cross examination.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Got it, Let's Demo!
          </button>
        </div>
      </div>
    </div>
  );
};
