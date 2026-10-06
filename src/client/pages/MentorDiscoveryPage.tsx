import React, { useState, useEffect } from 'react';
import { MentorProfile, MatchScoreResult } from '../../types/index.ts';
import { api } from '../api/apiClient.ts';
import { MentorCard } from '../components/MentorCard.tsx';
import {
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Check,
  ChevronDown
} from 'lucide-react';

interface MentorDiscoveryPageProps {
  onSelectMentor: (mentorId: string) => void;
  onBookSuccess?: () => void;
}

export const MentorDiscoveryPage: React.FC<MentorDiscoveryPageProps> = ({
  onSelectMentor,
  onBookSuccess
}) => {
  const [mentorsWithMatches, setMentorsWithMatches] = useState<{ mentor: MentorProfile; match: MatchScoreResult }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedCollege, setSelectedCollege] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'experience' | 'sessions'>('match');
  const [loading, setLoading] = useState(true);

  // Fetch mentor matches
  useEffect(() => {
    setLoading(true);
    api.getMentorMatches()
      .then(res => {
        setMentorsWithMatches(res.matches || []);
      })
      .catch(err => {
        console.warn('Error fetching mentor matches:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter and sort mentors
  const filteredMentors = mentorsWithMatches.filter(({ mentor }) => {
    if (verifiedOnly && mentor.verificationStatus !== 'VERIFIED') return false;

    if (selectedDomain !== 'ALL') {
      const d = selectedDomain.toLowerCase();
      const hasDomain = mentor.targetDomains.some(td => td.toLowerCase().includes(d)) ||
        mentor.mentorshipCategories.some(mc => mc.toLowerCase().includes(d));
      if (!hasDomain) return false;
    }

    if (selectedCollege !== 'ALL') {
      const c = selectedCollege.toLowerCase();
      if (!mentor.college.toLowerCase().includes(c)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (
        mentor.name + ' ' +
        mentor.college + ' ' +
        mentor.companyOrOrg + ' ' +
        mentor.currentRole + ' ' +
        mentor.skills.join(' ') + ' ' +
        mentor.bio
      ).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  // Sort
  filteredMentors.sort((a, b) => {
    if (sortBy === 'match') return b.match.score - a.match.score;
    if (sortBy === 'rating') return b.mentor.rating - a.mentor.rating;
    if (sortBy === 'experience') return b.mentor.experienceYears - a.mentor.experienceYears;
    if (sortBy === 'sessions') return b.mentor.sessionsCompleted - a.mentor.sessionsCompleted;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200/60">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Deterministic Career Compatibility Engine</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Discover Verified College Mentors
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Connect 1-on-1 with seniors and alumni from premier universities who have cracked your exact target companies, exams, and career transitions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by mentor name, company (Microsoft, Google), college (DU, DTU, IIT), or skills (DSA, React)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium placeholder-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Domain Dropdown */}
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Domains</option>
              <option value="software">Software Engineering</option>
              <option value="ai">AI / Data Science</option>
              <option value="placements">Placements &amp; DSA</option>
              <option value="consulting">Management / Consulting</option>
              <option value="gate">GATE &amp; Higher Studies</option>
            </select>

            {/* College Dropdown */}
            <select
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Colleges</option>
              <option value="delhi university">Delhi University (DU / MAC)</option>
              <option value="dtu">DTU Delhi</option>
              <option value="nsut">NSUT Delhi</option>
              <option value="iit">IITs</option>
              <option value="iiit">IIITs</option>
              <option value="bits">BITS Pilani</option>
              <option value="nit">NIT Trichy</option>
            </select>

            {/* Verified Only Checkbox */}
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Verified Only</span>
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="match">Best Match (%)</option>
              <option value="rating">Highest Rating</option>
              <option value="experience">Experience</option>
              <option value="sessions">Sessions Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Mentors */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-200/70 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(({ mentor, match }) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              match={match}
              onViewProfile={onSelectMentor}
              onBookSuccess={onBookSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
            ?
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching mentors found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or filters to view all available verified mentors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('ALL');
              setSelectedCollege('ALL');
              setVerifiedOnly(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
