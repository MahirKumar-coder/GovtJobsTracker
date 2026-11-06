import React from 'react';
import { RotateCcw } from 'lucide-react';
import { JobFilter } from '../types/job';

interface FilterBarProps {
  filters: JobFilter;
  onChange: (updated: Partial<JobFilter>) => void;
  onReset: () => void;
}

const QUALIFICATIONS = ['All', '10th', '12th', 'Graduate', 'Diploma'];
const CATEGORIES = ['All', 'SSC', 'Railway', 'Banking', 'Police', 'Teaching', 'Defence'];
const STATES = ['All India', 'Bihar', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Delhi'];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange, onReset }) => {
  const hasActiveFilters =
    filters.qualification !== 'All' ||
    filters.category !== 'All' ||
    filters.state !== 'All India' ||
    filters.closingSoonOnly ||
    filters.search !== '';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-3 transition-colors text-xs">
      {/* Category Sector Pills Row - Smooth swipe on mobile */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 flex-nowrap shrink">
          <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 mr-0.5 hidden md:inline shrink-0">
            Sector:
          </span>
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onChange({ category: cat })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  active
                    ? 'bg-primary-theme shadow-xs font-semibold'
                    : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium shrink-0 ml-auto"
            title="Reset active filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Sub row: Qualification segments, Location, and Closing soon */}
      <div className="pt-2 border-t border-neutral-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Qualification Segment Control */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none max-w-full">
          <span className="text-[10px] font-mono uppercase text-neutral-400 dark:text-zinc-500 mr-1 hidden sm:inline shrink-0">
            Eligibility:
          </span>
          <div className="inline-flex rounded-lg bg-neutral-100 dark:bg-zinc-800/80 p-0.5 border border-neutral-200 dark:border-zinc-700/60 shrink-0">
            {QUALIFICATIONS.map((q) => {
              const active = filters.qualification === q;
              return (
                <button
                  key={q}
                  onClick={() => onChange({ qualification: q })}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] transition-all ${
                    active
                      ? 'bg-primary-theme shadow-2xs font-semibold'
                      : 'text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {q}
                </button>
              );
            })}
          </div>
        </div>

        {/* State Selector & Closing Soon */}
        <div className="flex items-center space-x-2 ml-auto sm:ml-0">
          <select
            value={filters.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="text-[11px] font-medium bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 text-neutral-700 dark:text-zinc-300 rounded-lg px-2 sm:px-2.5 py-1 focus:outline-none focus:ring-1 ring-primary-theme"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => onChange({ closingSoonOnly: !filters.closingSoonOnly })}
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
              filters.closingSoonOnly
                ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-zinc-400 border-neutral-200 dark:border-zinc-700 hover:text-neutral-900 dark:hover:text-zinc-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${filters.closingSoonOnly ? 'bg-amber-600 animate-pulse' : 'bg-neutral-400'}`} />
            <span>&le; 7 Days</span>
          </button>
        </div>
      </div>
    </div>
  );
};
