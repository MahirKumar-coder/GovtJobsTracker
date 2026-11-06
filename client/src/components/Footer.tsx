import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { subscribeEmailApi } from '../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribeEmailApi(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-neutral-200 dark:border-zinc-800/80 mt-16 transition-colors">
      {/* Newsletter Digest Strip */}
      <div id="newsletter-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-b border-neutral-200 dark:border-zinc-800/80">
        <div className="bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-5 sm:p-7 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center space-x-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Weekly Gazette Bulletin</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-zinc-100">
              Get verified employment circulars delivered weekly
            </h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1 leading-relaxed">
              No coaching spam or affiliate noise. Direct official circulars and upcoming application deadlines.
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Subscribed successfully. You will receive the next bulletin.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 ring-primary-theme w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-theme hover-bg-primary-theme font-semibold text-xs rounded-xl transition-all shrink-0 shadow-2xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Directory Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs">
          {/* Brand Info */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-primary-theme flex items-center justify-center font-bold text-xs">
                GJ
              </div>
              <span className="font-bold text-sm text-neutral-900 dark:text-zinc-100">
                GovJobs Tracker
              </span>
            </div>
            <p className="text-neutral-500 dark:text-zinc-400 leading-relaxed text-[11px]">
              Independent public employment notification tracker. Direct official circulars, exam dates, and application links.
            </p>
          </div>

          {/* Key Recruitment Boards */}
          <div>
            <h4 className="font-mono text-[10px] sm:text-[11px] font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Major Boards
            </h4>
            <ul className="space-y-1.5 text-neutral-500 dark:text-zinc-400 text-[11px]">
              <li>Staff Selection Commission</li>
              <li>Railway Recruitment Boards</li>
              <li>Banking Personnel (IBPS)</li>
              <li>UPSC Civil Services</li>
              <li>State Police & Paramilitary</li>
            </ul>
          </div>

          {/* By Qualification */}
          <div>
            <h4 className="font-mono text-[10px] sm:text-[11px] font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Eligibility
            </h4>
            <ul className="space-y-1.5 text-neutral-500 dark:text-zinc-400 text-[11px]">
              <li>10th Matriculation</li>
              <li>12th Intermediate</li>
              <li>Graduate Level</li>
              <li>Technical Diploma</li>
              <li>Armed Forces Agniveer</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-mono text-[10px] sm:text-[11px] font-bold text-neutral-900 dark:text-zinc-200 uppercase tracking-wider mb-2">
              Disclaimer
            </h4>
            <p className="text-neutral-500 dark:text-zinc-400 leading-relaxed text-[10px] sm:text-[11px]">
              GovJobs Tracker is an informational aggregator. Always verify notices from the official Gazette or respective official website before applying.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 dark:text-zinc-500">
          <p>© 2026 GovJobs Tracker. Maintained by Mahir Kumar.</p>
          <p className="mt-1 sm:mt-0 font-mono">React 18 • TypeScript • Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
};
