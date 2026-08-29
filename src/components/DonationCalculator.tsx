'use client';

import React, { useState } from 'react';
import { Heart, ShieldCheck, Sparkles, CheckCircle2, Smile, Stethoscope, Baby, Scale, GraduationCap } from 'lucide-react';
import confetti from 'canvas-confetti';

const IMPACT_OPTIONS = [
  {
    id: 'Kit Maternidad',
    title: 'Kit Maternidad Elegida',
    costCOP: 120000,
    icon: Baby,
    desc: 'Incluye pañales, cobijita, mudas de ropa, biberón y fórmula nutricional para el primer mes.',
  },
  {
    id: 'Consulta Odontológica',
    title: 'Consulta Odontológica Integral',
    costCOP: 80000,
    icon: Smile,
    desc: 'Atención odontológica preventiva, profilaxis y salud oral para una beneficiaria.',
  },
  {
    id: 'Sesión Psicológica',
    title: 'Sesión Psicológica Individual',
    costCOP: 60000,
    icon: Stethoscope,
    desc: 'Contención emocional de crisis y 1 hora de terapia profesional.',
  },
  {
    id: 'Asesoría Jurídica',
    title: 'Asesoría Jurídica VBG',
    costCOP: 100000,
    icon: Scale,
    desc: 'Acompañamiento legal completo y tramitación de medidas de protección.',
  },
  {
    id: 'Beca Emprendimiento',
    title: 'Beca Capacitación & Insumos',
    costCOP: 250000,
    icon: GraduationCap,
    desc: 'Cubre materiales de estudio y kit inicial de emprendimiento productivo.',
  },
];

export default function DonationCalculator() {
  const [selectedImpact, setSelectedImpact] = useState(IMPACT_OPTIONS[0]);
  const [units, setUnits] = useState(1);
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any>(null);

  const totalAmount = selectedImpact.costCOP * units;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: isAnonymous ? 'Donante Anónimo' : donorName || 'Amigo de la Fundación',
          email,
          amountCOP: totalAmount,
          impactType: selectedImpact.id,
          unitsSponsored: units,
          isAnonymous,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessReceipt(data.donation);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } catch (err) {
      console.error('Error registrando donación:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl border border-pink-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-senda-purple-dark via-senda-purple to-senda-pink text-white p-6 sm:p-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
            <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Portal de Micro-Mecenazgo Transparente 1 a 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Patrocina una Vida en Cartagena
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-2 max-w-2xl">
            Tú eliges exactamente qué ayuda entregar. Cada aporte se transforma directamente en salud, protección jurídica o dignidad para una mujer en situación de vulnerabilidad.
          </p>
        </div>

        {successReceipt ? (
          <div className="p-8 sm:p-12 space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
              <Heart className="w-10 h-10 fill-amber-500 text-amber-500" />
            </div>

            <h3 className="text-2xl font-extrabold text-senda-purple-dark">
              ¡Gracias por tu Transformador Aporte!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Has patrocinado <strong className="text-senda-pink">{units} unit(s) de {selectedImpact.title}</strong> por un valor total de <strong>${totalAmount.toLocaleString('es-CO')} COP</strong>.
            </p>

            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 text-xs font-semibold text-senda-purple max-w-sm mx-auto">
              Certificado de Impacto #: {successReceipt.receiptId || 'SM-884920'}
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="bg-senda-purple text-white font-extrabold px-6 py-2.5 rounded-full text-xs hover:bg-senda-purple-dark transition-all"
            >
              Realizar otro mecenazgo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            
            {/* Impact Cards */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                1. Selecciona el Impacto Directo que deseas Financiar *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {IMPACT_OPTIONS.map((impact) => {
                  const Icon = impact.icon;
                  const isSelected = selectedImpact.id === impact.id;

                  return (
                    <button
                      key={impact.id}
                      type="button"
                      onClick={() => setSelectedImpact(impact)}
                      className={`p-4 rounded-2xl text-left border transition-all space-y-2 ${
                        isSelected
                          ? 'border-senda-pink bg-pink-50 ring-2 ring-senda-pink shadow-md'
                          : 'border-slate-200 hover:border-pink-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <Icon className="w-6 h-6 text-senda-pink" />
                        <span className="font-extrabold text-xs text-amber-600">
                          ${impact.costCOP.toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-senda-purple">{impact.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{impact.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Units counter */}
            <div className="bg-pink-50/70 p-6 rounded-2xl border border-pink-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs font-bold text-slate-600 block">¿Cuántas mujeres deseas beneficiar?</span>
                <span className="text-lg font-extrabold text-senda-purple">
                  {units} x {selectedImpact.title}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setUnits(Math.max(1, units - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-pink-300 font-extrabold text-lg text-senda-purple hover:bg-pink-100"
                >
                  -
                </button>
                <span className="font-extrabold text-base w-8 text-center">{units}</span>
                <button
                  type="button"
                  onClick={() => setUnits(units + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-pink-300 font-extrabold text-lg text-senda-purple hover:bg-pink-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Donor Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tu Nombre o Nombre de la Empresa *</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Ej: Catalina Gómez / Empresa Aliada"
                  disabled={isAnonymous}
                  required={!isAnonymous}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico (para Certificado) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej: catalina@ejemplo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-senda-pink rounded focus:ring-senda-pink"
              />
              <label htmlFor="anon" className="text-xs text-slate-600 font-semibold cursor-pointer">
                Deseo que mi donación sea 100% Anónima
              </label>
            </div>

            <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Aporte de Impacto:</span>
                <span className="text-2xl font-black text-senda-pink">
                  ${totalAmount.toLocaleString('es-CO')} COP
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-senda-pink text-white font-extrabold px-10 py-3.5 rounded-full text-sm shadow-lg hover:shadow-glow transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Patrocinar con Wompi / Nequi / Tarjeta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
