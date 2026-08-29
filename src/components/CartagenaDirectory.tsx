'use client';

import React from 'react';
import { MapPin, Phone, Building2, Shield, HeartPulse, Scale, ExternalLink, Navigation } from 'lucide-react';

const CARTAGENA_ROUTES = [
  {
    category: 'Línea de Atención Violeta & Emergencia',
    icon: Phone,
    color: 'bg-pink-500 text-white',
    items: [
      {
        name: 'Línea Púrpura Cartagena & Fundación Senda Mujer',
        phone: '317 657 5800 / 155',
        address: 'Atención 24 Horas — Cartagena de Indias',
        badge: 'Directo Fundación',
      },
      {
        name: 'Policía Nacional & Patrulla Púrpura Cartagena',
        phone: '123 / 155',
        address: 'Comando Policía Mebcar — Cartagena',
        badge: 'Emergencia Inmediata',
      },
    ],
  },
  {
    category: 'Comisarías de Familia & Casa de Justicia',
    icon: Scale,
    color: 'bg-purple-600 text-white',
    items: [
      {
        name: 'Casa de Justicia Chiquinquirá',
        phone: '(605) 669 4141',
        address: 'Av. Pedro de Heredia, Sector Chiquinquirá, Cartagena',
        badge: 'Medidas de Protección',
      },
      {
        name: 'Comisaría de Familia Country',
        phone: '(605) 651 0200',
        address: 'Barrio El Country, Cra. 48 #29B-45, Cartagena',
        badge: 'Atención Familiar',
      },
      {
        name: 'Comisaría de Familia Localidad 2 (Virgen del Carmen)',
        phone: '(605) 662 5500',
        address: 'Sector Olaya Herrera, Cartagena',
        badge: 'VBG & Restablecimiento',
      },
    ],
  },
  {
    category: 'Salud & Urgencias Médicas Cartagena',
    icon: HeartPulse,
    color: 'bg-emerald-600 text-white',
    items: [
      {
        name: 'ESE Hospital Local Cartagena de Indias',
        phone: '(605) 642 9000',
        address: 'Sedes en Olaya Herrera, Pozón, Canapote y Arroz Barato',
        badge: 'Ruta IVE & Urgencias',
      },
      {
        name: 'Hospital Universitario del Caribe (HUC)',
        phone: '(605) 672 4000',
        address: 'Barrio Zaragocilla, Calle 29 #50-50, Cartagena',
        badge: 'Atención Compleja',
      },
    ],
  },
  {
    category: 'Justicia & Derechos Humanos',
    icon: Building2,
    color: 'bg-amber-600 text-white',
    items: [
      {
        name: 'Fiscalía General de la Nación — Seccional Bolívar',
        phone: '01 8000 919748',
        address: 'Edificio Banco del Comercio, Centro Histórico, Cartagena',
        badge: 'Denuncias Penales',
      },
      {
        name: 'ICBF Regional Bolívar — Centro Zonal Cartagena',
        phone: '01 8000 918080',
        address: 'Barrio Pie de la Popa, Calle 30 #20-10, Cartagena',
        badge: 'Protección Niñez & Adolescencia',
      },
    ],
  },
];

export default function CartagenaDirectory() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="bg-senda-purple-light text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          Directorio Local Interactivo
        </span>
        <h2 className="text-3xl font-extrabold text-senda-purple-dark">
          Ruta Institucional de Atención en Cartagena de Indias
        </h2>
        <p className="text-sm text-slate-600">
          La Fundación Senda Mujer te acompaña como gestora de caso para acceder de forma rápida y segura a las entidades de salud, protección y justicia en la ciudad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CARTAGENA_ROUTES.map((sec, idx) => {
          const Icon = sec.icon;

          return (
            <div key={idx} className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm hover:shadow-md transition-all space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-pink-100">
                <div className={`p-3 rounded-2xl ${sec.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-senda-purple-dark">
                  {sec.category}
                </h3>
              </div>

              <div className="space-y-4">
                {sec.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                      <span className="bg-white text-senda-pink font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-senda-pink shrink-0" />
                      <span>{item.address}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        className="text-xs font-extrabold text-senda-purple hover:text-senda-pink flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.phone}</span>
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.name + ' ' + item.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-slate-500 hover:text-senda-pink flex items-center gap-1"
                      >
                        <span>Cómo llegar</span>
                        <Navigation className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
