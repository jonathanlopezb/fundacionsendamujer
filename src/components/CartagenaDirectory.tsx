'use client';

import React from 'react';
import { 
  RiPhoneFill, 
  RiScales3Line, 
  RiHeartPulseLine, 
  RiBuilding4Line, 
  RiMapPinLine, 
  RiCompass3Line, 
  RiShieldFlashLine,
  RiCheckDoubleLine
} from 'react-icons/ri';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { IconType } from 'react-icons';

export interface RouteCategory {
  category: string;
  icon: IconType;
  color: string;
  items: {
    name: string;
    phone: string;
    address: string;
    badge: string;
  }[];
}

const CARTAGENA_ROUTES: RouteCategory[] = [
  {
    category: 'Línea de Atención Violeta & Emergencia',
    icon: RiPhoneFill,
    color: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
    items: [
      {
        name: 'Línea Púrpura Cartagena & Fundación Senda Mujer',
        phone: '317 657 5800 / 155',
        address: 'Atención 24 Horas — Cartagena de Indias',
        badge: 'Directo Fundación 24/7',
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
    icon: RiScales3Line,
    color: 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white',
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
    icon: RiHeartPulseLine,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white',
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
    icon: RiBuilding4Line,
    color: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
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
        <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200 text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
          <HiOutlineSparkles className="w-4 h-4 text-senda-pink" />
          <span>Directorio Local Interactivo</span>
        </div>

        <h2 className="text-3xl font-extrabold text-senda-purple-dark">
          Ruta Institucional de Atención en Cartagena de Indias
        </h2>

        <p className="text-sm text-slate-600">
          La Fundación Senda Mujer te acompaña como gestora de caso para acceder de forma rápida y segura a las entidades de salud, protección y justicia en la ciudad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CARTAGENA_ROUTES.map((sec, idx) => {
          const IconComponent = sec.icon;

          return (
            <div key={idx} className="bg-white rounded-3xl border border-pink-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-6">
              
              <div className="flex items-center space-x-3.5 pb-4 border-b border-pink-100">
                <div className={`w-12 h-12 rounded-2xl ${sec.color} flex items-center justify-center shrink-0 shadow-md`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-extrabold text-lg text-senda-purple-dark">
                  {sec.category}
                </h3>
              </div>

              <div className="space-y-4">
                {sec.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-gradient-to-br from-pink-50/60 to-purple-50/40 p-4 rounded-2xl border border-pink-100 space-y-3.5 hover:border-pink-300 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{item.name}</h4>
                      <span className="bg-white text-senda-pink font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-pink-200/80 shadow-xs shrink-0">
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-start space-x-2 text-xs text-slate-600">
                      <RiMapPinLine className="w-4 h-4 text-senda-pink shrink-0 mt-0.5" />
                      <span>{item.address}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-pink-100/60">
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        className="text-xs font-extrabold text-senda-purple hover:text-senda-pink flex items-center gap-1.5 py-1 px-2.5 bg-white rounded-lg border border-pink-200/60 hover:shadow-xs transition-all"
                      >
                        <RiPhoneFill className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.phone}</span>
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(item.name + ' ' + item.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-extrabold text-slate-600 hover:text-senda-pink flex items-center gap-1.5 transition-colors"
                      >
                        <span>Cómo llegar</span>
                        <RiCompass3Line className="w-4 h-4 text-senda-pink" />
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
