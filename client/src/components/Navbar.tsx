import React from 'react';
import { Bookmark, Plus, Bell } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenAdmin: () => void;
  isSavedActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSaved,
  onOpenAdmin,
  isSavedActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary-theme flex items-center justify-center font-bold text-xs sm:text-sm tracking-tight shadow-xs shrink-0">
              GJ
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-zinc-100">
                GovJobs<span className="font-normal text-neutral-500 dark:text-zinc-400">Tracker</span>
              </span>
              <span className="hidden xs:inline-block text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-zinc-800/80 text-neutral-600 dark:text-zinc-400 font-semibold border border-neutral-200 dark:border-zinc-700">
                Gazette
              </span>
            </div>
          </div>

          {/* Quick Nav Tools */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Bookmarked Jobs Toggle */}
            <button
              onClick={onOpenSaved}
              className={`inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isSavedActive
                  ? 'bg-primary-theme border-primary-theme shadow-2xs'
                  : 'bg-white dark:bg-zinc-900 text-neutral-700 dark:text-zinc-300 border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800/60'
              }`}
              title="View Bookmarked Jobs"
              aria-label="Bookmarked jobs"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSavedActive ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-none ${
                  isSavedActive
                    ? 'bg-white/25 text-inherit'
                    : 'bg-subtle-theme text-primary-theme font-mono'
                }`}>
                  {savedCount}
                </span>
              )}
            </button>

            {/* Newsletter scroll trigger */}
            <button
              onClick={() => {
                const el = document.getElementById('newsletter-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-neutral-400" />
              <span>Alerts</span>
            </button>

            {/* Theme & Palette Selector */}
            <ThemeSelector />

            {/* Post Job / Admin */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-colors shadow-2xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Job</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
