import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { api } from '../api/apiClient.ts';
import { Booking, AvailabilitySlot, MentorProfile } from '../../types/index.ts';
import { VerifiedBadge } from '../components/VerifiedBadge.tsx';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Plus,
  Trash2,
  Users,
  Star,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface MentorDashboardProps {
  onNavigate: (path: string) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { startCall } = useSocket();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [newDay, setNewDay] = useState<AvailabilitySlot['dayOfWeek']>('Saturday');
  const [newStart, setNewStart] = useState('18:00');
  const [newEnd, setNewEnd] = useState('19:00');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const me = await api.getMe();
      if (me.profile && 'verificationStatus' in me.profile) {
        setProfile(me.profile as MentorProfile);
        const bRes = await api.getBookings();
        setBookings(bRes.bookings || []);
        const aRes = await api.getAvailability(me.profile.id);
        setAvailability(aRes.slots || []);
      }
    } catch (err) {
      console.warn('Error loading mentor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await api.updateBookingStatus(id, status);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking');
    }
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addAvailability({
        dayOfWeek: newDay,
        startTime: newStart,
        endTime: newEnd
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add slot');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await api.deleteAvailability(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete slot');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200/70 rounded-3xl"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-64 bg-slate-200/70 rounded-2xl"></div>
          <div className="h-64 bg-slate-200/70 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'REQUESTED');
  const confirmedBookings = bookings.filter(b => b.status === 'ACCEPTED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Mentor Welcome Banner */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
                Mentor Command Center
              </span>
              {profile?.verificationStatus === 'VERIFIED' ? (
                <VerifiedBadge size="sm" />
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                  Verification Status: {profile?.verificationStatus || 'PENDING'}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              {profile?.currentRole} at <strong className="text-white">{profile?.companyOrOrg}</strong> • Alumnus of {profile?.college}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{profile?.rating.toFixed(2) || '4.95'}</span>
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">Average Rating</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center px-2">
              <div className="text-2xl font-black text-white">
                {profile?.sessionsCompleted || 42}
              </div>
              <div className="text-[11px] text-emerald-200 font-medium">Calls Conducted</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Requests</span>
          <div className="text-2xl font-black text-slate-900">
            {pendingBookings.length}
          </div>
          <p className="text-xs text-indigo-600 font-semibold">
            {pendingBookings.length > 0 ? 'Requires immediate confirmation' : 'All caught up'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Confirmed Upcoming</span>
          <div className="text-2xl font-black text-emerald-600">
            {confirmedBookings.length}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Scheduled 1-on-1 mentorship calls
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Availability Slots</span>
          <div className="text-2xl font-black text-slate-900">
            {availability.length} Active Slots
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Recurring weekly slots
          </p>
        </div>
      </div>

      {/* Main Grid: Pending Requests & Upcoming Sessions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Requests Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">
              Pending Mentorship Requests ({pendingBookings.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Real-time requests</span>
          </div>

          {pendingBookings.length > 0 ? (
            <div className="space-y-3">
              {pendingBookings.map(b => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{b.studentName}</h4>
                      <p className="text-xs font-semibold text-indigo-600">{b.topic}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{b.date} • {b.startTime} - {b.endTime} IST</span>
                      </div>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                      "{b.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'ACCEPTED')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No pending booking requests. Students will appear here when they reserve slots!
            </div>
          )}
        </div>

        {/* Confirmed / Upcoming Sessions Column */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">
              Scheduled Mentorship Sessions ({confirmedBookings.length})
            </h3>
            <span className="text-xs text-emerald-600 font-bold">Ready to launch</span>
          </div>

          {confirmedBookings.length > 0 ? (
            <div className="space-y-3">
              {confirmedBookings.map(b => (
                <div key={b.id} className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/60 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-slate-900">{b.studentName}</h4>
                    <p className="text-xs text-slate-700 font-medium">{b.topic}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{b.date} at {b.startTime} IST</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startCall(b.meetingLink || `room_${b.id}`, b.studentName)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Video Call</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No confirmed upcoming sessions scheduled today.
            </div>
          )}
        </div>
      </div>

      {/* Manage Availability Slots */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Manage Weekly Availability Slots
            </h3>
            <p className="text-xs text-slate-500">
              Define the recurring weekly slots students can reserve on your profile
            </p>
          </div>
        </div>

        {/* Existing Slots */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availability.map(slot => (
            <div key={slot.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800">{slot.dayOfWeek}</span>
                <p className="text-[11px] text-slate-500">{slot.startTime} - {slot.endTime} IST</p>
              </div>
              <button
                onClick={() => handleDeleteSlot(slot.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Remove Slot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Slot Form */}
        <form onSubmit={handleAddAvailability} className="pt-2 flex flex-wrap items-center gap-3">
          <select
            value={newDay}
            onChange={e => setNewDay(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>

          <input
            type="time"
            value={newStart}
            onChange={e => setNewStart(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
          />
          <span className="text-xs text-slate-400 font-bold">to</span>
          <input
            type="time"
            value={newEnd}
            onChange={e => setNewEnd(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        </form>
      </div>
    </div>
  );
};
