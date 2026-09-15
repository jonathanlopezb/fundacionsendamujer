import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-pink-100 selection:text-slate-900">
      {/* Barra superior limpia y minimalista exclusiva para el encuestador/a en campo */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-8 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Fundación Senda Mujer */}
            <Image
              src="/logo.png"
              alt="Fundación Senda Mujer"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-contain shadow-md"
            />
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
              <span>Confidencial</span>
            </span>
            <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-2.5 py-1 rounded-full">
              Cartagena D.T. y C.
            </span>
          </div>
        </div>

        {/* Barra de alianza institucional */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[9px] font-bold tracking-wider text-purple-300/60 uppercase">
          <span>Fundacion Mundo Mujer</span>
          <span>Fundación Senda Mujer</span>
          <span className="text-pink-500">×</span>
          <span>Junta de Acción Comunal</span>
        </div>
      </header>

      {/* Área del formulario a pantalla completa */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
