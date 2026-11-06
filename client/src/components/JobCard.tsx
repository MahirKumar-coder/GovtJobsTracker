import React from 'react';
import { Bookmark, Bell, ArrowUpRight, Calendar, Users, GraduationCap } from 'lucide-react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (job: Job) => void;
  onOpenDetail: (job: Job) => void;
  onOpenReminder: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onOpenDetail,
  onOpenReminder,
}) => {
  const now = Date.now();
  const deadline = new Date(job.lastDate).getTime();
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isExpired = diffDays < 0;

  const formattedLastDate = new Date(job.lastDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200 dark:border-zinc-800/80 hover:border-neutral-300 dark:hover:border-zinc-700 transition-all p-4 sm:p-4.5 flex flex-col justify-between group shadow-2xs">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-subtle-theme text-primary-theme border border-subtle-theme">
              {job.category}
            </span>
            <span className="text-[11px] font-medium text-neutral-500 dark:text-zinc-400">
              • {job.state}
            </span>
            {job.isFeatured && (
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                Key Post
              </span>
            )}
          </div>

          <div className="flex items-center space-x-0.5">
            <button
              onClick={() => onOpenReminder(job)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              title="Set Deadline Reminder"
              aria-label="Set reminder"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleSave(job)}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? 'text-primary-theme bg-subtle-theme'
                  : 'text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save Notice'}
              aria-label="Bookmark notice"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Department Name */}
        <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-tight text-neutral-400 dark:text-zinc-500 mb-0.5 truncate">
          {job.department}
        </p>

        {/* Title */}
        <h3
          onClick={() => onOpenDetail(job)}
          className="text-sm sm:text-base font-bold text-neutral-900 dark:text-zinc-100 group-hover:text-primary-theme cursor-pointer line-clamp-2 leading-snug mb-3 transition-colors"
        >
          {job.title}
        </h3>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-2 sm:p-2.5 bg-neutral-50 dark:bg-zinc-800/50 rounded-lg border border-neutral-100 dark:border-zinc-800/80 text-xs mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 shrink-0" />
            <div className="truncate">
              <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-zinc-500 block uppercase font-mono">
                Posts
              </span>
              <span className="font-semibold text-neutral-900 dark:text-zinc-200 text-xs">
                {job.vacancies > 0 ? `${job.vacancies.toLocaleString('en-IN')} Vacancies` : 'Various'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <GraduationCap className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 shrink-0" />
            <div className="truncate">
              <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-zinc-500 block uppercase font-mono">
                Eligibility
              </span>
              <span className="font-semibold text-neutral-900 dark:text-zinc-200 truncate block text-xs">
                {job.qualification.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-xs text-neutral-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3.5">
          {job.shortDescription}
        </p>
      </div>

      {/* Footer / Deadline & Actions */}
      <div className="pt-2.5 border-t border-neutral-100 dark:border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-neutral-500 dark:text-zinc-400 text-[11px]">
            <Calendar className="w-3 h-3 text-neutral-400" />
            <span>
              Last Date: <strong className="text-neutral-800 dark:text-zinc-200 font-semibold">{formattedLastDate}</strong>
            </span>
          </div>

          {isExpired ? (
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold">
              Closed
            </span>
          ) : isClosingSoon ? (
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30">
              {diffDays === 0 ? 'Ends Today' : `${diffDays}d Left`}
            </span>
          ) : (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenDetail(job)}
            className="flex-1 py-1.5 px-2.5 rounded-lg border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 text-neutral-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-750 text-xs font-semibold transition-colors text-center"
          >
            Full Details
          </button>
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-3 rounded-lg bg-primary-theme hover-bg-primary-theme text-xs font-semibold inline-flex items-center space-x-1 transition-all shrink-0 shadow-2xs"
          >
            <span>Apply</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
