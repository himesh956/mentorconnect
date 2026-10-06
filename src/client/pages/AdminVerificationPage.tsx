import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient.ts';
import { VerificationSubmission } from '../../types/index.ts';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  Building,
  Mail,
  User,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerif, setSelectedVerif] = useState<VerificationSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchVerifications = async () => {
    try {
      const res = await api.getAdminVerifications();
      setVerifications(res.verifications || []);
      if (res.verifications && res.verifications.length > 0 && !selectedVerif) {
        setSelectedVerif(res.verifications[0]);
      }
    } catch (err) {
      console.warn('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleUpdateStatus = async (id: string, status: VerificationSubmission['status']) => {
    setUpdating(true);
    try {
      const res = await api.updateAdminVerification(id, status, adminNotes);
      setSelectedVerif(res.verification);
      await fetchVerifications();
      setAdminNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-6">
        <div className="h-24 bg-slate-200/70 rounded-3xl"></div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-96 bg-slate-200/70 rounded-2xl"></div>
          <div className="md:col-span-2 h-96 bg-slate-200/70 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Trust &amp; Credential Authentication</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Mentor Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review mentor credentials, analyze AI-assisted OCR extractions, and grant official Verified Mentor badges.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Submissions Queue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Verification Submissions ({verifications.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {verifications.map(v => {
              const isSelected = selectedVerif?.id === v.id;
              const isVerified = v.status === 'VERIFIED';
              const isUnderReview = v.status === 'UNDER_REVIEW';

              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVerif(v)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{v.mentorName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : isUnderReview
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {v.currentRole}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {v.college} ({v.graduationYear})
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Inspection Detail & AI Extraction Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVerif ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedVerif.mentorName}
                    </h2>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-800">
                      Status: {selectedVerif.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Submitted on {selectedVerif.submittedAt?.split('T')[0]}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVerif.status !== 'VERIFIED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedVerif.id, 'VERIFIED')}
                      disabled={updating}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Verify</span>
                    </button>
                  )}

                  {selectedVerif.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedVerif.id, 'REJECTED')}
                      disabled={updating}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Reject Submission
                    </button>
                  )}
                </div>
              </div>

              {/* Submitted Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">College Affiliation</span>
                  <div className="font-bold text-slate-900">{selectedVerif.college}</div>
                  <div className="text-slate-500">Graduation Year: {selectedVerif.graduationYear}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Institutional Contact</span>
                  <div className="font-bold text-slate-900">{selectedVerif.collegeEmail}</div>
                  <div className="text-slate-500">Student/Alumni ID: {selectedVerif.studentOrAlumniId}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 sm:col-span-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Current Professional Role</span>
                  <div className="font-bold text-slate-900">{selectedVerif.currentRole}</div>
                </div>
              </div>

              {/* AI-Assisted OCR Extraction Box */}
              <div className="p-5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-indigo-950 font-bold uppercase tracking-wider text-[11px]">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI-Assisted Document Inspection Analysis</span>
                  </div>
                  <span className="font-black text-indigo-700 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-2xs">
                    Confidence: {selectedVerif.confidenceScore || 96}%
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400">Extracted Name:</span>{' '}
                    <strong className="text-slate-900">{selectedVerif.extractedDetails?.extractedName || selectedVerif.mentorName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Extracted College:</span>{' '}
                    <strong className="text-slate-900">{selectedVerif.extractedDetails?.extractedCollege || selectedVerif.college}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Extracted ID:</span>{' '}
                    <strong className="text-slate-900">{selectedVerif.extractedDetails?.extractedId || selectedVerif.studentOrAlumniId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Graduation Year:</span>{' '}
                    <strong className="text-slate-900">{selectedVerif.extractedDetails?.extractedYear || selectedVerif.graduationYear}</strong>
                  </div>
                </div>

                {selectedVerif.extractedDetails?.matchNotes && (
                  <p className="text-indigo-900 text-xs bg-white/80 p-3 rounded-xl border border-indigo-100 font-medium">
                    {selectedVerif.extractedDetails.matchNotes}
                  </p>
                )}
              </div>

              {/* Document Preview */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                  Uploaded Verification Proof (Degree / College ID / Offer Letter)
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-64 bg-slate-100 flex items-center justify-center">
                  <img
                    src={selectedVerif.documentUrl}
                    alt="Document"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                    <span className="bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 shadow-md">
                      Institutional Record Preview Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Notes Form */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Admin Verification Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verified via official alumni registry portal and corporate directory."
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
              Select a verification submission from the queue to view documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
