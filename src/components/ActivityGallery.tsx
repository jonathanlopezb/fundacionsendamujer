'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ActivityItem {
  id: number;
  category: string;
  title: string;
  date: string;
  location: string;
  image: string;
  desc: string;
  participants: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    category: 'Salud & Ginecología',
    title: 'Jornada Médica y Tamizaje Ginecológico en Arroz Barato',
    date: 'Febrero 2026',
    location: 'Sector La Pista, Arroz Barato — Localidad 3',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    desc: 'Atención médica integral, tomas de citología cérvico-uterina, asesoría en métodos anticonceptivos y entrega de medicamentos esenciales para más de 120 mujeres y familias.',
    participants: '124 mujeres atendidas',
  },
  {
    id: 2,
    category: 'Maternidad con Apoyo',
    title: 'Entrega de Kits Materno-Nutricionales y Taller de Lactancia',
    date: 'Enero 2026',
    location: 'Sede Fundación Senda Mujer Cartagena',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
    desc: 'Dotación de pañales, cobijas, suplementos vitamínicos y acompañamiento psicoafectivo para madres gestantes y lactantes en situación de extrema vulnerabilidad.',
    participants: '48 madres y bebés',
  },
  {
    id: 3,
    category: 'Capacitación & Emprendimiento',
    title: 'Graduación Taller de Confección Textil y Patronaje Digital',
    date: 'Enero 2026',
    location: 'Casa de Justicia Chiquinquirá — Cartagena',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    desc: 'Entrega de certificados técnicos avalados y máquinas de coser como capital semilla para consolidar microemprendimientos comunitarios independientes.',
    participants: '32 mujeres graduadas',
  },
  {
    id: 4,
    category: 'Derechos & Protección',
    title: 'Círculo Comunitario de Prevención de Violencias Basadas en Género',
    date: 'Diciembre 2025',
    location: 'Barrio Nelson Mandela — Localidad 4',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
    desc: 'Encuentro con lideresas comunitarias para socializar rutas de denuncia ante comisarías, Fiscalía y activación de medidas cautelares de protección sin costo.',
    participants: '85 lideresas y jóvenes',
  },
  {
    id: 5,
    category: 'Salud Mental',
    title: 'Círculos de Sanación Emocional y Apoyo entre Pares',
    date: 'Noviembre 2025',
    location: 'Barrio El Pozón — Cartagena',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    desc: 'Espacio guiado por psicólogas clínicas voluntarias para el manejo del duelo, superación del trauma y reconstrucción de la autoestima personal.',
    participants: '60 participantes',
  },
  {
    id: 6,
    category: 'Infancia & Bienestar',
    title: 'Brigada Odontológica Infantil y Vacunación PAI',
    date: 'Octubre 2025',
    location: 'Comunidad de Mamonal y Bahía',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    desc: 'Jornada de profilaxis dental, aplicación de flúor y puesta al día del esquema de vacunación para niños y niñas de familias vulnerables.',
    participants: '95 niños y niñas',
  },
];

export default function ActivityGallery() {
  const [filter, setFilter] = useState('Todas');

  const categories = ['Todas', 'Salud & Ginecología', 'Maternidad con Apoyo', 'Capacitación & Emprendimiento', 'Derechos & Protección'];

  const filteredItems = filter === 'Todas'
    ? ACTIVITIES
    : ACTIVITIES.filter((item) => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block bg-pink-100 text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          Galería de Impacto Social en Terreno
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-senda-purple-dark tracking-tight">
          Lo que construimos juntas
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Cada fotografía documenta una vida transformada en las comunidades de Cartagena. Nuestras jornadas médicas, círculos de contención y talleres de independencia económica en barrios como Arroz Barato, Nelson Mandela y El Pozón.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex justify-center flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === cat
                ? 'bg-senda-pink text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-pink-50 border border-pink-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            {/* Photo Card */}
            <div className="relative w-full h-60 overflow-hidden bg-slate-900">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
              
              <span className="absolute top-4 left-4 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {item.category}
              </span>

              <span className="absolute bottom-3 left-4 bg-black/60 text-pink-200 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                {item.participants}
              </span>
            </div>

            {/* Information */}
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                  <span>{item.date}</span>
                  <span className="text-senda-purple font-bold truncate max-w-[160px] text-right">
                    {item.location}
                  </span>
                </div>

                <h3 className="font-black text-base sm:text-lg text-senda-purple-dark leading-snug group-hover:text-senda-pink transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-pink-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Fundación Senda Mujer</span>
                <span className="text-senda-pink font-bold">Cartagena D.T. y C.</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
