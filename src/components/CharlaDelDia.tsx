'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Shield, Heart, Share2, Sparkles, MessageCircle, Calendar, CheckCircle2, UserCheck, Flame } from 'lucide-react';
import Link from 'next/link';

export default function CharlaDelDia() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'puntos' | 'transcripcion' | 'preguntas'>('puntos');

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-800/30 overflow-hidden relative">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                Charla del Día • En Reproducción
              </span>
              <span className="bg-white/10 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                Cartagena & Bolívar
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Derechos Reproductivos, Autonomía Económica & Rutas de Atención
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
              Capacitación diaria impartida por la <strong>Dra. Sorelvis</strong> y el equipo de especialistas de la Fundación Senda Mujer.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/academia"
              className="bg-purple-600/60 hover:bg-purple-600 text-white border border-purple-400/40 text-xs font-extrabold px-4 py-2.5 rounded-full transition-all flex items-center gap-2"
            >
              <span>Ver Charlas Anteriores</span>
            </Link>
          </div>
        </div>

        {/* Main Grid: Video Player + Interactive Sidebar */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Video Player Column */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative aspect-video bg-black/80 rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl group">
              
              {/* Actual Video or Custom Styled Player Container */}
              <iframe
                className="w-full h-full object-cover"
                src={`https://www.youtube-nocookie.com/embed/g2TlhDyyEfg?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
                title="Charla del Día — Fundación Senda Mujer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Overlay controls badge when not interacting */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-mono text-pink-300 flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>SENDA LIVE • 24:15 min</span>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-bold text-amber-300 pointer-events-none">
                HD 1080p
              </div>
            </div>

            {/* Presenter Footer Bar */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-700 flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                  DS
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    Dra. Sorelvis & Dra. Elena Ruiz
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-purple-200/70">
                    Especialistas en Ginecología, Psicología & Derecho VBG
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Activar Sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-pink-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>

                <Link
                  href="/agendar-cita"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>Solicitar Cita con la Ponente</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Sidebar Column */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Tabs */}
              <div className="flex border-b border-white/10 pb-3 gap-2">
                {[
                  { id: 'puntos', label: 'Puntos Clave' },
                  { id: 'transcripcion', label: 'Resumen Transcripción' },
                  { id: 'preguntas', label: 'Preguntas Frecuentes' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'text-purple-200/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Puntos Clave */}
              {activeTab === 'puntos' && (
                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-500/20 space-y-1">
                    <div className="font-extrabold text-pink-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      1. Protección Legal Inmediata (Ley 1257 de 2008)
                    </div>
                    <p className="text-purple-100/80 leading-relaxed text-[11px]">
                      Pautas para solicitar medidas de protección prioritarias en Comisarías de Familia de Cartagena sin costo.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-500/20 space-y-1">
                    <div className="font-extrabold text-pink-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      2. Ruta de Salud Sexual y Reproductiva (SSR)
                    </div>
                    <p className="text-purple-100/80 leading-relaxed text-[11px]">
                      Garantía de atención ginecológica y anticoncepción gratuita bajo la Política Intersectorial 2026-2035.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-900/30 rounded-xl border border-purple-500/20 space-y-1">
                    <div className="font-extrabold text-pink-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      3. Acceso a Fondo Capital Semilla Senda
                    </div>
                    <p className="text-purple-100/80 leading-relaxed text-[11px]">
                      Capital no reembolsable de $2.500.000 COP para proyectos productivos de usuarias activas.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Transcripción */}
              {activeTab === 'transcripcion' && (
                <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/10 text-[11px] text-purple-100/90 leading-relaxed max-h-56 overflow-y-auto space-y-2">
                  <p><strong>[00:00 - 05:00] Dra. Sorelvis:</strong> Bienvenidas a la jornada de empoderamiento de la Fundación Senda Mujer. Hoy abordamos las garantías fundamentales en salud reproductiva y la eliminación de barreras institucionales en Cartagena...</p>
                  <p><strong>[05:01 - 15:00] Dra. Elena Ruiz:</strong> Es indispensable reconocer los derechos bajo la Ley 1257. Toda mujer tiene derecho a ser atendida sin revictimización en los centros de salud e IPS públicas...</p>
                  <p><strong>[15:01 - 24:15] Equipo Senda:</strong> Presentamos los cursos de SendaAcademia y la ruta para acceder al auxilio de capital semilla...</p>
                </div>
              )}

              {/* Tab 3: Preguntas */}
              {activeTab === 'preguntas' && (
                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="font-bold text-amber-300">¿Tiene algún costo asistir o agendar citas?</p>
                    <p className="text-[11px] text-purple-200/80 mt-0.5">No, todos los servicios de la Fundación Senda Mujer son 100% gratuitos.</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="font-bold text-amber-300">¿Cómo me inscribo en la Academia?</p>
                    <p className="text-[11px] text-purple-200/80 mt-0.5">Ingresa al Portal de Beneficiarias con tu cédula y clave PIN para inscribirte.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-pink-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Actualizado Diariamente
              </span>

              <Link
                href="/portal-beneficiaria"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1"
              >
                <span>Acceder a la Academia Completa</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
