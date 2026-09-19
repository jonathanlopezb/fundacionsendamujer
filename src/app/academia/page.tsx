'use client';
import React, { useState, useEffect } from 'react';
import AcademiaNavbar from '@/components/academia/AcademiaNavbar';
import LiveClassBanner from '@/components/academia/LiveClassBanner';
import CharlaDelDia from '@/components/CharlaDelDia';
import CourseCatalog from '@/components/academia/CourseCatalog';
import AuthModal from '@/components/academia/AuthModal';
import AcademiaFooter from '@/components/academia/AcademiaFooter';
import AcademiaDashboard from '@/components/academia/AcademiaDashboard';
import { ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, Check, HeartHandshake, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

export default function AcademiaPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('senda_academia_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (name: string, email: string) => {
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('senda_academia_user', JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('senda_academia_user');
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: '#0a0a0f', color: '#f0f0f5' }}>
      <AcademiaNavbar user={user} onOpenAuth={openAuth} onLogout={handleLogout} />
      <AcademiaHero user={user} onOpenAuth={() => openAuth('register')} />
      {user && <AcademiaDashboard user={user} onBrowse={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} />}
      <LiveClassBanner onOpenAuth={() => openAuth('register')} user={user} />
      <CharlaDelDia />
      <CourseCatalog user={user} onOpenAuth={() => openAuth('login')} />
      <AcademiaFooter />
      {authModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </div>
  );
}

function AcademiaHero({ user, onOpenAuth }: { user: { name: string; email: string } | null; onOpenAuth: () => void }) {
  return (
    <section className="relative isolate border-b border-white/10 bg-[#120319]">
      <div className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-violet-700/20 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-white/[.06] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-fuchsia-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Formación que se convierte en oportunidades
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">
            Aprende. Conecta.<br /><span className="bg-gradient-to-r from-fuchsia-300 via-pink-400 to-amber-300 bg-clip-text text-transparent">Avanza a tu ritmo.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-fuchsia-100/75 sm:text-lg">
            SendaAcademia es el campus gratuito de la Fundación Senda Mujer: cursos prácticos, acompañamiento humano y certificaciones para fortalecer tu autonomía.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => user ? document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }) : onOpenAuth()} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_35px_rgba(225,40,128,.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(225,40,128,.42)]">
              {user ? 'Explorar mis cursos' : 'Crear mi cuenta gratis'} <ArrowRight className="h-4 w-4" />
            </button>
            <Link href="#catalogo" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[.1]">
              Ver rutas formativas <BookOpen className="h-4 w-4 text-amber-300" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fuchsia-100/60">
            {['100% gratuita', 'A tu ritmo', 'Certificación Senda'].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> {item}</span>)}
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[2rem] border border-white/15 bg-white/[.07] p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-fuchsia-300/15 bg-gradient-to-br from-[#3c0b54] via-[#24102f] to-[#120319] p-6 sm:p-8">
              <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.16em] text-fuchsia-200/70">Tu tablero de progreso</span><BadgeCheck className="h-5 w-5 text-amber-300" /></div>
              <div className="mt-8 flex items-end justify-between"><div><p className="text-5xl font-black text-white">02</p><p className="mt-1 text-xs text-fuchsia-100/60">cursos disponibles para empezar</p></div><div className="rounded-2xl bg-emerald-400/10 px-3 py-2 text-right"><p className="text-lg font-black text-emerald-300">+24%</p><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60">avance promedio</p></div></div>
              <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-pink-500 to-amber-300" /></div>
              <div className="mt-7 grid grid-cols-3 gap-3"><MiniMetric icon={<BookOpen />} value="05" label="rutas" /><MiniMetric icon={<Users />} value="420+" label="aprendices" /><MiniMetric icon={<BriefcaseBusiness />} value="100%" label="práctico" /></div>
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"><div className="flex -space-x-2">{['M','A','C'].map((letter, i) => <span key={letter} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2b1239] text-xs font-black text-white ${i === 0 ? 'bg-pink-500' : i === 1 ? 'bg-violet-500' : 'bg-amber-500'}`}>{letter}</span>)}</div><p className="text-xs leading-5 text-fuchsia-100/70"><strong className="text-white">Tu comunidad ya está aprendiendo.</strong><br />Conecta con mujeres de Cartagena y Bolívar.</p></div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-amber-300/25 bg-[#281033] px-4 py-3 shadow-xl sm:block"><div className="flex items-center gap-2 text-xs font-bold text-white"><HeartHandshake className="h-4 w-4 text-amber-300" /> Acompañamiento real</div></div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 border-t border-white/10 px-4 sm:grid-cols-4 sm:px-8"><TrustStat value="05" label="rutas de aprendizaje" /><TrustStat value="24+" label="lecciones prácticas" /><TrustStat value="4.9/5" label="satisfacción" /><TrustStat value="0$" label="costo para ti" /></div>
    </section>
  );
}

function MiniMetric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3"><div className="mb-2 text-fuchsia-300">{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}</div><p className="text-base font-black text-white">{value}</p><p className="text-[10px] text-fuchsia-100/55">{label}</p></div>; }
function TrustStat({ value, label }: { value: string; label: string }) { return <div className="border-r border-white/10 px-3 py-5 last:border-0 sm:px-6"><p className="text-xl font-black text-white sm:text-2xl">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-fuchsia-100/50 sm:text-[11px]">{label}</p></div>; }
