'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Heart, Scale, Users, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import AlliesSection from '@/components/AlliesSection';

export default function NosotrosPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="bg-senda-purple-light text-senda-purple font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
          Fundación Senda Mujer — Cartagena de Indias
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-senda-purple-dark">
          Nuestra Misión, Objeto Social & Principios
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Nacemos con el firme compromiso de velar porque ninguna mujer o niña en situación de vulnerabilidad en Cartagena tenga que enfrentar sola un camino difícil o adverso.
        </p>
      </div>

      {/* Objeto Social Section */}
      <div className="bg-white rounded-3xl border border-pink-200 p-8 sm:p-12 shadow-md space-y-6">
        <div className="flex items-center space-x-3 text-senda-pink font-extrabold text-sm uppercase tracking-wider">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>1. Objeto Social Estatutario</span>
        </div>
        <h2 className="text-2xl font-extrabold text-senda-purple-dark leading-snug">
          Acompañamiento, Protección y Fortalecimiento Integral
        </h2>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          Fundación para el acompañamiento, protección y fortalecimiento integral de mujeres y niñas en situación de vulnerabilidad, especialmente aquellas que enfrentan embarazos no deseados, embarazos derivados de violencia sexual, violencia basada en género, pobreza, exclusión social o ausencia de redes de apoyo, mediante orientación social, acompañamiento psicosocial, educación, orientación en derechos, articulación institucional, fortalecimiento familiar, prevención y promoción de los derechos sexuales y reproductivos, y construcción de alternativas de vida digna.
        </p>
        <div className="bg-pink-50 p-6 rounded-2xl border-l-4 border-senda-pink text-senda-purple font-bold text-sm">
          &ldquo;La Fundación buscará que ninguna mujer vulnerable tenga que enfrentar sola un embarazo producto de circunstancias adversas, violencia o falta de oportunidades.&rdquo;
        </div>
      </div>

      {/* Beneficiarias */}
      <div className="space-y-8">
        <h2 className="text-2xl font-extrabold text-senda-purple-dark text-center">
          2. Población Beneficiaria
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Mujeres y adolescentes en situación de pobreza o vulnerabilidad socioeconómica.',
            'Mujeres que enfrentan embarazos no planeados o no deseados.',
            'Mujeres y niñas víctimas de violencia sexual (acceso carnal violento, abusos, explotación).',
            'Mujeres víctimas de violencia basada en género (VBG) y violencia intrafamiliar.',
            'Madres cabeza de hogar en contexto de vulnerabilidad.',
            'Mujeres sin redes familiares o sociales de apoyo en Cartagena.',
            'Mujeres víctimas de desplazamiento forzado o exclusión social.',
            'Adolescentes y jóvenes con riesgo de embarazo no intencional.',
            'Familias que requieran acompañamiento integral en contextos de maternidad o adopción.',
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-senda-pink shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enfoque Integral & Marco Legal */}
      <div className="bg-gradient-to-r from-senda-purple-dark to-senda-purple text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
        <h2 className="text-2xl font-extrabold text-amber-300 flex items-center gap-2">
          <Scale className="w-6 h-6" />
          3. Marco Legal y Respeto a la Autonomía de la Mujer
        </h2>
        <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
          No limitamos estatutariamente la Fundación únicamente a mujeres que quieran interrumpir un embarazo. Acompañamos con igual dedicación y amor a quienes decidan continuar con él, ofreciendo nutrición, redes de apoyo, fortalecimiento familiar y orientación sobre adopción.
        </p>
        <div className="bg-white/10 p-6 rounded-2xl border border-white/20 text-xs text-pink-100 space-y-2">
          <p className="font-bold text-white">Jurisprudencia Colombiana de Referencia:</p>
          <p>
            • <strong>Sentencia C-055 de 2022:</strong> El aborto consentido no es punible cuando se realiza antes de la semana 24 de gestación.
          </p>
          <p>
            • <strong>Sentencia C-355 de 2006:</strong> Mantiene las tres causales sin límite de tiempo (riesgo para la vida/salud física o mental, malformación incompatible con la vida, o violencia sexual).
          </p>
        </div>
      </div>

      {/* Principios Fundamentales */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-extrabold text-senda-purple-dark">
          4. Nuestros Principios Fundamentales
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            'Dignidad Humana',
            'Autonomía de la Mujer',
            'Confidencialidad Absoluta',
            'No Discriminación',
            'Enfoque de Género',
            'Enfoque Diferencial',
            'Derechos Humanos',
            'Protección Integral',
          ].map((prin, idx) => (
            <div key={idx} className="bg-pink-50 p-4 rounded-2xl font-extrabold text-xs text-senda-purple border border-pink-200">
              {prin}
            </div>
          ))}
        </div>
      </div>

      {/* Red de Aliados Institucionales */}
      <div className="-mx-6 -mb-12">
        <AlliesSection />
      </div>

    </div>
  );
}
