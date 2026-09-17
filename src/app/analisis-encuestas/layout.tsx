import Link from 'next/link';
import { ArrowLeft, ClipboardList, ShieldCheck } from 'lucide-react';
import SurveyAnalysisAccess from '@/components/encuestas/SurveyAnalysisAccess';

export default function AnalisisEncuestasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f8fc] font-sans text-[#20234a]">
      <header className="border-b border-[#e7e6f0] bg-white px-5 py-2.5 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <Link href="/encuestas" className="inline-flex items-center gap-2 text-xs font-bold text-[#625b71] transition-colors hover:text-[#5e429d]"><ArrowLeft className="h-3.5 w-3.5" />Volver a jornadas</Link>
          <div className="hidden items-center gap-2 text-xs text-[#77708c] sm:flex"><ShieldCheck className="h-4 w-4 text-[#5e429d]" />Datos agregados para análisis territorial</div>
          <div className="flex items-center gap-2"><SurveyAnalysisAccess /><Link href="/encuestas/arroz-barato" className="inline-flex items-center gap-2 rounded-lg bg-[#5e429d] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4d357f]"><ClipboardList className="h-3.5 w-3.5" />Nueva ficha</Link></div>
        </div>
      </header>
      {children}
    </div>
  );
}
