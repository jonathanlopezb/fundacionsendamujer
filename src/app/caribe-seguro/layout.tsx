import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

const navigation = [
  { href: '/caribe-seguro/proteccion', label: 'Protección' },
  { href: '/caribe-seguro/prevencion', label: 'Prevención' },
  { href: '/caribe-seguro/red', label: 'Red' },
  { href: '/caribe-seguro/impacto', label: 'Impacto' },
  { href: '/caribe-seguro/cooperacion', label: 'Cooperación' },
];

export default function CaribeSeguroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#2d2528]">
      <header className="sticky top-0 z-40 border-b border-[#dfd5cc] bg-[#fffdf9]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-[min(1180px,calc(100%-32px))] items-center justify-between gap-5">
          <Link href="/caribe-seguro" className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#203c3d] text-[#f0d2a7]"><ShieldCheck className="h-5 w-5" /></span>
            <span className="min-w-0"><strong className="block truncate text-sm font-bold text-[#2d2528]">Fundación Senda Mujer</strong><span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6e3f58]">Caribe Seguro</span></span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Navegación Caribe Seguro">{navigation.map(item => <Link key={item.href} href={item.href} className="text-sm font-bold text-[#625750] transition-colors hover:text-[#e12880]">{item.label}</Link>)}</nav>
          <div className="flex shrink-0 items-center gap-3"><Link href="/" className="hidden text-sm font-bold text-[#625750] hover:text-[#e12880] sm:inline">Fundación</Link><Link href="/triaje-psicologico" className="inline-flex items-center gap-2 rounded-lg bg-[#e12880] px-3.5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c41070]">Necesito ayuda <ArrowUpRight className="h-4 w-4" /></Link></div>
        </div>
        <nav className="flex overflow-x-auto border-t border-[#efe6df] px-4 lg:hidden" aria-label="Navegación Caribe Seguro">{navigation.map(item => <Link key={item.href} href={item.href} className="shrink-0 px-4 py-3 text-xs font-bold text-[#625750] hover:text-[#e12880]">{item.label}</Link>)}</nav>
      </header>
      <main className="min-h-[calc(100vh-72px)] bg-[#12071b]">{children}</main>
      <footer className="bg-[#2d2528] py-10 text-[#eee5df]"><div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-5"><p className="text-sm">Caribe Seguro · Programa territorial de Fundación Senda Mujer.</p><a href="https://www.google.com/search?q=clima+cartagena" className="text-sm font-bold text-[#f0d2a7] hover:text-white">Salida rápida</a></div></footer>
    </div>
  );
}
