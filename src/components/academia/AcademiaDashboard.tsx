'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, CalendarDays, CheckCircle2, Clock3, Flame, Play, Sparkles, Target, Trophy, Video } from 'lucide-react';

interface Props { user: { name: string; email: string }; onBrowse: () => void; }

export default function AcademiaDashboard({ user, onBrowse }: Props) {
  return (
    <section className="border-b border-white/10 bg-[#0d101c] px-4 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-fuchsia-300">Mi Senda · Panel de aprendizaje</p><h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Hola, {user.name.split(' ')[0]} <span className="text-amber-300">✦</span></h2><p className="mt-2 text-sm text-slate-400">Tu progreso también es un acto de amor propio.</p></div>
          <button onClick={onBrowse} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10">Explorar más cursos <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <article className="rounded-3xl border border-fuchsia-300/15 bg-gradient-to-br from-[#30114a] via-[#1b1730] to-[#121421] p-5 shadow-xl sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-pink-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-200">Continúa aprendiendo</span><h3 className="mt-4 text-xl font-black text-white">Marketing Digital para Emprendedoras</h3><p className="mt-1 text-xs text-slate-400">Módulo 2 · Estrategia de contenido</p></div><div className="rounded-2xl bg-amber-300/10 p-3 text-amber-300"><Play className="h-5 w-5 fill-current" /></div></div>
            <div className="mt-7 flex items-center justify-between text-xs font-bold text-slate-300"><span>Tu progreso</span><span className="text-amber-300">72%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-pink-500 to-amber-300" /></div><button onClick={onBrowse} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-[#32104b] transition hover:bg-fuchsia-100">Continuar clase <ArrowRight className="h-4 w-4" /></button>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[.04] p-5 sm:p-7"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tu ruta</p><Target className="h-5 w-5 text-fuchsia-300" /></div><h3 className="mt-3 text-lg font-black text-white">Autonomía Económica</h3><div className="mt-5 space-y-3">{[['Introducción', true], ['Finanzas personales', true], ['Costos y precios', false], ['Marketing digital', false], ['Proyecto final', false]].map(([label, done]) => <div key={label as string} className="flex items-center gap-3 text-xs"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-emerald-400/20 text-emerald-300' : 'border border-white/20 text-slate-500'}`}>{done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}</span><span className={done ? 'text-slate-200' : 'text-slate-500'}>{label}</span></div>)}</div><div className="mt-5 text-xs font-bold text-fuchsia-300">40% completado</div></article>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3"><DashboardCard icon={<Video />} title="Próxima clase en vivo" text="Marketing Digital · Jueves 6:00 PM" action="Reservar cupo" /><DashboardCard icon={<Trophy />} title="Tus logros" text="3 insignias · 1 curso completado" action="Ver logros" /><DashboardCard icon={<Award />} title="Tu certificado" text="Emprendimiento Senda · Verificado" action="Ver certificado" /></div>
      </div>
    </section>
  );
}

function DashboardCard({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: string }) { return <article className="rounded-3xl border border-white/10 bg-white/[.04] p-5"><div className="flex items-center gap-3"><span className="rounded-xl bg-fuchsia-400/10 p-2.5 text-fuchsia-300">{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}</span><h3 className="text-sm font-black text-white">{title}</h3></div><p className="mt-4 text-xs leading-5 text-slate-400">{text}</p><button className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white">{action} <ArrowRight className="h-3.5 w-3.5" /></button></article>; }
