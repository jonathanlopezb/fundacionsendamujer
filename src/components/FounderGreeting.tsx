'use client';

import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, ArrowRight, Quote, CheckCircle2, MapPin, Users, CalendarDays } from 'lucide-react';
import Link from 'next/link';

const CAMPAIGNS = [
  {
    id: 'salud',
    category: 'Salud y derechos',
    title: 'Tu salud, tus decisiones',
    description: 'Jornadas de orientación en salud sexual y reproductiva con información clara y acompañamiento digno.',
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=85',
    date: '2026 · Cartagena',
    impact: '86 mujeres orientadas',
    tone: 'border-pink-400/30',
  },
  {
    id: 'prevencion',
    category: 'Prevención VBG',
    title: 'Redes que protegen',
    description: 'Encuentros comunitarios para reconocer señales de violencia y activar rutas de protección.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    date: '2026 · Bolívar',
    impact: '12 redes comunitarias',
    tone: 'border-amber-300/30',
  },
  {
    id: 'autonomia',
    category: 'Autonomía económica',
    title: 'Mujeres que emprenden',
    description: 'Formación y herramientas para fortalecer ingresos, proyectos de vida y autonomía.',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85',
    date: '2026 · Caribe',
    impact: '42 proyectos acompañados',
    tone: 'border-emerald-300/30',
  },
];

export default function FounderGreeting() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [campaignFilter, setCampaignFilter] = useState('Todas');
  const campaignCategories = ['Todas', ...CAMPAIGNS.map((campaign) => campaign.category)];
  const visibleCampaigns = campaignFilter === 'Todas' ? CAMPAIGNS : CAMPAIGNS.filter((campaign) => campaign.category === campaignFilter);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-br from-[#2E0540] via-[#4A0E66] to-[#1F032B] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-pink-500/30 relative overflow-hidden">
        
        {/* Glow background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Founder Video / Photo Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-pink-400/40 shadow-2xl group">
              
              {/* Founder Video Stream / Embed */}
              <iframe
                className="w-full h-full object-cover"
                src={`https://www.youtube-nocookie.com/embed/g2TlhDyyEfg?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                title="Mensaje de Bienvenida de la Fundadora — Fundación Senda Mujer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Top overlay badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-400/30 text-[11px] font-bold text-pink-300 flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                <span>Mensaje de la Fundadora</span>
              </div>

              {/* Sound control toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-full border border-white/20 text-white hover:bg-pink-600 transition-colors cursor-pointer"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Founder Profile Badge */}
            <div className="w-full mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg">
                  DS
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    Dra. Sorelvis & Equipo
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-pink-200/80">Fundadora & Directora Ejecutiva Senda Mujer</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold font-mono text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                Cartagena, COL
              </span>
            </div>
          </div>

          {/* Right Column: Founder Message & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-pink-500/30 uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                Bienvenida Personalizada
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                &ldquo;Nuestra misión es que <span className="bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">ninguna mujer camine sola</span> en la búsqueda de sus derechos.&rdquo;
              </h2>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 relative">
              <Quote className="w-8 h-8 text-pink-400/30 absolute top-3 right-3 pointer-events-none" />
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Te doy la bienvenida a <strong>SENDA Universal</strong>. Creamos este espacio con tecnología de punta y el más alto nivel de confidencialidad para garantizar que conozcas exactamente qué leyes, salud, protección y proyectos de autonomía económica te pertenecen.
              </p>
              <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
                Aquí no hay juzgamientos ni trámites confusos. Cada paso que des dentro de nuestra plataforma está respaldado por psicólogas, médicas, abogadas y trabajadoras sociales listas para apoyarte.
              </p>
            </div>

            {/* Key commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Atención 100% Gratuita', desc: 'En salud, psicología y derecho' },
                { label: 'Confidencialidad Absoluta', desc: 'Código anónimo temporal' },
                { label: 'Ruta de Protección Real', desc: 'Conectadas con Casa Violeta' },
              ].map((c, i) => (
                <div key={i} className="bg-slate-950/40 border border-white/10 rounded-xl p-3 text-center space-y-0.5">
                  <div className="text-amber-300 font-extrabold text-xs">{c.label}</div>
                  <div className="text-slate-300 text-[11px]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Direct Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/senda-universal"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Hacer mi Diagnóstico Paso a Paso</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
              <Link
                href="/agendar-cita"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Agendar Cita con una Profesional</span>
              </Link>
            </div>

          </div>

        </div>

        <div className="relative z-10 mt-10 border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-5">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-300"><Sparkles className="w-3.5 h-3.5" /> Campañas que dejan huella</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">Lo que construimos juntas</h3>
              <p className="text-xs sm:text-sm text-pink-100/80 mt-2 leading-relaxed">Conoce las jornadas, alianzas y espacios de formación que convierten el acompañamiento en acción territorial.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar campañas">
              {campaignCategories.map((category) => (
                <button key={category} type="button" role="tab" aria-selected={campaignFilter === category} onClick={() => setCampaignFilter(category)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-[11px] font-bold transition-colors ${campaignFilter === category ? 'border-amber-300 bg-amber-300 text-[#2E0540]' : 'border-white/20 bg-white/5 text-pink-100 hover:border-pink-300'}`}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleCampaigns.map((campaign) => (
              <article key={campaign.id} className={`overflow-hidden rounded-2xl border ${campaign.tone} bg-slate-950/35 shadow-xl`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={campaign.image} alt={`Campaña ${campaign.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#2E0540]/90 px-2.5 py-1 text-[10px] font-extrabold text-amber-300">{campaign.category}</span>
                </div>
                <div className="p-4 space-y-3">
                  <h4 className="text-base font-black text-white">{campaign.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-300">{campaign.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-[10px] font-bold text-pink-200/80">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-amber-300" />{campaign.date}</span>
                    <span className="inline-flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-300" />{campaign.impact}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-pink-300"><MapPin className="w-3.5 h-3.5" /> Fundación Senda Mujer</span>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
