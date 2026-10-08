'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Award, HeartHandshake, CheckCircle2, Package, Sparkles } from 'lucide-react';

export default function CrmImpactoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpact() {
      try {
        setLoading(true);
        const res = await fetch('/api/crm/impact');
        if (res.ok) {
          const json = await res.json();
          setData(json.impact);
        }
      } catch (err) {
        console.error('Error al cargar impacto:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchImpact();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-900 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const camLines = data?.camEnrollmentsByLine || [];
  const aidTypes = data?.aidDeliveriesByType || [];
  const casesOutcome = data?.casesByOutcome || [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-rose-400" />
          Observatorio de Impacto Social & Autonomía
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Métricas consolidadas anonimizadas para rendición de cuentas a donantes, juntas directivas y cooperantes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Mujeres Acompañadas</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{data?.totalWomenServed || 0}</div>
          <p className="text-[11px] text-slate-500 mt-1">Con consentimiento Habeas Data</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Horas de Voluntariado</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{data?.volunteering?.totalHours || 0} hrs</div>
          <p className="text-[11px] text-slate-500 mt-1">Aportadas por voluntarias</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Casos con Resolución Exitosa</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {casesOutcome.reduce((acc: number, c: any) => acc + c.total, 0)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Acompañamiento integral cerrado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución Líneas CAM */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            Participación por Línea Productiva CAM
          </h3>

          {camLines.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No hay datos de inscripción todavía.</p>
          ) : (
            <div className="space-y-3">
              {camLines.map((line: any) => (
                <div key={line._id} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold">{line._id || 'Línea Productiva'}</span>
                    <span className="font-mono font-bold text-teal-400">{line.count} mujeres</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, line.count * 15)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ayudas Humanitarias y Dotaciones */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            Dotaciones & Ayudas Entregadas
          </h3>

          {aidTypes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No hay entregas registradas todavía.</p>
          ) : (
            <div className="space-y-3">
              {aidTypes.map((aid: any) => (
                <div key={aid._id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{aid._id}</span>
                    <span className="text-[11px] text-slate-400">{aid.totalCount} unidades entregadas</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    ${Number(aid.totalValue || 0).toLocaleString('es-CO')} COP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
