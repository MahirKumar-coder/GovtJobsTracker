import React from 'react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-6 text-center">
      <div className="max-w-4xl mx-auto p-2 bg-neutral-100/60 dark:bg-zinc-900/60 rounded-xl border border-neutral-200/80 dark:border-zinc-800/80 overflow-hidden">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-1">
          Advertisement
        </div>
        {/* Ad network injected container */}
        <div id="container-2b5329280e5800adb5d6e628efe89386" className="min-h-[50px] flex items-center justify-center text-xs text-neutral-400 dark:text-zinc-500">
          {/* Ad script dynamically populates here */}
        </div>
      </div>
    </div>
  );
};
