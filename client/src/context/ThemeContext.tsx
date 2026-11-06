import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentPreset = 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'neutral';

interface ThemeContextType {
  mode: ThemeMode;
  accent: AccentPreset;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: AccentPreset) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_OPTIONS: { id: AccentPreset; label: string; bgClass: string; hex: string }[] = [
  { id: 'emerald', label: 'Gazette Green', bgClass: 'bg-emerald-500', hex: '#059669' },
  { id: 'blue', label: 'Classic Blue', bgClass: 'bg-blue-500', hex: '#2563eb' },
  { id: 'amber', label: 'Warm Ochre', bgClass: 'bg-amber-500', hex: '#d97706' },
  { id: 'violet', label: 'Iris Violet', bgClass: 'bg-violet-500', hex: '#7c3aed' },
  { id: 'rose', label: 'Ruby Rose', bgClass: 'bg-rose-500', hex: '#e11d48' },
  { id: 'neutral', label: 'Monochrome', bgClass: 'bg-zinc-800 dark:bg-zinc-200', hex: '#18181b' },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('govjobs_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [accent, setAccentState] = useState<AccentPreset>(() => {
    try {
      const saved = localStorage.getItem('govjobs_theme_accent');
      if (saved && ['emerald', 'blue', 'amber', 'violet', 'rose', 'neutral'].includes(saved)) {
        return saved as AccentPreset;
      }
      return 'emerald';
    } catch {
      return 'emerald';
    }
  });

  // Apply dark class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('govjobs_theme_mode', mode);
    } catch {}
  }, [mode]);

  // Apply data-accent to <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('govjobs_theme_accent', accent);
    } catch {}
  }, [accent]);

  const setMode = (m: ThemeMode) => setModeState(m);
  const setAccent = (a: AccentPreset) => setAccentState(a);
  const toggleMode = () => setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, accent, setMode, setAccent, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
