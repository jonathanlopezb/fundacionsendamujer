'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Shield, Phone, Hospital, Scale, Heart, Navigation, ExternalLink, ArrowLeft } from 'lucide-react';

const PUBLIC_SERVICES = [
  { id: '1', name: 'Casa Refugio Violeta — Fundación Senda Mujer', type: 'Hospedaje & Protección Inmediata', address: 'Pie de la Popa, Cartagena', phone: '+57 301 469 2095', is24h: true, category: 'REFUGIO' },
  { id: '2', name: 'Comisaría de Familia Chiquinquirá (Casa de Justicia)', type: 'Medidas de Protección Ley 1257', address: 'Sector Chiquinquirá, Transversal 54', phone: '+57 (605) 651 7000', is24h: false, category: 'JUSTICIA' },
  { id: '3', name: 'ESE Hospital Local Cartagena — Sede Arroz Barato', type: 'Atención Médica & Urgencias VBG', address: 'Barrio Arroz Barato / Mamonal', phone: '123 / 155', is24h: true, category: 'SALUD' },
  { id: '4', name: 'Fiscalía General de la Nación — Seccional Bolívar', type: 'Denuncia Penal VBG & CAIVAS', address: 'Crespo, Calle 70 #3-12, Cartagena', phone: '122', is24h: true, category: 'JUSTICIA' },
  { id: '5', name: 'Patrulla Púrpura Policía Metropolitana de Cartagena', type: 'Respuesta de Emergencia en Territorio', address: 'Cartagena de Indias', phone: '155 / 123', is24h: true, category: 'EMERGENCIA' },
];

export default function MapaCaribeSeguroPage() {
  const [selectedFilter, setSelectedFilter] = useState<'TODOS' | 'REFUGIO' | 'JUSTICIA' | 'SALUD' | 'EMERGENCIA'>('TODOS');

  const filteredServices = selectedFilter === 'TODOS'
    ? PUBLIC_SERVICES
    : PUBLIC_SERVICES.filter((s) => s.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#0F0218] text-white p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-pink-500/20 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-pink-400 hover:text-pink-300 text-xs font-bold flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Volver al Inicio
            </Link>
          </div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#E12880]" />
            Mapa Caribe Seguro — Cartagena & Bolívar
          </h1>
          <p className="text-xs text-pink-200/80 max-w-2xl">
            Geolocalización de servicios institucionales públicos, rutas de protección prioritaria y Casa Refugio Violeta. Ninguna ubicación de víctimas es expuesta.
          </p>
        </div>

        <Link
          href="/portal-beneficiaria"
          className="bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-black px-5 py-2.5 rounded-full text-xs shadow-lg hover:scale-105 transition-all"
        >
          Pedir Ayuda 24/7
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'TODOS', label: '📍 Todos los Servicios' },
          { id: 'REFUGIO', label: '🏠 Casas Refugio' },
          { id: 'JUSTICIA', label: '⚖️ Comisaría & Fiscalía' },
          { id: 'SALUD', label: '🩺 Centros de Salud' },
          { id: 'EMERGENCIA', label: '🚨 Patrulla Púrpura 155' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === f.id
                ? 'bg-[#E12880] text-white shadow-md'
                : 'bg-[#240538] text-pink-200 hover:bg-[#31084A] border border-pink-500/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de Servicios Institucionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-[#240538] rounded-3xl p-6 border border-pink-500/30 space-y-3 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">{service.type}</span>
                <h3 className="text-lg font-black text-white mt-0.5">{service.name}</h3>
              </div>
              {service.is24h && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Atención 24/7
                </span>
              )}
            </div>

            <div className="text-xs text-pink-100 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{service.address}</span>
              </p>
              <p className="flex items-center gap-2 font-mono font-bold text-amber-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{service.phone}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
