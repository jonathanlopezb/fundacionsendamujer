'use client';

import React, { useEffect, useState } from 'react';
import { EyeOff, ArrowLeft, Heart, Leaf, Wind, Sun, Star, Moon, Flower, Smile } from 'lucide-react';

interface CamouflageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ARTICLES = [
  {
    category: 'Bienestar',
    icon: '🌿',
    title: 'Técnicas de Respiración para Reducir el Estrés',
    desc: 'Aprende ejercicios de respiración diafragmática que puedes practicar en cualquier momento del día para recuperar la calma.',
    time: '3 min lectura',
  },
  {
    category: 'Nutrición',
    icon: '🥗',
    title: '10 Alimentos que Mejoran tu Estado de Ánimo',
    desc: 'La alimentación tiene un impacto directo en el cerebro. Descubre cuáles incluir en tu dieta para sentirte mejor.',
    time: '5 min lectura',
  },
  {
    category: 'Movimiento',
    icon: '🧘',
    title: 'Yoga en Casa: Rutina de 15 Minutos',
    desc: 'Una secuencia simple de posturas que puedes hacer sin equipo especial para relajar el cuerpo y la mente.',
    time: '4 min lectura',
  },
  {
    category: 'Sueño',
    icon: '😴',
    title: 'Cómo Mejorar la Calidad del Sueño Naturalmente',
    desc: 'Hábitos nocturnos que te ayudarán a conciliar el sueño más rápido y despertar con más energía.',
    time: '4 min lectura',
  },
  {
    category: 'Mindfulness',
    icon: '🌸',
    title: 'Meditación Guiada para Principiantes',
    desc: 'Cinco minutos al día de meditación pueden transformar tu relación contigo misma y tu nivel de estrés.',
    time: '6 min lectura',
  },
  {
    category: 'Autoestima',
    icon: '💛',
    title: 'Afirmaciones Positivas que Cambian tu Perspectiva',
    desc: 'Pequeñas frases que, al repetirlas, fortalecen tu autoconfianza y te recuerdan tu valor como persona.',
    time: '3 min lectura',
  },
];

const TABS = ['Bienestar', 'Nutrición', 'Mindfulness'] as const;
type Tab = typeof TABS[number];

export default function CamouflageOverlay({ isOpen, onClose }: CamouflageOverlayProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Bienestar');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F5F9F5] text-slate-800 overflow-y-auto font-sans animate-fadeIn">
      
      {/* Header */}
      <header className="bg-white border-b border-green-100 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-800 tracking-tight">Senda Bienestar</h1>
            <p className="text-[10px] text-slate-400">Tu espacio de cuidado personal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            <EyeOff className="w-3 h-3" />
            Navegación Privada Activa
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Fundación Senda Mujer
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            🌱 Bienestar Integral Femenino
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">Cuídate Hoy — Mereces Sentirte Bien</h2>
          <p className="text-green-100 text-sm max-w-xl">
            Recursos de salud mental, nutrición y bienestar para mujeres. Todo en un solo lugar, de forma discreta y privada.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-green-100 pb-3 mb-8 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-bold text-sm px-5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab ? 'bg-green-600 text-white shadow-sm' : 'text-green-800 hover:bg-green-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((art, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-green-50 overflow-hidden hover:shadow-md transition-all group cursor-pointer">
              <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform">{art.icon}</span>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center text-xs text-green-700 font-semibold mb-2">
                  <span className="bg-green-100 px-2 py-0.5 rounded-full">{art.category}</span>
                  <span>{art.time}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-2 group-hover:text-green-700 transition-colors">{art.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{art.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Exit Bar */}
        <div className="mt-12 p-4 bg-white rounded-2xl border border-green-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span>Esta página está protegiendo tu privacidad. Presiona <kbd className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">ESC</kbd> para salir.</span>
          </div>
          <button
            onClick={onClose}
            className="text-sm font-bold text-green-700 border border-green-200 px-5 py-2 rounded-full hover:bg-green-50 transition-colors cursor-pointer"
          >
            Volver a Fundación Senda Mujer
          </button>
        </div>
      </div>
    </div>
  );
}
