import Link from 'next/link';
import { ClipboardList, BarChart3, ArrowLeft } from 'lucide-react';

export default function AnalisisEncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0115] text-white flex flex-col font-sans selection:bg-[#E12880] selection:text-white">
      {/* Header Analítico Superior */}
      <header className="sticky top-0 z-40 border-b border-purple-800/40 bg-[#120225]/95 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/encuestas"
            className="flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-white transition-colors bg-purple-900/40 hover:bg-purple-800/60 px-3 py-1.5 rounded-xl border border-purple-700/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Encuestas</span>
          </Link>
          <div className="h-5 w-px bg-purple-800/60 hidden sm:block" />
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-600 shadow-md">
              <BarChart3 className="h-4 w-4 text-slate-950" />
            </span>
            <div>
              <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
                DASHBOARD EPIDEMIOLÓGICO & CLÍNICO
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  LIVE DATA
                </span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider text-pink-300">
                FUNDACIÓN SENDA MUJER · CENSO DE SALUD & GINECOLOGÍA
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/encuestas/arroz-barato"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-xl transition-all"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Nueva Ficha</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#0e021e] via-[#16042a] to-[#0a0115]">
        {children}
      </main>
    </div>
  );
}
