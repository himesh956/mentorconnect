import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient.ts';
import {
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then(res => setStats(res.stats))
      .catch(err => console.warn('Error loading admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-28 bg-slate-200/70 rounded-3xl"></div>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="h-32 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-32 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-32 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-32 bg-slate-200/70 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Platform Administration &amp; Trust Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Administrator Analytics &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time monitoring of mentor verification pipelines, collegiate distribution, and live mentorship sessions across Indian universities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/verification')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Review Pending Verifications ({stats.pendingVerifications})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Students</span>
          <div className="text-2xl font-black text-slate-900">
            {stats.totalStudents}
          </div>
          <p className="text-xs text-indigo-600 font-semibold">
            Registered on platform
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Mentors</span>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-1.5">
            <span>{stats.verifiedMentors}</span>
            <span className="text-xs text-slate-400 font-normal">/ {stats.totalMentors} Total</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Academic credentials checked
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Sessions Completed</span>
          <div className="text-2xl font-black text-slate-900">
            {stats.sessionsCompleted}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Verified 1-on-1 consultations
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Verifications</span>
          <div className="text-2xl font-black text-amber-600">
            {stats.pendingVerifications}
          </div>
          <p className="text-xs text-amber-700 font-semibold">
            Ready for document review
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Verification Funnel */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Mentor Verification Trust Funnel
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Conversion from registration to institutional accreditation
              </p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.verificationFunnel?.map((stage: any, idx: number) => {
              const maxCount = stats.totalMentors || 15;
              const percent = Math.round((stage.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{stage.stage}</span>
                    <span className="text-slate-900">{stage.count} Mentors ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        idx === 3 ? 'bg-emerald-500' : idx === 2 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.max(10, percent)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Mentorship Domains */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Mentorship Domain Demand
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Distribution across student requests
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-3 pt-2">
            {stats.categoryDistribution?.map((cat: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.name}</span>
                  <span className="text-slate-900">{cat.value}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-600 transition-all"
                    style={{ width: `${cat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('/admin/verification')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs space-y-1"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
            Verification Queue
          </h4>
          <p className="text-xs text-slate-500">
            Approve mentor degrees, IDs, and college email submissions
          </p>
        </button>

        <button
          onClick={() => onNavigate('/admin/users')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs space-y-1"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-2">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">
            User Management
          </h4>
          <p className="text-xs text-slate-500">
            Inspect all student &amp; mentor profiles and manage permissions
          </p>
        </button>

        <button
          onClick={() => onNavigate('/mentors')}
          className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 text-left transition-all group cursor-pointer shadow-2xs space-y-1"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
            Explore All Mentors
          </h4>
          <p className="text-xs text-slate-500">
            Browse directory of all active and prospective mentors
          </p>
        </button>
      </div>
    </div>
  );
};
