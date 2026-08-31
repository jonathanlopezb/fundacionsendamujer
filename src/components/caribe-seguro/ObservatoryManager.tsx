'use client';

/**
 * ObservatoryManager — Gestión real del Observatorio Caribe Seguro
 *
 * Permite al responsable de datos:
 * 1. Generar un snapshot desde datos reales de MongoDB
 * 2. Ver la lista de snapshots pendientes y aprobados
 * 3. Aprobar un snapshot para publicación pública
 */

import React, { useEffect, useState } from 'react';
import {
  BarChart3, RefreshCw, CheckCircle2, Clock, AlertTriangle,
  Play, Eye, Loader2, TrendingUp, Users, Shield
} from 'lucide-react';

interface SnapshotSummary {
  _id: string;
  period: string;
  periodType: string;
  approved: boolean;
  generatedAt: string;
  generatedBy: string;
  publishedAt: string | null;
  metrics: {
    mujeresAcompanadaTotal: number | null;
    mejoraPromedioIPSC_90d: number | null;
  };
}

interface GenerateResult {
  success: boolean;
  snapshot: { id: string; period: string; approved: boolean; metrics: any };
  summary: {
    mujeresAcompanadaTotal: number;
    mejoraPromedioIPSC_30d: number | null;
    mejoraPromedioIPSC_90d: number | null;
    dimensionMasFortalecida: string | null;
    dimensionMasDebil: string | null;
  };
  error?: string;
  currentCount?: number;
}

