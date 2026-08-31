'use client';

/**
 * MapaCaribeSeguro.tsx — Fase 3: Mapa de Servicios Territoriales
 *
 * Muestra la oferta institucional de protección y atención en Cartagena y Bolívar
 * (Casa Refugio Violeta, Comisarías de Familia, Puntos de Atención Psicosocial).
 * CUMPLE REGLA ÉTICA: NUNCA ubica la geolocalización de las víctimas ni refugios confidenciales.
 */

import React, { useState } from 'react';
import { MapPin, Phone, Shield, Building, Hospital, Scale, HeartHandshake, Navigation } from 'lucide-react';

interface ServicePoint {
  id: string;
  name: string;
  category: 'Atención Psicosocial' | 'Protección y Denuncia' | 'Salud y Emergencia' | 'Orientación Jurídica';
  sector: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
}

const SERVICES: ServicePoint[] = [
  {
    id: '1',
    name: 'Sede Principal Fundación Senda Mujer',
    category: 'Atención Psicosocial',
    sector: 'Cartagena — Centro Histórico',
    address: 'Calle del Cuartel, Cra. 5 #36-22',
    phone: '+57 301 469 2095',
    hours: 'Lun - Vie: 8:00 AM - 5:00 PM',
    description: 'Atención integral psicosocial, aplicación del IPSC, proyecto de vida y asesoría jurídica gratuita.',
  },
  {
    id: '2',
    name: 'Casa Refugio Violeta (Punto de Recepción)',
    category: 'Protección y Denuncia',
    sector: 'Cartagena — Sector Olaya Herrera',
    address: 'Coordinación vía Secretaría de Participación',
    phone: 'Línea Rosa Cartagena: 125',
    hours: 'Atención 24/7',
    description: 'Espacio seguro de acogida temporal para mujeres en riesgo inminente y sus hijos/as.',
  },
  {
    id: '3',
    name: 'Comisaría de Familia Country',
    category: 'Protección y Denuncia',
    sector: 'Cartagena — El Country / Localidad 2',
    address: 'Transversal 54 #30-45',
    phone: '(605) 642 1200',
    hours: 'Lun - Vie: 7:30 AM - 4:00 PM',
    description: 'Medidas de protección de emergencia, tramitación de cese de violencia e intrafamiliar.',
  },
  {
    id: '4',
    name: 'Hospital Universitario del Caribe (Atención Prioritaria)',
    category: 'Salud y Emergencia',
    sector: 'Cartagena — Zaragocilla',
    address: 'Calle 29 #50-50',
    phone: '123 / (605) 672 4000',
    hours: 'Atención 24 horas',
    description: 'Activación del Código Rosa de salud, atención médica de urgencias e informe forense.',
  },
  {
    id: '5',
    name: 'Centro de Atención a Víctimas (CAV) Fiscalía',
    category: 'Orientación Jurídica',
    sector: 'Cartagena — Crespo',
    address: 'Calle 70 #3-15',
    phone: '122 / (605) 656 9000',
    hours: 'Lun - Vie: 8:00 AM - 5:00 PM',
    description: 'Recepción de denuncias penales por violencia de género, violencia intrafamiliar y delitos sexuales.',
  },
  {
    id: '6',
    name: 'Punto de Orientación Comunitaria El Pozón',
    category: 'Atención Psicosocial',
    sector: 'Cartagena — El Pozón',
    address: 'Sector Central, Mz. 12 Lote 4',
    phone: '+57 300 214 8871',
    hours: 'Mar y Jue: 9:00 AM - 3:00 PM',
    description: 'Triage de entrada, talleres de autonomía económica e información del programa Caribe Seguro.',
  },
];

export default function MapaCaribeSeguro() {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [search, setSearch] = useState('');

  const categories = ['TODAS', 'Atención Psicosocial', 'Protección y Denuncia', 'Salud y Emergencia', 'Orientación Jurídica'];

  const filteredServices = SERVICES.filter((s) => {
    const matchCat = selectedCategory === 'TODAS' || s.category === selectedCategory;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.sector.toLowerCase().includes(search.toLowerCase()) ||
                        s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#180325] via-[#3B0852] to-[#52166F] text-white rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[10px] uppercase tracking-widest">
          <MapPin className="w-4 h-4" /> Fase 3 — Cobertura Territorial Responsable
        </div>
        <h2 className="text-2xl font-black">Mapa de Servicios Caribe Seguro</h2>
        <p className="text-xs text-pink-200 leading-relaxed max-w-2xl">
          Directorio de orientación y servicios institucionales disponibles en Cartagena de Indias y Bolívar.
          Por normas de seguridad y protección (Habeas Data Ley 1581), el mapa orienta rutas de atención sin geolocalizar la ubicación de víctimas ni casas de acojida confidenciales.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E12880] text-white shadow-sm'
                    : 'bg-pink-50 text-slate-600 hover:bg-pink-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por sector o servicio..."
            className="px-4 py-1.5 rounded-full border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#E12880]"
          />
        </div>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-pink-100 p-5 space-y-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                  service.category === 'Atención Psicosocial' ? 'bg-purple-100 text-purple-800' :
                  service.category === 'Protección y Denuncia' ? 'bg-rose-100 text-rose-800' :
                  service.category === 'Salud y Emergencia' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {service.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{service.sector}</span>
              </div>

              <h4 className="font-extrabold text-[#52166F] text-sm leading-tight">{service.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
            </div>

            <div className="pt-3 border-t border-pink-50 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E12880] shrink-0" />
                <span className="font-semibold text-slate-700">{service.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">{service.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <span>{service.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
