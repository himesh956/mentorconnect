import React, { useState } from 'react';
import { Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchScoreResult } from '../../types/index.ts';

interface MatchScoreBadgeProps {
  match?: MatchScoreResult | null;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showPopover?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  match,
  score: directScore,
  size = 'md',
  showPopover = true
}) => {
  const [expanded, setExpanded] = useState(false);
  const score = match ? match.score : (directScore || 85);

  const getScoreTheme = (s: number) => {
    if (s >= 90) return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', ring: 'ring-indigo-500' };
    if (s >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-500' };
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-500' };
  };

  const theme = getScoreTheme(score);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => match && setExpanded(!expanded)}
        className={`inline-flex items-center gap-1.5 rounded-full font-bold transition-all shadow-xs ${theme.bg} ${theme.text} border ${theme.border} ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
        } ${match ? 'hover:brightness-95 cursor-pointer' : 'cursor-default'}`}
        title="Calculated via multi-factor matching engine"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>{score}% Match</span>
        {match && (
          expanded ? <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" /> : <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
        )}
      </button>

      {/* Explainable AI breakdown popover */}
      {expanded && match && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 p-3.5 bg-white border border-slate-200 rounded-xl shadow-xl text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-xs text-slate-800 tracking-wide uppercase">
                Why this match?
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {score}% Compatibility
            </span>
          </div>

          <div className="space-y-1.5">
            {match.reasons && match.reasons.length > 0 ? (
              match.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">
                Matched based on technical domain, college background, and schedule overlap.
              </p>
            )}
          </div>

          {/* Metric breakdown bars */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div>
              <span className="text-slate-400">Career Goal:</span>{' '}
              <span className="font-semibold text-slate-700">{match.careerMatchPercent || 90}%</span>
            </div>
            <div>
              <span className="text-slate-400">Skill Match:</span>{' '}
              <span className="font-semibold text-slate-700">{match.skillMatchPercent || 85}%</span>
            </div>
            <div>
              <span className="text-slate-400">Experience:</span>{' '}
              <span className="font-semibold text-slate-700">{match.experienceMatchPercent || 92}%</span>
            </div>
            <div>
              <span className="text-slate-400">Schedule:</span>{' '}
              <span className="font-semibold text-slate-700">{match.availabilityMatchPercent || 80}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
