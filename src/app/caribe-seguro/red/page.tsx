'use client';

import React from 'react';
import CaribeSeguroHeader from '@/components/caribe-seguro/CaribeSeguroHeader';
import { Users, Shield, MapPin, HeartHandshake, CheckCircle2 } from 'lucide-react';

const PROFESSIONALS = [
  { name: 'Dra. Sorelvis Murillo', role: 'Directora Ejecutiva / Atención Psicosocial', specialty: 'Triage de Riesgo IPSC, Proyectos de Vida', area: 'Cartagena & Bolívar' },
  { name: 'Dra. Carolina Mendoza', role: 'Asesora Jurídica Senior', specialty: 'Derecho de Familia, Ley 1257, Medidas de Protección', area: 'Localidad 2 Cartagena' },
  { name: 'Lic. Claudia López', role: 'Trabajadora Social', specialty: 'Atención Comunitaria y Rutas de Refugio', area: 'Sector Olaya & El Pozón' },
  { name: 'Dra. Patricia Herrera', role: 'Psicóloga Especializada', specialty: 'Salud Mental, Código Rosa y Sanación Emocional', area: 'Cartagena Centro & Norte' },
];

export default function RedPage() {
  return (
    <div className="min-h-screen bg-[#FDF8FA]">
      <CaribeSeguroHeader />

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center space-y-4">
          <span className="bg-pink-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
            SENDA NETWORK
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#52166F]">
            Red Profesional Caribe Seguro
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Red de especialistas en psicología, derecho, trabajo social y salud orientadas al acompañamiento multidisciplinario de mujeres en el Caribe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROFESSIONALS.map((prof, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-pink-100 p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E12880] to-[#52166F] text-white font-extrabold flex items-center justify-center text-base">
                  {prof.name.split(' ')[1]?.[0] || 'S'}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#52166F] text-base">{prof.name}</h3>
                  <span className="text-xs font-bold text-pink-600">{prof.role}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-pink-50 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#E12880] shrink-0" />
                  <span><strong>Especialidad:</strong> {prof.specialty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Zona de atención:</strong> {prof.area}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
