'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight, Quote, CheckCircle2 } from 'lucide-react';

export default function FounderGreeting() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-br from-[#2E0540] via-[#4A0E66] to-[#1F032B] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-pink-500/30 relative overflow-hidden">
        
        {/* Glow background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Columna Izquierda: Imagen inspiradora de mujeres unidas con el logo oficial */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-pink-400/40 shadow-2xl group">
              
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=85"
                alt="Mujeres unidas y profesionales Fundación Senda Mujer Cartagena"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20" />

              {/* Logo Flotante Destacado en la esquina superior */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-pink-200 shadow-xl flex items-center gap-2.5">
                <div className="relative w-24 h-7">
                  <Image
                    src="/logo.png"
                    alt="Fundación Senda Mujer"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Badge inferior en la imagen */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full inline-block shadow-md mb-1.5">
                  Liderazgo & Red Femenina
                </span>
                <p className="text-xs font-bold leading-snug drop-shadow-md text-pink-100">
                  Dra. Sorelvis & Equipo Multidisciplinario en Territorio
                </p>
              </div>
            </div>

            {/* Tarjeta de Reconocimiento */}
            <div className="w-full mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg">
                  SM
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    Fundación Senda Mujer
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h4>
                  <p className="text-[11px] text-pink-200/80">Equipo de Protección & Acompañamiento</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold font-mono text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                Cartagena, COL
              </span>
            </div>
          </div>

          {/* Columna Derecha: Mensaje de Bienvenida */}
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
                Te damos la bienvenida a <strong>SENDA Universal</strong>. Creamos este espacio con tecnología de punta y el más alto nivel de confidencialidad para garantizar que conozcas exactamente qué leyes, salud, protección y proyectos de autonomía económica te pertenecen.
              </p>
              <p className="text-xs sm:text-sm text-pink-200/90 leading-relaxed">
                Aquí no hay juzgamientos ni trámites confusos. Cada paso que des dentro de nuestra plataforma está respaldado por psicólogas, médicas, abogadas y trabajadoras sociales listas para apoyarte en Cartagena y Bolívar.
              </p>
            </div>

            {/* Compromisos Clave */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Atención 100% Gratuita', desc: 'En salud, psicología y derecho' },
                { label: 'Confidencialidad Absoluta', desc: 'Protección bajo Ley 1581' },
                { label: 'Ruta de Protección Real', desc: 'Articulación institucional' },
              ].map((c, i) => (
                <div key={i} className="bg-slate-950/40 border border-white/10 rounded-xl p-3 text-center space-y-0.5">
                  <div className="text-amber-300 font-extrabold text-xs">{c.label}</div>
                  <div className="text-slate-300 text-[11px]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Botones de Acción Directa */}
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

      </div>
    </section>
  );
}
