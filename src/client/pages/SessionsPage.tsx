import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSocket } from '../context/SocketContext.tsx';
import { api } from '../api/apiClient.ts';
import { Booking } from '../../types/index.ts';
import { RatingModal } from '../components/RatingModal.tsx';
import {
  Calendar,
  Clock,
  Video,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SessionsPageProps {
  onOpenChat?: (mentorId: string) => void;
  onNavigateToMentors?: () => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({
  onOpenChat,
  onNavigateToMentors
}) => {
  const { user } = useAuth();
  const { startCall } = useSocket();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.getBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      console.warn('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Scheduled / Confirmed</span>;
      case 'REQUESTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">Awaiting Mentor Approval</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Session Completed</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-200">Declined</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-4">
        <div className="h-28 bg-slate-200/70 rounded-3xl"></div>
        <div className="h-44 bg-slate-200/70 rounded-2xl"></div>
        <div className="h-44 bg-slate-200/70 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Mentorship Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your scheduled 1-on-1 consultations and join live WebRTC video calls.
          </p>
        </div>

        {onNavigateToMentors && (
          <button
            onClick={onNavigateToMentors}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Book Another Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map(b => {
            const isConfirmed = b.status === 'ACCEPTED';
            const isCompleted = b.status === 'COMPLETED';

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4 hover:border-indigo-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">
                        {user?.role === 'student' ? b.mentorName : b.studentName}
                      </h3>
                      {getStatusBadge(b.status)}
                    </div>
                    <p className="text-xs font-semibold text-indigo-600">
                      Topic: {b.topic}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {user?.role === 'student' ? `${b.mentorRole} at ${b.mentorCompany}` : 'Student at Delhi University'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{b.date}</span>
                    <span className="text-slate-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{b.startTime} - {b.endTime} IST</span>
                  </div>
                </div>

                {b.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100 italic">
                    Discussion Agenda: "{b.notes}"
                  </p>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Session ID: {b.id}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Launch WebRTC Video Call */}
                    {isConfirmed && (
                      <button
                        onClick={() => startCall(b.meetingLink || `room_${b.id}`, user?.role === 'student' ? b.mentorName : b.studentName)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Launch 1-on-1 Call</span>
                      </button>
                    )}

                    {/* Review Button for completed calls */}
                    {isCompleted && user?.role === 'student' && (
                      <button
                        onClick={() => setReviewBooking(b)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Leave Verified Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No sessions scheduled yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book a 1-on-1 consultation with a verified mentor from top universities to receive personalized preparation guidance.
          </p>
          {onNavigateToMentors && (
            <button
              onClick={onNavigateToMentors}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Browse Mentors
            </button>
          )}
        </div>
      )}

      {/* Rating Review Modal */}
      {reviewBooking && (
        <RatingModal
          bookingId={reviewBooking.id}
          mentorId={reviewBooking.mentorId}
          mentorName={reviewBooking.mentorName}
          isOpen={true}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};