export default function ObservatoryManager() {
  const [snapshots, setSnapshots] = useState<SnapshotSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState('');

  // Form state para generar snapshot
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    const q = Math.ceil((now.getMonth() + 1) / 3);
    return `${now.getFullYear()}-Q${q}`;
  });
  const [periodType, setPeriodType] = useState<'mensual' | 'trimestral' | 'anual'>('trimestral');
  const [generatedBy, setGeneratedBy] = useState('');
  const [publicationNotes, setPublicationNotes] = useState('');
  const [approvedBy, setApprovedBy] = useState('');

  const fetchSnapshots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/caribe-seguro/observatory/generate');
      const data = await res.json();
      if (data.success) setSnapshots(data.snapshots);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSnapshots(); }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGenerateResult(null);

    if (!generatedBy.trim()) {
      setError('Ingresa el nombre del responsable de datos.');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/caribe-seguro/observatory/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, periodType, generatedBy, publicationNotes }),
      });
      const data: GenerateResult = await res.json();

      if (!res.ok) {
        if (data.currentCount !== undefined) {
          setError(`${data.error} (actual: ${data.currentCount} beneficiarias registradas)`);
        } else {
          setError(data.error || 'Error al generar snapshot.');
        }
        return;
      }

      setGenerateResult(data);
      await fetchSnapshots();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (snapshotId: string) => {
    if (!approvedBy.trim()) {
      setError('Ingresa el nombre de quien aprueba la publicación.');
      return;
    }
    setError('');
    setApprovingId(snapshotId);
    try {
      const res = await fetch('/api/caribe-seguro/observatory/generate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snapshotId, approvedBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchSnapshots();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] rounded-2xl p-5 text-white">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300">RESPONSABLE DE DATOS</span>
        <h3 className="text-xl font-black mt-0.5">Gestión del Observatorio Caribe Seguro</h3>
        <p className="text-xs text-pink-200 mt-0.5">
          Genera snapshots desde datos reales de MongoDB y apruébalos para publicación. Ninguna cifra es estimada.
        </p>
      </div>

      {/* Generar nuevo snapshot */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-pink-200 p-6 space-y-4 shadow-sm">
        <h4 className="font-extrabold text-[#52166F] text-base flex items-center gap-2">
          <Play className="w-4 h-4 text-[#E12880]" />
          Generar Snapshot desde Datos Reales
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Periodo *</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="Ej: 2026-Q3 ó 2026-09"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Tipo de periodo *</label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880] bg-white"
            >
              <option value="mensual">Mensual</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Responsable de datos *</label>
            <input
              type="text"
              value={generatedBy}
              onChange={(e) => setGeneratedBy(e.target.value)}
              placeholder="Nombre completo del responsable"
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Nota de publicación (opcional)</label>
            <input
              type="text"
              value={publicationNotes}
              onChange={(e) => setPublicationNotes(e.target.value)}
              placeholder="Contexto adicional del periodo..."
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 font-semibold">
          ℹ️ El sistema agregará automáticamente: total de beneficiarias únicas, citas atendidas, mejora IPSC promedio, dimensión más fortalecida/débil. Regla de privacidad: mínimo 5 beneficiarias registradas.
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={generating}
          className="w-full bg-gradient-to-r from-[#E12880] to-[#52166F] text-white font-extrabold py-3 rounded-full shadow-md cursor-pointer hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          {generating ? 'Calculando desde MongoDB...' : 'Generar Snapshot de Datos Reales'}
        </button>
      </form>

      {/* Resultado de la generación */}
      {generateResult?.success && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="font-extrabold text-emerald-900">✅ Snapshot generado desde datos reales de MongoDB</p>
              <p className="text-xs text-emerald-700">Periodo: <strong>{generateResult.snapshot.period}</strong> — Pendiente de aprobación para publicar</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-emerald-200">
              <p className="text-2xl font-black text-[#E12880]">{generateResult.summary.mujeresAcompanadaTotal}</p>
              <p className="text-[10px] text-slate-500 font-bold">Beneficiarias únicas</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-emerald-200">
              <p className="text-2xl font-black text-emerald-600">
                {generateResult.summary.mejoraPromedioIPSC_30d !== null ? `+${generateResult.summary.mejoraPromedioIPSC_30d}` : 'N/D'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold">Mejora IPSC 30d</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-emerald-200">
              <p className="text-2xl font-black text-[#52166F]">
                {generateResult.summary.mejoraPromedioIPSC_90d !== null ? `+${generateResult.summary.mejoraPromedioIPSC_90d}` : 'N/D'}
              </p>
              <p className="text-[10px] text-slate-500 font-bold">Mejora IPSC 90d</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-emerald-200">
              <p className="text-xs font-black text-amber-700 leading-tight">{generateResult.summary.dimensionMasFortalecida || 'N/D'}</p>
              <p className="text-[10px] text-slate-500 font-bold">Dim. más fortalecida</p>
            </div>
          </div>
        </div>
      )}

      {/* Aprobar snapshot */}
      <div className="bg-white rounded-2xl border border-pink-200 p-6 space-y-4 shadow-sm">
        <h4 className="font-extrabold text-[#52166F] text-base flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-600" />
          Aprobar para Publicación
        </h4>
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1.5">Nombre del responsable que aprueba *</label>
          <input
            type="text"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            placeholder="Nombre completo del responsable de datos"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E12880]"
          />
        </div>
      </div>

      {/* Lista de snapshots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-[#52166F] text-sm">Historial de Snapshots ({snapshots.length})</h4>
          <button
            type="button"
            onClick={fetchSnapshots}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 cursor-pointer hover:border-[#E12880]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Cargando snapshots...</span>
          </div>
        ) : snapshots.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
            <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No hay snapshots generados aún.</p>
            <p className="text-xs text-slate-400 mt-1">Genera el primero usando el formulario de arriba.</p>
          </div>
        ) : (
          snapshots.map((snap) => (
            <div
              key={snap._id}
              className={`rounded-2xl border-2 p-5 ${snap.approved ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${snap.approved ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'}`}>
                      {snap.approved ? '✅ Publicado' : '⏳ Pendiente de aprobación'}
                    </span>
                    <span className="text-xs font-bold text-slate-600 font-mono">{snap.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Generado por: <strong>{snap.generatedBy}</strong> — {new Date(snap.generatedAt).toLocaleDateString('es-CO')}
                  </p>
                  <div className="flex gap-4 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#E12880]" />
                      {snap.metrics?.mujeresAcompanadaTotal ?? 'N/D'} mujeres
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#52166F]" />
                      IPSC 90d: {snap.metrics?.mejoraPromedioIPSC_90d !== null && snap.metrics?.mejoraPromedioIPSC_90d !== undefined ? `+${snap.metrics.mejoraPromedioIPSC_90d}` : 'N/D'}
                    </span>
                  </div>
                </div>

                {!snap.approved && (
                  <button
                    type="button"
                    onClick={() => handleApprove(snap._id)}
                    disabled={approvingId === snap._id || !approvedBy.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {approvingId === snap._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Aprobar y Publicar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
