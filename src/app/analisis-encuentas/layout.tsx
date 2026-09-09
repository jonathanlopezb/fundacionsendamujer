import Link from 'next/link';
import { ClipboardList, BarChart3, ArrowLeft, ShieldCheck, Download } from 'lucide-react';

export default function AnalisisEncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07010f] text-white flex flex-col font-sans selection:bg-[#E12880] selection:text-white">
      {/* Header Analítico Superior */}
      <header className="sticky top-0 z-40 border-b border-purple-800/40 bg-[#0f021c]/95 backdrop-blur px-4 sm:px-8 py-3.5 flex items-center justify-between">
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
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-pink-500 to-purple-700 shadow-md">
              <BarChart3 className="h-4 w-4 text-slate-950" />
            </span>
            <div>
              <h1 className="text-sm font-black tracking-wide text-white flex items-center gap-2">
                SISTEMA INTEGRAL DE INTELIGENCIA COMUNITARIA & CENSO
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  BI EN VIVO
                </span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider text-pink-300">
                FUNDACIÓN SENDA MUJER · OBSERVATORIO SOCIAL & EPIDEMIOLÓGICO TERRITORIAL
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Habeas Data Ley 1581</span>
          </div>

          <Link
            href="/encuestas/arroz-barato"
            className="flex items-center gap-1.5 text-xs font-black bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-3.5 py-1.5 rounded-xl shadow-md transition-all"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Nueva Ficha</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#0b0217] via-[#120324] to-[#07010f]">
        {children}
      </main>
    </div>
  );
}
