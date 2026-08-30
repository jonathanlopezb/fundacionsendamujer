'use client';

import React from 'react';
import { TrendingDown, DollarSign, HeartPulse, Target, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

export default function BeneficiaryDashboardCharts() {
  return (
    <div className="space-y-6">

      {/* TOP ROW: 2 CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CHART 1: EVOLUCIÓN SENDA INDEX (TREND LINE SVG) */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-[#E12880] uppercase tracking-wider">INDICADOR DE VULNERABILIDAD</span>
              <h3 className="text-lg font-black text-[#52166F]">Evolución del SENDA Index (90 Días)</h3>
              <p className="text-xs text-slate-500">A menor valor, mayor nivel de autonomía y seguridad personal.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              -56% Vulnerabilidad
            </div>
          </div>

          {/* SVG Trend Line */}
          <div className="bg-gradient-to-b from-pink-50/50 to-purple-50/30 rounded-2xl p-4 border border-pink-100 relative">
            <svg viewBox="0 0 400 150" className="w-full h-44 overflow-visible">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="#E2E8F0" strokeDasharray="4" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#E2E8F0" strokeDasharray="4" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="#E2E8F0" strokeDasharray="4" />

              {/* Area gradient under path */}
              <defs>
                <linearGradient id="sendaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E12880" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#52166F" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 60,30 L 200,70 L 340,110 L 340,140 L 60,140 Z"
                fill="url(#sendaGrad)"
              />

              {/* Trend Path */}
              <path
                d="M 60,30 L 200,70 L 340,110"
                fill="none"
                stroke="#E12880"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Data points */}
              {/* Point 1: Ingreso 78 */}
              <circle cx="60" cy="30" r="7" fill="#E12880" stroke="#FFFFFF" strokeWidth="3" />
              <text x="60" y="15" textAnchor="middle" fill="#52166F" fontSize="11" fontWeight="bold">78 pts (Ingreso)</text>

              {/* Point 2: 30 Días 52 */}
              <circle cx="200" cy="70" r="7" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="3" />
              <text x="200" y="55" textAnchor="middle" fill="#52166F" fontSize="11" fontWeight="bold">52 pts (Día 30)</text>

              {/* Point 3: Actual 34 */}
              <circle cx="340" cy="110" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
              <text x="340" y="95" textAnchor="middle" fill="#10B981" fontSize="12" fontWeight="extrabold">34 pts (Actual)</text>
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 bg-pink-50 p-3 rounded-xl border border-pink-100">
            <span>Diagnóstico de Ingreso: <strong className="text-red-600">78 pts</strong></span>
            <span>Avance Actual: <strong className="text-emerald-700">34 pts (Autónoma)</strong></span>
          </div>
        </div>

        {/* CHART 2: CAPITAL SEMILLA & VENTAS MES A MES (BAR CHART SVG) */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">FONDO EMPRENDIMIENTO TEXTIL</span>
              <h3 className="text-lg font-black text-[#52166F]">Desembolso & Ventas Mensuales</h3>
              <p className="text-xs text-slate-500">Capital otorgado: $2.500.000 COP • Maquinaria e Insumos</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-extrabold">
              $1.25M Ventas Mes 3
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="bg-gradient-to-b from-[#270538]/5 to-[#180325]/10 rounded-2xl p-4 border border-purple-100">
            <svg viewBox="0 0 400 150" className="w-full h-44">
              {/* Bars */}
              {/* Bar 1: Mes 1 ($450k) */}
              <rect x="50" y="90" width="40" height="40" rx="8" fill="#C084FC" />
              <text x="70" y="82" textAnchor="middle" fill="#52166F" fontSize="10" fontWeight="bold">$450K</text>
              <text x="70" y="145" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold">Mes 1</text>

              {/* Bar 2: Mes 2 ($820k) */}
              <rect x="150" y="55" width="40" height="75" rx="8" fill="#A855F7" />
              <text x="170" y="47" textAnchor="middle" fill="#52166F" fontSize="10" fontWeight="bold">$820K</text>
              <text x="170" y="145" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold">Mes 2</text>

              {/* Bar 3: Mes 3 ($1.25M) */}
              <rect x="250" y="20" width="40" height="110" rx="8" fill="#E12880" />
              <text x="270" y="12" textAnchor="middle" fill="#E12880" fontSize="11" fontWeight="black">$1.25M</text>
              <text x="270" y="145" textAnchor="middle" fill="#E12880" fontSize="10" fontWeight="extrabold">Mes 3</text>

              {/* Baseline */}
              <line x1="30" y1="130" x2="370" y2="130" stroke="#CBD5E1" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-600 bg-purple-50 p-3 rounded-xl border border-purple-100">
            <span>Insumos Adquiridos: <strong>Fileteadora Industrial</strong></span>
            <span>Producción: <strong className="text-purple-800">140 Prendas</strong></span>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: DONUT CHART + GOALS RADIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* DONUT CHART: ATENCIÓN POR ESPECIALIDADES */}
        <div className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-[#52166F]">Distribución de Atención</h3>
          <p className="text-xs text-slate-500">Sesiones y consultas especializadas realizadas</p>

          <div className="flex items-center justify-center relative py-2">
            <svg viewBox="0 0 100 100" className="w-36 h-36 rotate-[-90deg]">
              {/* Segment 1: Ginecología 35% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#E12880" strokeWidth="16" strokeDasharray="83.5 155" />
              {/* Segment 2: Psicología 25% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8B5CF6" strokeWidth="16" strokeDasharray="59.6 179" strokeDashoffset="-83.5" />
              {/* Segment 3: Visita Domiciliaria 20% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="47.7 191" strokeDashoffset="-143.1" />
              {/* Segment 4: Odontología 20% */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="16" strokeDasharray="47.7 191" strokeDashoffset="-190.8" />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-extrabold text-[#52166F]">12</span>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">Sesiones</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#E12880]" /> Ginecología</span><strong className="text-slate-700">35%</strong></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Psicología</span><strong className="text-slate-700">25%</strong></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Visitas Domiciliarias</span><strong className="text-slate-700">20%</strong></div>
            <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Odontología</span><strong className="text-slate-700">20%</strong></div>
          </div>
        </div>

        {/* METAS Y CUMPLIMIENTO RADIAL (2 COLS SPAN) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-pink-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">CUMPLIMIENTO DE METAS</span>
              <h3 className="text-lg font-black text-[#52166F]">Progreso de Empoderamiento Personal</h3>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              4 Metas Asignadas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { label: 'Emprendimiento Textil', pct: 85, color: '#E12880', icon: '🧵' },
              { label: 'Salud Reproductiva', pct: 100, color: '#10B981', icon: '⚕️' },
              { label: 'Formación Digital', pct: 90, color: '#8B5CF6', icon: '🎓' },
              { label: 'Fortaleza Emocional', pct: 75, color: '#F59E0B', icon: '🧠' },
            ].map((m, i) => (
              <div key={i} className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100 text-center space-y-2">
                <span className="text-2xl">{m.icon}</span>
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="3.5"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${m.pct}, 100`}
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-slate-800">{m.pct}%</span>
                </div>
                <p className="text-[11px] font-extrabold text-slate-700 leading-tight">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Monitoreo continuo realizado por el equipo psicosocial de la <strong>Fundación Senda Mujer</strong> en Cartagena.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
