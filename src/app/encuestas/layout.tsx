import Link from 'next/link';
import { ClipboardList, ShieldCheck, MapPin } from 'lucide-react';

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0118] text-white flex flex-col font-sans selection:bg-[#E12880] selection:text-white">
      {/* Barra superior limpia y minimalista exclusiva para el encuestador/a en campo */}
      <header className="sticky top-0 z-30 border-b border-purple-900/50 bg-[#120225]/95 backdrop-blur px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 shadow-md">
            <ClipboardList className="h-4 w-4 text-amber-200" />
          </span>
          <div>
            <span className="block text-xs font-black tracking-wider text-white">
              CENSO CASA A CASA · FUNDACIÓN SENDA MUJER
            </span>
            <span className="text-[10px] font-bold text-pink-300">
              MODO ENCUESTADORA DE CAMPO · LEY 1581 DE 2012
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ficha Confidencial</span>
          </span>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-2.5 py-1 rounded-full">
            Cartagena D.T. y C.
          </span>
        </div>
      </header>

      {/* Área del formulario a pantalla completa */}
      <main className="flex-1 bg-gradient-to-b from-[#140320] via-[#1C052B] to-[#0F0218]">
        {children}
      </main>
    </div>
  );
}
