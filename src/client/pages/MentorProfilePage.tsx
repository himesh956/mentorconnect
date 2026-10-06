import React, { useState, useEffect } from 'react';
import { MentorProfile, AvailabilitySlot, Review, MatchScoreResult } from '../../types/index.ts';
import { api } from '../api/apiClient.ts';
import { VerifiedBadge } from '../components/VerifiedBadge.tsx';
import { MatchScoreBadge } from '../components/MatchScoreBadge.tsx';
import { BookSlotModal } from '../components/BookSlotModal.tsx';
import {
  Briefcase,
  GraduationCap,
  Star,
  Calendar,
  Languages,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface MentorProfilePageProps {
  mentorId: string;
  onBack: () => void;
  onBookSuccess?: () => void;
  onOpenChat?: (mentorId: string) => void;
}

export const MentorProfilePage: React.FC<MentorProfilePageProps> = ({
  mentorId,
  onBack,
  onBookSuccess,
  onOpenChat
}) => {
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [match, setMatch] = useState<MatchScoreResult | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getMentorById(mentorId)
      .then(res => {
        setMentor(res.mentor);
        setAvailability(res.availability || []);
        setReviews(res.reviews || []);
      })
      .catch(err => {
        console.warn('Error loading mentor details:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch match score for this mentor
    api.getMentorMatches()
      .then(res => {
        const item = res.matches?.find(m => m.mentor.id === mentorId);
        if (item) setMatch(item.match);
      })
      .catch(err => {
        console.warn('Error fetching match score:', err);
      });
  }, [mentorId]);

  if (loading || !mentor) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-40 bg-slate-200/70 rounded-3xl"></div>
        <div className="h-64 bg-slate-200/70 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Mentor Discovery</span>
      </button>

      {/* Mentor Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={mentor.avatarUrl}
              alt={mentor.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {mentor.name}
                </h1>
                {mentor.verificationStatus === 'VERIFIED' && <VerifiedBadge size="md" />}
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-semibold">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  {mentor.currentRole} at <strong className="text-slate-900 font-bold">{mentor.companyOrOrg}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-normal">{mentor.experienceYears} Years Exp</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{mentor.degree} • {mentor.college} (Batch {mentor.graduationYear})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {match && <MatchScoreBadge match={match} size="lg" />}

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{mentor.rating.toFixed(2)} Rating</span>
              <span className="text-amber-800/60 font-normal">({mentor.reviewsCount} reviews)</span>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book 1-on-1 Session</span>
            </button>
          </div>
        </div>

        {/* Why this mentor highlight box */}
        <div className="p-4 bg-linear-to-r from-indigo-50/90 to-purple-50/70 border border-indigo-200/80 rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-950 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Why This Mentor Is Recommended For You</span>
          </div>
          <p className="text-indigo-900 leading-relaxed font-medium">
            {match && match.reasons && match.reasons.length > 0
              ? `Recommended because of direct career match: ${match.reasons.join('; ')}.`
              : `This mentor is recommended because their experience at ${mentor.companyOrOrg} and collegiate journey through ${mentor.college} directly maps to your goal.`}
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900">About Me</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {mentor.bio}
          </p>
        </div>

        {/* Skills & Expertise grid */}
        <div className="grid md:grid-cols-2 gap-6 pt-3 border-t border-slate-100">
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Technical Stack &amp; Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Mentorship Areas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.areasOfExpertise.map((area, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Languages & Availability preview */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-slate-400" />
            <span>Languages: <strong>{mentor.languages?.join(', ') || 'English, Hindi'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Availability: <strong>{mentor.availabilityDescription}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span><strong>{mentor.sessionsCompleted}</strong> Mentorship Calls Conducted</span>
          </div>
        </div>
      </div>

      {/* Reviews & Testimonials Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Student Reviews &amp; Feedback
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified evaluations submitted following completed 1-on-1 calls
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-slate-900">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{mentor.rating.toFixed(2)} / 5.0</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{rev.studentName}</span>
                    <span className="text-[11px] text-slate-500 ml-2">• {rev.studentCollege}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Verified Mentorship Session • {rev.createdAt.split('T')[0]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
            No reviews submitted yet for this mentor. Be the first to book a session and leave verified feedback!
          </div>
        )}
      </div>

      <BookSlotModal
        mentor={mentor}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => {
          setShowBookingModal(false);
          if (onBookSuccess) onBookSuccess();
        }}
      />
    </div>
  );
};
