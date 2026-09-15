'use client';

import Image from 'next/image';
import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const foundationName = 'Fundaci\u00f3n Senda Mujer';
const communityBoard = 'Junta de Acci\u00f3n Comunal (JAC)';

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`survey-theme min-h-screen flex flex-col font-sans transition-colors ${darkMode ? 'dark bg-[#140320] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`sticky top-0 z-40 border-b px-4 py-3 backdrop-blur sm:px-8 ${darkMode ? 'border-purple-700 bg-[#1b0730]/95' : 'border-slate-200 bg-white/95'}`}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Image src="/logo.png" alt={foundationName} width={56} height={56} priority className="h-14 w-14 shrink-0 rounded-xl object-contain" />
            <div className="min-w-0">
              <span className={`block text-sm font-extrabold tracking-wide ${darkMode ? 'text-white' : 'text-slate-950'}`}>{foundationName}</span>
              <span className={`block text-xs font-medium ${darkMode ? 'text-purple-100' : 'text-slate-600'}`}>{'Diagn\u00f3stico comunitario'}</span>
            </div>
          </div>
          <button type="button" onClick={() => setDarkMode((value) => !value)} aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'} aria-pressed={darkMode} className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${darkMode ? 'border-purple-400 bg-purple-800 text-amber-200 hover:bg-purple-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'}`}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sm:hidden">{darkMode ? 'Claro' : 'Oscuro'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Modo claro' : 'Modo oscuro'}</span>
            <span className="sr-only">{darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}</span>
          </button>
        </div>
        <div className={`mx-auto mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-semibold ${darkMode ? 'text-purple-100' : 'text-slate-600'}`}>
          <span>{foundationName}</span>
          <span aria-hidden="true" className="text-pink-600">×</span>
          <span>{communityBoard}</span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
