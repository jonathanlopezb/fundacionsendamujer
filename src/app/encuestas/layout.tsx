import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

export default function EncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#12051c] text-white">
      <header className="sticky top-0 z-30 border-b border-purple-800/50 bg-[#12051c]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <Link href="/encuestas" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 shadow-lg">
              <ClipboardList className="h-5 w-5 text-amber-200" />
            </span>
            <span><strong className="block text-sm tracking-wide">ENCUESTAS</strong><span className="text-[10px] font-bold tracking-widest text-pink-300">FUNDACIÓN SENDA MUJER</span></span>
          </Link>
          <span className="rounded-full border border-purple-700 bg-purple-950/60 px-3 py-1 text-[10px] font-bold tracking-wider text-purple-200">MÓDULO DE CAMPO</span>
        </div>
      </header>
      {children}
    </div>
  );
}
