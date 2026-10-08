'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CrmTheme = 'dark' | 'light';

interface CrmThemeContextType {
  theme: CrmTheme;
  toggleTheme: () => void;
  setTheme: (t: CrmTheme) => void;
}

const CrmThemeContext = createContext<CrmThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function CrmThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<CrmTheme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('senda_crm_theme') as CrmTheme;
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
      }
    } catch {
      // Ignore localStorage errors in restricted environments
    }
    setMounted(true);
  }, []);

  const setTheme = (t: CrmTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem('senda_crm_theme', t);
    } catch {
      // silent
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <CrmThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div
        id="crm-root"
        className={
          theme === 'light'
            ? 'crm-light min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200'
            : 'crm-dark min-h-screen bg-[#0d1117] text-slate-100 transition-colors duration-200'
        }
      >
        {children}
      </div>
    </CrmThemeContext.Provider>
  );
}

export function useCrmTheme() {
  return useContext(CrmThemeContext);
}
