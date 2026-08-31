'use client';

import React from 'react';
import { Phone, ShieldAlert, ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SOSPage() {
  return (
    <div className="p-4 sm:p-8 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-rose-950/60 border border-rose-600/50 rounded-3xl p-6 sm:p-10 space-y-6 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center mx-auto text-white animate-pulse">
          <Phone className="w-8 h-8 text-amber-300" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-rose-100">SENDA SOS — RESPUESTA RÁPIDA</h1>
        <p className="text-xs sm:text-sm text-rose-200/90 max-w-xl mx-auto leading-relaxed">
          Si te encuentras en peligro o requieres atención inmediata, comunícate directamente con las líneas de protección oficial o activa nuestro canal discreto.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <a href="tel:125" className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 p-4 rounded-2xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">📞</span>
            <div>
              <span className="font-extrabold text-sm text-white block">Línea Rosa Cartagena: 125</span>
              <span className="text-[10px] text-pink-300">Atención 24/7 en Cartagena</span>
            </div>
          </a>

          <a href="tel:155" className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 p-4 rounded-2xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">🇨🇴</span>
            <div>
              <span className="font-extrabold text-sm text-white block">Línea Nacional Mujeres: 155</span>
              <span className="text-[10px] text-pink-300">Orientación a nivel Colombia</span>
            </div>
          </a>

          <a href="tel:122" className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 p-4 rounded-2xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">⚖️</span>
            <div>
              <span className="font-extrabold text-sm text-white block">Fiscalía General: 122</span>
              <span className="text-[10px] text-pink-300">Denuncias de delitos y violencia</span>
            </div>
          </a>

          <a href="tel:123" className="bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 p-4 rounded-2xl flex items-center gap-3 transition-colors">
            <span className="text-2xl">🚨</span>
            <div>
              <span className="font-extrabold text-sm text-white block">Policía Nacional: 123</span>
              <span className="text-[10px] text-pink-300">Urgencias y emergencias inmediatas</span>
            </div>
          </a>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href="/senda-sos"
            className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-8 py-3.5 rounded-full text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            Ir al Módulo SOS Completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
