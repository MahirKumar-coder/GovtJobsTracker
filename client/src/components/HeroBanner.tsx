import React from 'react';
import { SummaryStats } from '../types/job';

interface HeroBannerProps {
  stats: SummaryStats;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ stats }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-6 sm:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
          {/* Main Titles */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-1.5 sm:mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-theme inline-block" />
              <span>Official Recruitment Gazette • India</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-zinc-100 tracking-tight leading-snug">
              Sarkari Naukri & Public Employment Notifications
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed max-w-xl">
              Consolidated official notices across Central & State departments. Check eligibility,
              dates, and official links with zero redirect spam.
            </p>
          </div>

          {/* Clean Metric Badges (Responsive 3-Column Strip) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
            <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-neutral-100/80 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-neutral-400 dark:text-zinc-500 block truncate">
                Active Notices
              </span>
              <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-zinc-100 font-mono">
                {stats.totalActiveJobs || 9}
              </span>
            </div>

            <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-neutral-100/80 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-neutral-400 dark:text-zinc-500 block truncate">
                Vacancies
              </span>
              <span className="text-base sm:text-lg font-bold text-primary-theme font-mono">
                {stats.totalOpenVacancies.toLocaleString('en-IN')}+
              </span>
            </div>

            <div className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 text-center sm:text-left">
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-amber-700 dark:text-amber-400 block truncate">
                Closing Soon
              </span>
              <span className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400 font-mono">
                {stats.closingSoonJobs || 3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
