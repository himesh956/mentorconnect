import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/apiClient.ts';
import { MatchScoreBadge } from '../components/MatchScoreBadge.tsx';
import { VerifiedBadge } from '../components/VerifiedBadge.tsx';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Map,
  Compass,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Briefcase
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
  onSelectMentor: (mentorId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigate,
  onSelectMentor
}) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getStudentDashboard()
      .then(res => {
        setDashboardData(res.data);
      })
      .catch(err => {
        console.warn('Error loading dashboard data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-20 bg-slate-200/70 rounded-2xl w-full"></div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-28 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-28 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-28 bg-slate-200/70 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const d = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-700/60 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Smart Student Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {d.greeting || `Welcome, ${user?.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Target Career: <strong className="text-white">{d.careerGoal || 'Software Engineer'}</strong> • Target: Microsoft, Google, Razorpay
            </p>
          </div>

          {/* Career Readiness Ring / Score */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${d.careerReadinessScore || 64}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-extrabold text-base text-white">
                {d.careerReadinessScore || 64}%
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">Career Readiness</div>
              <div className="text-xs text-indigo-200">Calculated from completed tasks</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Career Insight & Next Step Bar */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">
              MentorAI Strategic Insight
            </h4>
            <p className="text-xs text-indigo-900 leading-relaxed max-w-2xl">
              {d.aiInsight}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/mentor-ai')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Ask MentorAI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Upcoming Session</span>
          <div className="text-base font-black text-slate-900">
            {d.upcomingSession ? `${d.upcomingSession.date}` : 'Tomorrow, 6:00 PM'}
          </div>
          <p className="text-xs text-indigo-600 font-semibold truncate">
            {d.upcomingSession ? `${d.upcomingSession.mentorName}` : 'Aditya Sharma (Microsoft)'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Roadmap Progress</span>
          <div className="text-base font-black text-slate-900">
            {d.roadmapSummary?.completed || 5} of {d.roadmapSummary?.total || 11} Tasks
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${d.roadmapSummary?.progressPercent || 64}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Action Items</span>
          <div className="text-base font-black text-slate-900">
            {d.pendingActionItemsCount || 4} Tasks Pending
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Assigned during mentor calls
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Top Mentor Match</span>
          <div className="text-base font-black text-emerald-600 flex items-center gap-1">
            <span>{d.topRecommendedMentor?.match?.score || 94}% Compatibility</span>
          </div>
          <p className="text-xs text-slate-600 font-medium truncate">
            {d.topRecommendedMentor?.mentor?.name || 'Aditya Sharma'}
          </p>
        </div>
      </div>

      {/* Main Split Section: Top Recommended Mentor + Next Action Item */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Recommended Mentor Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">
                AI &amp; Algorithm Matched Mentor For You
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/mentors')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View all matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {d.topRecommendedMentor ? (
            <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <img
                  src={d.topRecommendedMentor.mentor.avatarUrl}
                  alt={d.topRecommendedMentor.mentor.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base text-slate-900">
                      {d.topRecommendedMentor.mentor.name}
                    </h4>
                    <VerifiedBadge size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {d.topRecommendedMentor.mentor.currentRole} at <strong className="text-slate-900">{d.topRecommendedMentor.mentor.companyOrOrg}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Alumnus of {d.topRecommendedMentor.mentor.college}
                  </p>

                  {/* Reasons list */}
                  <div className="pt-2 space-y-1">
                    {d.topRecommendedMentor.match.reasons.map((r: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <MatchScoreBadge match={d.topRecommendedMentor.match} size="md" />
                <button
                  onClick={() => onSelectMentor(d.topRecommendedMentor.mentor.id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  View Profile &amp; Book
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No recommended mentors available.</p>
          )}
        </div>

        {/* Right 1 Col: Quick Links & Actions */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('/roadmap')}
              className="w-full p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-200 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700">
                    Track Career Roadmap
                  </h5>
                  <p className="text-[11px] text-slate-500">Update task milestones &amp; readiness</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/sessions')}
              className="w-full p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-200 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700">
                    My Mentorship Sessions
                  </h5>
                  <p className="text-[11px] text-slate-500">Join live WebRTC video calls</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('/messages')}
              className="w-full p-3 bg-slate-50 hover:bg-indigo-50/60 rounded-2xl border border-slate-200/80 hover:border-indigo-200 text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-purple-700">
                    Direct Mentor Messages
                  </h5>
                  <p className="text-[11px] text-slate-500">Real-time Socket.IO chat</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
