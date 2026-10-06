import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { api } from '../api/apiClient.ts';

interface RatingModalProps {
  bookingId: string;
  mentorId: string;
  mentorName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  bookingId,
  mentorId,
  mentorName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide feedback on your session experience.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.addReview({
        bookingId,
        mentorId,
        rating,
        comment: comment.trim()
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rate Mentorship Session
            </h3>
            <p className="text-xs text-slate-500">
              with {mentorName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Star selector */}
          <div className="text-center py-2">
            <span className="block text-xs font-semibold text-slate-600 mb-2">
              Overall Experience & Quality of Guidance
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="block mt-1 text-xs font-bold text-amber-600">
              {rating} of 5 Stars
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Review & Testimonial
            </label>
            <textarea
              rows={3}
              required
              placeholder="How did this session help your preparation? What key insights did your mentor provide?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Verified Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
