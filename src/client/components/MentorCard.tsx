import React, { useState } from 'react';
import { MentorProfile, MatchScoreResult } from '../../types/index.ts';
import { VerifiedBadge } from './VerifiedBadge.tsx';
import { MatchScoreBadge } from './MatchScoreBadge.tsx';
import { BookSlotModal } from './BookSlotModal.tsx';
import {
  Star,
  Briefcase,
  GraduationCap,
  Calendar,
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface MentorCardProps {
  mentor: MentorProfile;
  match?: MatchScoreResult | null;
  onViewProfile: (id: string) => void;
  onBookSuccess?: () => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  match,
  onViewProfile,
  onBookSuccess
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          {/* Card Top: Avatar, Role, Match score */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={mentor.avatarUrl}
                alt={mentor.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shrink-0"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {mentor.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {mentor.currentRole} • <strong className="text-slate-800">{mentor.companyOrOrg}</strong>
                  </span>
                </div>
              </div>
            </div>

            {match ? (
              <MatchScoreBadge match={match} size="sm" />
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{mentor.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Badges: Verification & College */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {mentor.verificationStatus === 'VERIFIED' && (
              <VerifiedBadge size="sm" />
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <GraduationCap className="w-3 h-3 text-slate-500" />
              <span>{mentor.college}</span>
            </span>
          </div>

          {/* Bio snippet */}
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {mentor.bio}
          </p>

          {/* Skills chips */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {mentor.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {mentor.skills.length > 4 && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md text-slate-400 bg-slate-50">
                +{mentor.skills.length - 4}
              </span>
            )}
          </div>

          {/* Top matched reason preview if available */}
          {match?.reasons && match.reasons.length > 0 && (
            <div className="mt-3 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100/60 text-[11px] text-indigo-900 flex items-start gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{match.reasons[0]}</span>
            </div>
          )}
        </div>

        {/* Card Bottom: Stats & Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span className="flex items-center gap-1 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <strong className="text-slate-800">{mentor.rating.toFixed(2)}</strong> ({mentor.reviewsCount} reviews)
            </span>
            <span className="font-medium text-slate-600">
              {mentor.sessionsCompleted} sessions completed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewProfile(mentor.id)}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer text-center"
            >
              View Profile
            </button>
            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Slot</span>
            </button>
          </div>
        </div>
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
    </>
  );
};
