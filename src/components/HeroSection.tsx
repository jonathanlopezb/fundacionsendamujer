'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, PhoneCall, ArrowRight, UserCheck, Stethoscope, Globe } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-pink-50/70 via-white to-pink-50/30 pt-8 pb-16 lg:pt-16 lg:pb-28">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-senda-pink/15 to-amber-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-senda-purple/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-senda-pink-light to-amber-50 border border-senda-pink/20 px-3.5 py-1.5 rounded-full shadow-xs text-[11px] sm:text-xs font-bold text-senda-purple">
              <Sparkles className="w-3.5 h-3.5 text-senda-pink shrink-0" />
              <span>Cartagena de Indias • Acompañamiento Integral Confidencial</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-senda-purple-dark leading-[1.15] tracking-tight">
              Ninguna mujer debería <br className="hidden sm:inline" />
              <span className="gradient-text-pink-purple">enfrentar sola su camino.</span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-700 font-normal leading-relaxed max-w-2xl">
              Protegemos, acompañamos y fortalecemos integralmente a mujeres y niñas en Cartagena frente a embarazos no planeados, violencia de género, violencia sexual y falta de redes de apoyo, brindando servicios de <strong className="text-senda-purple">Psicología, Odontología, Medicina General y Asesoría Jurídica.</strong>
            </p>

            {/* Main Action Buttons — Fully Responsive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/triaje-psicologico"
                className="w-full sm:w-auto bg-gradient-to-r from-senda-pink to-senda-pink-dark text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-glass-pink hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 group text-center"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span>Realizar Test Psicológico Gratuito</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>

              <Link
                href="/agendar-cita"
                className="w-full sm:w-auto bg-white text-senda-purple hover:text-senda-pink font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-full border-2 border-senda-purple/20 hover:border-senda-pink shadow-xs transition-all flex items-center justify-center space-x-2 text-center"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-senda-purple shrink-0" />
                <span>Agendar Cita (Médica, Dental, Legal)</span>
              </Link>

              <Link
                href="/senda-universal"
                className="w-full sm:w-auto bg-senda-purple text-white hover:bg-senda-purple-dark font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-full shadow-xs transition-all flex items-center justify-center space-x-2 text-center"
              >
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span>Ingresar al Sistema Operativo</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="flex items-center space-x-2 bg-white/80 border border-pink-100 p-2.5 rounded-xl shadow-xs">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">100% Confidencial</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 border border-pink-100 p-2.5 rounded-xl shadow-xs">
                <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-senda-pink shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">Atención Médica & Dental</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 border border-pink-100 p-2.5 rounded-xl shadow-xs col-span-2 sm:col-span-1">
                <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold text-slate-800">Sin Juzgamiento</span>
              </div>
            </div>
          </div>

          {/* Right Brand Showcase Card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-senda-pink via-amber-400 to-senda-purple rounded-3xl blur-lg opacity-30 animate-pulse-glow" />

              <div className="relative bg-white/90 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5">
                <div className="w-full h-44 sm:h-64 rounded-2xl overflow-hidden border border-pink-100 bg-pink-50/50 shadow-inner flex items-center justify-center p-4">
                  <img
                    src="/logo.png"
                    alt="Fundación Senda Mujer Logo Corporativo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="bg-gradient-to-r from-senda-purple-dark to-senda-purple text-white rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
                  <div className="flex justify-between items-center text-[11px] sm:text-xs font-bold text-amber-300 flex-wrap gap-1">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cobertura Cartagena & Bolívar
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 text-[10px]">
                      Ruta Activa
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Red de Apoyo Multidisciplinaria
                  </h3>
                  <p className="text-[11px] sm:text-xs text-pink-100 leading-relaxed">
                    Si eres víctima de violencia sexual, estás enfrentando un embarazo no deseado o requieres apoyo psicológico, dental o legal en Cartagena, estamos para ayudarte.
                  </p>
                  
                  <div className="pt-2 border-t border-pink-500/30 flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-pink-200">Línea Púrpura Cartagena:</span>
                    <a href="tel:3014692095" className="font-extrabold text-amber-300 hover:underline flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" /> 301 469 2095
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
