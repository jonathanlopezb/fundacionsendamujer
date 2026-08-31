'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { Phone, ShieldAlert, ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-[#180325] text-white">
      <CaribeSeguroHeader />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-rose-600/30 border border-rose-500 rounded-3xl p-6 sm:p-10 space-y-6 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center mx-auto text-white animate-pulse">
            <Phone className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-rose-100">SENDA SOS — RESPUESTA RÁPIDA</h1>
          <p className="text-xs sm:text-sm text-pink-200 max-w-xl mx-auto leading-relaxed">
            Si te encuentras en peligro o requieres atención inmediata, comunícate directamente con las líneas de protección oficial o activa nuestro canal discreto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left pt-2">
            <a href="tel:125" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <span className="text-2xl">📞</span>
              <div>
                <span className="font-extrabold text-sm block">Línea Rosa Cartagena: 125</span>
                <span className="text-[10px] text-pink-300">Atención 24/7 en Cartagena</span>
              </div>
            </a>

            <a href="tel:155" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <span className="text-2xl">🇨🇴</span>
              <div>
                <span className="font-extrabold text-sm block">Línea Nacional Mujeres: 155</span>
                <span className="text-[10px] text-pink-300">Orientación a nivel Colombia</span>
              </div>
            </a>

            <a href="tel:122" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <span className="text-2xl">⚖️</span>
              <div>
                <span className="font-extrabold text-sm block">Fiscalía General: 122</span>
                <span className="text-[10px] text-pink-300">Denuncias de delitos y violencia</span>
              </div>
            </a>

            <a href="tel:123" className="bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-2xl flex items-center gap-3 transition-colors">
              <span className="text-2xl">🚨</span>
              <div>
                <span className="font-extrabold text-sm block">Policía Nacional: 123</span>
                <span className="text-[10px] text-pink-300">Urgencias y emergencias inmediatas</span>
              </div>
            </a>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/senda-sos"
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-8 py-3.5 rounded-full text-xs shadow-lg transition-all flex items-center gap-2"
            >
              Ir al Módulo SOS Completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
