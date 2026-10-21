import React from 'react';
import { DietaryType } from '../../types';

interface DietaryBadgeProps {
  type: DietaryType;
  showLabel?: boolean;
  className?: string;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, showLabel = false, className = '' }) => {
  if (type === 'veg') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="w-4 h-4 rounded border-2 border-emerald-700 p-0.5 flex items-center justify-center bg-white shadow-xs" title="Vegetarian">
          <div className="w-2 h-2 rounded-full bg-emerald-700" />
        </div>
        {showLabel && <span className="text-xs font-semibold text-emerald-800 tracking-wide">VEG</span>}
      </div>
    );
  }

  if (type === 'non-veg') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="w-4 h-4 rounded border-2 border-red-700 p-0.5 flex items-center justify-center bg-white shadow-xs" title="Non-Vegetarian">
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-red-700" />
        </div>
        {showLabel && <span className="text-xs font-semibold text-red-800 tracking-wide">NON-VEG</span>}
      </div>
    );
  }

  if (type === 'vegan') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 ${className}`}>
        <span className="text-xs">🌱</span>
        <span className="text-[11px] font-semibold tracking-wide">VEGAN</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-amber-100/90 text-amber-800 border border-amber-300 ${className}`}>
      <span className="text-xs">🥚</span>
      <span className="text-[11px] font-semibold tracking-wide">CONTAINS EGG</span>
    </div>
  );
};
