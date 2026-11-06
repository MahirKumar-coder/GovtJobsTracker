import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme, ACCENT_OPTIONS, AccentPreset } from '../context/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { mode, accent, setMode, setAccent, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentAccentObj = ACCENT_OPTIONS.find((a) => a.id === accent) || ACCENT_OPTIONS[0];

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0.5 shadow-2xs">
        {/* Toggle Light / Dark */}
        <button
          onClick={toggleMode}
          className="p-1.5 rounded-md text-neutral-600 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
          title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {mode === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-neutral-600" />
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-3.5 bg-neutral-200 dark:bg-zinc-800 mx-0.5" />

        {/* Palette Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md text-neutral-600 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-1"
          title="Change Color Theme"
          aria-label="Select accent color"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${currentAccentObj.bgClass} inline-block ring-1 ring-black/10 dark:ring-white/20`} />
          <Palette className="w-3 h-3 text-neutral-400 dark:text-zinc-500 hidden sm:inline" />
        </button>
      </div>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800 shadow-xl z-50 text-xs animate-in fade-in duration-150">
          {/* Appearance Mode */}
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-zinc-500 font-semibold block mb-1.5">
              Display Mode
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-zinc-800/80 rounded-xl">
              <button
                onClick={() => setMode('light')}
                className={`py-1.5 px-2 rounded-lg font-medium text-center flex items-center justify-center space-x-1.5 transition-all ${
                  mode === 'light'
                    ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setMode('dark')}
                className={`py-1.5 px-2 rounded-lg font-medium text-center flex items-center justify-center space-x-1.5 transition-all ${
                  mode === 'dark'
                    ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-zinc-500 font-semibold block mb-1.5">
              Color Accent
            </span>
            <div className="space-y-1">
              {ACCENT_OPTIONS.map((opt) => {
                const isSelected = accent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAccent(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full ${opt.bgClass} ring-1 ring-black/10 dark:ring-white/20`} />
                      <span className="text-xs">{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
