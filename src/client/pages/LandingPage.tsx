import React, { useState, useEffect } from 'react';
import { MentorProfile } from '../../types/index.ts';
import { api } from '../api/apiClient.ts';
import { MentorCard } from '../components/MentorCard.tsx';
import { VerifiedBadge } from '../components/VerifiedBadge.tsx';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Video,
  CheckCircle2,
  Users,
  Star,
  Layers,
  GraduationCap,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onSelectMentor: (mentorId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectMentor }) => {
  const [featuredMentors, setFeaturedMentors] = useState<MentorProfile[]>([]);

  useEffect(() => {
    api.getMentors({ verifiedOnly: true }).then(res => {
      setFeaturedMentors(res.mentors.slice(0, 3));
    }).catch(err => {
      console.warn('Error fetching mentors:', err);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-linear-to-b from-indigo-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Hackathon banner pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-bold tracking-wide border border-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>RETHINK 26 HACKATHON • MAHARAJA AGRASEN COLLEGE, DU</span>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Find the mentor who has already{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                walked your path.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Generic internet advice is scattered and unreliable. Mentor Connect AI matches you with verified college seniors and alumni from IITs, DTU, NSUT, and DU who conquered the exact examinations, internships, and tech placements you are targeting.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onNavigate('/mentors')}
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>Find My Mentor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('/mentor-ai')}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Ask MentorAI Assistant</span>
              </button>
            </div>

            {/* Trust metrics bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-slate-200/80 text-center">
              <div>
                <div className="text-2xl font-extrabold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Verified College Credentials</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-indigo-600">94%</div>
                <div className="text-xs text-slate-500 font-medium">Algorithmic Match Precision</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">4.9★</div>
                <div className="text-xs text-slate-500 font-medium">Average Student Rating</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-600">WebRTC</div>
                <div className="text-xs text-slate-500 font-medium">Peer-to-Peer 1-on-1 Video</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Problem Section */}
      <section className="py-16 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">The Real Problem</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Why Indian engineering &amp; college students get stuck
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="font-bold text-slate-900 text-base">Scattered &amp; Generic Internet Advice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tutorial videos and Reddit threads lack context on your specific college, degree branch, and current semester timeline.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                !
              </div>
              <h3 className="font-bold text-slate-900 text-base">Fake Credentials &amp; Unverified Advice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                LinkedIn is filled with influencers who have never cleared corporate coding bars or managed off-campus placement drives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="font-bold text-slate-900 text-base">The Mentor Connect AI Solution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with verified seniors from DU, DTU, NSUT, and IITs who have actually worked at Microsoft, Amazon, Google, and Razorpay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Mentors Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Alumni Network</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Mentors ready to guide your journey
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/mentors')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all 15+ verified mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredMentors.map(mentor => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onViewProfile={onSelectMentor}
                onBookSuccess={() => onNavigate('/sessions')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / 4-Step Journey */}
      <section className="py-16 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Product Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              From confused student to placement-ready engineer
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-slate-900 text-sm">Create Profile &amp; Goals</h4>
              <p className="text-xs text-slate-600">Input your college, degree, skills, and target companies or exams.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-slate-900 text-sm">AI Career Diagnostic</h4>
              <p className="text-xs text-slate-600">MentorAI evaluates your readiness and identifies high-yield skill milestones.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-slate-900 text-sm">Explainable Matching</h4>
              <p className="text-xs text-slate-600">See exactly why a mentor matches: skills, college background, and availability.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-2.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">4</span>
              <h4 className="font-bold text-slate-900 text-sm">1-on-1 Call &amp; Roadmap</h4>
              <p className="text-xs text-slate-600">Live WebRTC video session, post-call action items, and tracked roadmap progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to experience real mentorship?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto">
            Book a slot with an industry alumnus today. No fake badges. Real college credentials.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Launch Student Dashboard
            </button>
            <button
              onClick={() => onNavigate('/mentors')}
              className="px-6 py-3 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold rounded-xl border border-indigo-400/40 transition-colors cursor-pointer"
            >
              Browse Mentors
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
