'use client';

import React, { useEffect, useState } from 'react';
import { Route, Clock, CheckCircle2, AlertTriangle, Building, ArrowRight } from 'lucide-react';

const MOCK_ROUTES = [
  { id: 'RUT-101', name: 'Atención Psicosocial Inicial', provider: 'Fundación Senda Mujer', time: '1 - 2 horas', status: 'COMPLETED' },
  { id: 'RUT-102', name: 'Asesoría Jurídica y Medidas de Protección', provider: 'Comisaría de Familia Country', time: '24 - 48 horas', status: 'IN_PROGRESS' },
  { id: 'RUT-103', name: 'Ingreso a Programa de Autonomía Económica', provider: 'Senda Academia', time: '5 días', status: 'ACTIVATED' },
  { id: 'RUT-104', name: 'Código Rosa — Atención prioritaria en Salud', provider: 'Hospital Universitario del Caribe', time: 'Inmediata 24/7', status: 'PENDING' },
];

export default function RutasPage() {
  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-teal-500 text-[#140320] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          ROUTE ENGINE
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Gestión y Trazabilidad de Rutas
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Medición transparente de tiempos desde la solicitud inicial hasta la atención efectiva y cierre de la ruta.
        </p>
      </div>

      <div className="bg-[#140320]/90 rounded-3xl border border-purple-800/50 p-6 sm:p-8 space-y-6 shadow-2xl">
        <h3 className="font-extrabold text-white text-lg">Trazabilidad de Rutas Institucionales Activas</h3>

        <div className="space-y-4">
          {MOCK_ROUTES.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border border-purple-900/40 bg-purple-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-pink-400">{r.id}</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                    r.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' :
                    r.status === 'IN_PROGRESS' ? 'bg-blue-950 text-blue-300 border border-blue-700/50' :
                    r.status === 'ACTIVATED' ? 'bg-purple-950 text-purple-300 border border-purple-700/50' : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-sm">{r.name}</h4>
                <p className="text-xs text-pink-300/70">{r.provider}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-pink-200 bg-purple-900/40 px-4 py-2 rounded-xl border border-purple-700/40">
                <Clock className="w-4 h-4 text-[#E12880]" />
                <span>Tiempo estimado: {r.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
