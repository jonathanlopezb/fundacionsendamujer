'use client';

import React, { useState } from 'react';
import { 
  RiHeart3Fill, 
  RiShieldCheckLine, 
  RiSparklesLine, 
  RiEmotionSmileLine, 
  RiStethoscopeLine, 
  RiHeartPulseLine, 
  RiScales3Line, 
  RiGraduationCapLine,
  RiCheckDoubleLine,
  RiHandHeartLine,
  RiLock2Line,
  RiBankCardLine,
  RiArrowRightLine
} from 'react-icons/ri';
import confetti from 'canvas-confetti';
import { IconType } from 'react-icons';

export interface ImpactOption {
  id: string;
  title: string;
  costCOP: number;
  icon: IconType;
  badge: string;
  desc: string;
}

const IMPACT_OPTIONS: ImpactOption[] = [
  {
    id: 'Kit Maternidad',
    title: 'Kit Maternidad Elegida',
    costCOP: 120000,
    icon: RiHeartPulseLine,
    badge: 'Nutrición & Cuidado',
    desc: 'Incluye pañales, cobijita, mudas de ropa, biberón y fórmula nutricional para el primer mes.',
  },
  {
    id: 'Consulta Odontológica',
    title: 'Consulta Odontológica Integral',
    costCOP: 80000,
    icon: RiEmotionSmileLine,
    badge: 'Salud Oral',
    desc: 'Atención odontológica preventiva, profilaxis y salud oral para una beneficiaria.',
  },
  {
    id: 'Sesión Psicológica',
    title: 'Sesión Psicológica Individual',
    costCOP: 60000,
    icon: RiStethoscopeLine,
    badge: 'Salud Mental',
    desc: 'Contención emocional de crisis y 1 hora de terapia profesional.',
  },
  {
    id: 'Asesoría Jurídica',
    title: 'Asesoría Jurídica VBG',
    costCOP: 100000,
    icon: RiScales3Line,
    badge: 'Protección Legal',
    desc: 'Acompañamiento legal completo y tramitación de medidas de protección.',
  },
  {
    id: 'Beca Emprendimiento',
    title: 'Beca Capacitación & Insumos',
    costCOP: 250000,
    icon: RiGraduationCapLine,
    badge: 'Autonomía Económica',
    desc: 'Cubre materiales de estudio y kit inicial de emprendimiento productivo.',
  },
];

export default function DonationCalculator() {
  const [selectedImpact, setSelectedImpact] = useState<ImpactOption>(IMPACT_OPTIONS[0]);
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
      <div className="bg-white rounded-3xl border border-pink-200/80 shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-senda-purple-dark via-[#52166F] to-senda-pink text-white p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              <RiHeart3Fill className="w-3.5 h-3.5 text-amber-300" />
              <span>Portal de Micro-Mecenazgo Transparente 1 a 1</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Patrocina una Vida en Cartagena
            </h2>
            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed max-w-2xl">
              Tú eliges exactamente qué ayuda entregar. Cada aporte se transforma directamente en salud, protección jurídica o dignidad para una mujer en situación de vulnerabilidad.
            </p>
          </div>
        </div>

        {successReceipt ? (
          <div className="p-8 sm:p-12 space-y-6 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto text-slate-950 shadow-xl">
              <RiHeart3Fill className="w-10 h-10 text-slate-950" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-senda-purple-dark">
              ¡Gracias por tu Transformador Aporte!
            </h3>

            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Has patrocinado <strong className="text-senda-pink">{units} unidad(es) de {selectedImpact.title}</strong> por un valor total de <strong className="text-slate-900">${totalAmount.toLocaleString('es-CO')} COP</strong>.
            </p>

            <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200 text-xs font-bold text-senda-purple max-w-sm mx-auto flex items-center justify-center gap-2">
              <RiShieldCheckLine className="w-4 h-4 text-emerald-600" />
              <span>Certificado de Impacto #: {successReceipt.receiptId || 'SM-884920'}</span>
            </div>

            <button
              onClick={() => setSuccessReceipt(null)}
              className="bg-gradient-to-r from-senda-purple to-senda-pink text-white font-extrabold px-8 py-3 rounded-full text-xs hover:shadow-lg transition-all cursor-pointer"
            >
              Realizar otro mecenazgo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            
            {/* Impact Cards Grid */}
            <div className="space-y-4">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <RiSparklesLine className="w-4 h-4 text-amber-500" />
                <span>1. Selecciona el Impacto Directo que deseas Financiar *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {IMPACT_OPTIONS.map((impact) => {
                  const IconComponent = impact.icon;
                  const isSelected = selectedImpact.id === impact.id;

                  return (
                    <button
                      key={impact.id}
                      type="button"
                      onClick={() => setSelectedImpact(impact)}
                      className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer group ${
                        isSelected
                          ? 'border-senda-pink bg-pink-50/90 ring-2 ring-senda-pink shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-pink-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-senda-pink text-white shadow-sm' : 'bg-pink-100 text-senda-pink group-hover:scale-110'} transition-transform`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-xs text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                          ${impact.costCOP.toLocaleString('es-CO')} COP
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-senda-purple-dark group-hover:text-senda-pink transition-colors">
                          {impact.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {impact.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Units counter */}
            <div className="bg-gradient-to-r from-pink-50/90 via-purple-50/60 to-pink-50/90 p-6 rounded-3xl border border-pink-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-inner">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-bold text-slate-600 block">¿Cuántas mujeres deseas beneficiar?</span>
                <span className="text-base sm:text-lg font-extrabold text-senda-purple-dark">
                  {units} x {selectedImpact.title}
                </span>
              </div>

              <div className="flex items-center space-x-3 bg-white p-1.5 rounded-full border border-pink-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => setUnits(Math.max(1, units - 1))}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 border border-slate-200 font-extrabold text-lg text-senda-purple transition-all flex items-center justify-center cursor-pointer active:scale-95"
                >
                  -
                </button>
                <span className="font-extrabold text-base w-8 text-center text-slate-900">{units}</span>
                <button
                  type="button"
                  onClick={() => setUnits(units + 1)}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 border border-slate-200 font-extrabold text-lg text-senda-purple transition-all flex items-center justify-center cursor-pointer active:scale-95"
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
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-xs disabled:bg-slate-100 transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-senda-pink text-xs transition-colors"
                />
              </div>
            </div>

            {/* Anonymous checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anon"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-senda-pink rounded focus:ring-senda-pink accent-pink-600 cursor-pointer"
              />
              <label htmlFor="anon" className="text-xs text-slate-600 font-semibold cursor-pointer select-none">
                Deseo que mi donación sea 100% Anónima
              </label>
            </div>

            {/* Submit Bar */}
            <div className="pt-6 border-t border-pink-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Total Aporte de Impacto:</span>
                <span className="text-2xl sm:text-3xl font-black text-senda-pink">
                  ${totalAmount.toLocaleString('es-CO')} COP
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-pink-500 to-senda-purple hover:from-amber-300 hover:to-senda-pink text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                {isSubmitting ? (
                  <span>Procesando mecenazgo...</span>
                ) : (
                  <>
                    <RiHandHeartLine className="w-5 h-5 text-slate-950" />
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
