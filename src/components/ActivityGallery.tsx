'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, MapPin, Calendar, Heart, Sparkles, Filter } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'Salud & Ginecología',
    title: 'Jornada de Salud Ginecológica & Ecografías en Olaya Herrera',
    date: '18 Agosto 2026',
    location: 'Sector Central, Olaya Herrera - Cartagena',
    image: '/logo.png',
    desc: 'Atención médica gratuita, ecografías y kit de cuidado ginecológico para 65 mujeres de la comunidad.',
  },
  {
    id: 2,
    category: 'Maternidad con Apoyo',
    title: 'Entrega de Kits Maternal & Nutrición para Madres',
    date: '10 Agosto 2026',
    location: 'Sede Fundación Senda Mujer Cartagena',
    image: '/logo.png',
    desc: 'Entrega de pañales, cobijas y fórmula láctea para mujeres acompañadas en el programa Embarazo con Apoyo.',
  },
  {
    id: 3,
    category: 'Capacitación & Emprendimiento',
    title: 'Graduación del Taller de Confección & Diseño Textil',
    date: '02 Agosto 2026',
    location: 'Casa de Justicia Chiquinquirá',
    image: '/logo.png',
    desc: '24 beneficiarias recibieron sus máquinas de coser y diploma de graduación en emprendimiento textil.',
  },
  {
    id: 4,
    category: 'Derechos & Justicia',
    title: 'Taller de Prevención de VBG y Medidas de Protección',
    date: '25 Julio 2026',
    location: 'Barrio El Pozón - Cartagena',
    image: '/logo.png',
    desc: 'Capacitación legal con abogadas aliadas sobre cómo acudir a comisarías de familia e instituciones.',
  },
];

export default function ActivityGallery() {
  const [filter, setFilter] = useState('Todas');

  const filteredItems = filter === 'Todas'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-senda-purple-light text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          Galería de Impacto Social en Cartagena
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-senda-purple-dark">
          Actividades, Jornadas & Historias de Transformación
        </h1>
        <p className="text-sm text-slate-600">
          Un recorrido visual por nuestras jornadas de ginecología en barrios vulnerables, entregas de kits de maternidad y graduaciones en Cartagena.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-3">
        {['Todas', 'Salud & Ginecología', 'Maternidad con Apoyo', 'Capacitación & Emprendimiento', 'Derechos & Justicia'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === cat
                ? 'bg-senda-pink text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="relative w-full h-56 bg-gradient-to-br from-senda-purple-dark to-senda-purple p-6 flex items-center justify-center">
              <div className="relative w-48 h-32">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain filter drop-shadow-md"
                />
              </div>
              <span className="absolute top-4 left-4 bg-amber-400 text-senda-purple-dark font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-senda-pink" />
                  {item.date}
                </span>
                <span className="flex items-center gap-1 text-senda-purple font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {item.location}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-senda-purple-dark leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
