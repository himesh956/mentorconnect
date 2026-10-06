import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  college?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  college,
  size = 'md',
  showDetails = false
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <div className="inline-flex items-center">
      <span
        title={college ? `Verified Alumnus / Student of ${college}` : 'Verified Academic Credentials & Identity'}
        className={`inline-flex items-center font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full shadow-xs ${sizeClasses[size]}`}
      >
        <ShieldCheck className={`${iconSizes[size]} text-emerald-600 fill-emerald-100 shrink-0`} />
        <span className="font-semibold tracking-wide">VERIFIED MENTOR</span>
      </span>
      {showDetails && college && (
        <span className="ml-2 text-xs text-slate-500 font-medium">
          • {college}
        </span>
      )}
    </div>
  );
};
