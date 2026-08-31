'use client';

import React, { useState } from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { Route, Clock, CheckCircle2, AlertTriangle, Building, ArrowRight } from 'lucide-react';

const MOCK_ROUTES = [
  { id: 'RUT-101', name: 'Atención Psicosocial Inicial', provider: 'Fundación Senda Mujer', time: '1 - 2 horas', status: 'COMPLETED' },
  { id: 'RUT-102', name: 'Asesoría Jurídica y Medidas de Protección', provider: 'Comisaría de Familia Country', time: '24 - 48 horas', status: 'IN_PROGRESS' },
  { id: 'RUT-103', name: 'Ingreso a Programa de Autonomía Económica', provider: 'Senda Academia', time: '5 días', status: 'ACTIVATED' },
  { id: 'RUT-104', name: 'Código Rosa — Atención prioritaria en Salud', provider: 'Hospital Universitario del Caribe', time: 'Inmediata 24/7', status: 'PENDING' },
];

export default function RutasPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="bg-teal-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            ROUTE ENGINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            Gestión y Trazabilidad de Rutas
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Medición transparente de tiempos desde la solicitud inicial hasta la atención efectiva y cierre de la ruta.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-pink-100 p-6 sm:p-8 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-[#52166F] text-lg">Ejemplo de Trazabilidad de Rutas Institucionales</h3>

          <div className="space-y-4">
            {MOCK_ROUTES.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{r.id}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      r.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      r.status === 'ACTIVATED' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-[#52166F] text-sm">{r.name}</h4>
                  <p className="text-xs text-slate-500">{r.provider}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-pink-100">
                  <Clock className="w-4 h-4 text-[#E12880]" />
                  <span>Tiempo estimado: {r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
