import React, { useState, useEffect } from 'react';
import { MentorProfile, AvailabilitySlot } from '../../types/index.ts';
import { api } from '../api/apiClient.ts';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookSlotModalProps {
  mentor: MentorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookSlotModal: React.FC<BookSlotModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [topic, setTopic] = useState<string>('Placement Strategy & DSA Roadmapping');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any>(null);

  // Set default date to tomorrow in YYYY-MM-DD
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Fetch mentor availability slots
  useEffect(() => {
    if (isOpen && mentor.id) {
      api.getAvailability(mentor.id).then(res => {
        setSlots(res.slots || []);
        if (res.slots && res.slots.length > 0) {
          setSelectedSlot(res.slots[0]);
        }
      }).catch(err => {
        console.warn('Error loading availability slots:', err);
      });
    }
  }, [isOpen, mentor.id]);

  if (!isOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate || !topic.trim()) {
      setError('Please select a date, time slot, and discussion topic.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.createBooking({
        mentorId: mentor.id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        topic,
        notes
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }

      setSuccessBooking(res.booking);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to book slot. This slot may already be reserved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatarUrl}
              alt={mentor.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Book Mentorship Session
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                with {mentor.name} • {mentor.companyOrOrg}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successBooking ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Session Request Submitted!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your request for <strong>{successBooking.date}</strong> at <strong>{successBooking.startTime}</strong> has been sent to {mentor.name}.
            </p>
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">
              ✓ Anti-conflict slot lock acquired. Redirecting to sessions...
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Date selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Select Session Date</span>
              </label>
              <input
                type="date"
                required
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Time Slot selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Available Mentor Slots</span>
              </label>

              {slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                  {slots.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 text-xs rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <div className="font-semibold">{slot.dayOfWeek}</div>
                        <div className="text-[11px] text-slate-500">
                          {slot.startTime} - {slot.endTime} IST
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                  Mentor has not defined specific recurring slots. A default evening slot (6:00 PM - 7:00 PM) will be requested.
                </div>
              )}
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Primary Discussion Goal / Topic</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Resume critique, DSA tree patterns, or Off-campus referrals"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Questions / Context for Mentor (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share your GitHub, current LeetCode count, or specific problem you need guidance on..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Reserving Slot...' : 'Confirm Session Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
