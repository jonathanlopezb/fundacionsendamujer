'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/30 pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-senda-pink/15 to-amber-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-senda-purple/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-block bg-gradient-to-r from-senda-pink-light to-amber-50 border border-senda-pink/20 px-4 py-1.5 rounded-full shadow-xs text-xs font-bold text-senda-purple">
              Cartagena de Indias · Acompañamiento Integral Confidencial
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-senda-purple-dark leading-[1.15] tracking-tight">
              Ninguna mujer debería <br className="hidden sm:inline" />
              <span className="gradient-text-pink-purple">enfrentar sola su camino.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl">
              Protegemos, acompañamos y fortalecemos integralmente a mujeres y niñas en Cartagena frente a embarazos no planeados, violencia de género, violencia sexual y falta de redes de apoyo, brindando atención gratuita en <strong className="text-senda-purple font-bold">Psicología, Ginecología, Odontología, Medicina General y Asesoría Jurídica.</strong>
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/triaje-psicologico"
                className="w-full sm:w-auto bg-gradient-to-r from-senda-pink to-senda-pink-dark text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-glass-pink hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all text-center"
              >
                Iniciar Test Psicológico
              </Link>

              <Link
                href="/agendar-cita"
                className="w-full sm:w-auto bg-white text-senda-purple hover:text-senda-pink font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full border-2 border-senda-purple/20 hover:border-senda-pink shadow-xs transition-all text-center"
              >
                Agendar Cita Médica
              </Link>

              <Link
                href="/senda-universal"
                className="w-full sm:w-auto bg-senda-purple text-white hover:bg-senda-purple-dark font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xs transition-all text-center"
              >
                SENDA Universal (Derechos)
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/90 border border-pink-100 p-3 rounded-2xl shadow-xs text-center">
                <span className="text-xs font-black text-slate-800 block">100% Gratuito</span>
                <span className="text-[11px] text-slate-500">Atención sin costo</span>
              </div>
              <div className="bg-white/90 border border-pink-100 p-3 rounded-2xl shadow-xs text-center">
                <span className="text-xs font-black text-slate-800 block">Confidencial</span>
                <span className="text-[11px] text-slate-500">Bajo Ley 1581</span>
              </div>
              <div className="bg-white/90 border border-pink-100 p-3 rounded-2xl shadow-xs text-center col-span-2 sm:col-span-1">
                <span className="text-xs font-black text-slate-800 block">Sin Juzgamiento</span>
                <span className="text-[11px] text-slate-500">Enfoque de género</span>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase: Authentic Human Emotional Imagery */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow Backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-r from-senda-pink via-amber-400 to-senda-purple rounded-3xl blur-lg opacity-30 animate-pulse-glow" />

              <div className="relative bg-white/95 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
                {/* Real Impact Photo */}
                <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85"
                    alt="Acompañamiento y orientación psicosocial Fundación Senda Mujer"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-block mb-1">
                      En Terreno · Cartagena
                    </span>
                    <p className="text-xs font-bold leading-snug drop-shadow-md">
                      Orientación psicológica y médica presencial en barrios vulnerables
                    </p>
                  </div>
                </div>

                {/* Emergency Card Box */}
                <div className="bg-gradient-to-r from-senda-purple-dark to-senda-purple text-white rounded-2xl p-4 sm:p-5 shadow-lg space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                    <span>Atención 24 Horas en Cartagena</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 text-[10px]">
                      Línea Activa
                    </span>
                  </div>
                  
                  <p className="text-xs text-pink-100 leading-relaxed">
                    Si eres víctima de violencia de género, estás atravesando un embarazo en soledad o requieres apoyo médico y legal, estamos aquí para ti.
                  </p>

                  <div className="pt-2 border-t border-pink-500/30 flex justify-between items-center text-xs">
                    <span className="text-pink-200">Línea Directa / WhatsApp:</span>
                    <a href="tel:3014692095" className="font-black text-amber-300 hover:underline">
                      301 469 2095
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
