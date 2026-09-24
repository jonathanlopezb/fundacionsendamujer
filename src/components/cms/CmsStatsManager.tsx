'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Save, RefreshCw, CheckCircle2, AlertTriangle,
  Globe, Shield, BarChart3, ExternalLink, Sparkles, DollarSign,
  HeartHandshake, Users, ArrowRight
} from 'lucide-react';
import { CmsStatsData, DEFAULT_CMS_STATS } from '@/lib/cms-stats-service';

export default function CmsStatsManager() {
  const [formData, setFormData] = useState<CmsStatsData>(DEFAULT_CMS_STATS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar estadísticas iniciales
  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/stats');
      const data = await res.json();
      if (data.success && data.stats) {
        setFormData(data.stats);
      }
    } catch (err: any) {
      console.error('Error cargando estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleChange = (field: keyof CmsStatsData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch('/api/cms/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar');
      }

      setStatusMessage({
        type: 'success',
        text: '¡Cifras e indicadores guardados exitosamente y sincronizados con el Observatorio!',
      });
      if (data.stats) {
        setFormData(data.stats);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error al conectar con el servidor',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-purple-300">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-pink-400" />
        <p className="text-sm font-bold">Cargando cifras e indicadores del sistema...</p>
      </div>
    );
  }

  const costoPorRuta = formData.caribe_rutas_activadas > 0
    ? Math.round(formData.caribe_fondo_capital_cop / formData.caribe_rutas_activadas).toLocaleString('es-CO')
    : '—';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* HEADER DE CONTROL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-800/40">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-[#E12880]" />
            Editor de Cifras e Impacto Territorial
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            Modifica en tiempo real los contadores del Inicio, página de Caribe Seguro, Motor de Impacto y Observatorio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadStats}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Recargar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#E12880] hover:bg-[#c41070] text-white text-xs font-black shadow-lg shadow-pink-600/30 transition flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Guardando en BD…' : 'Guardar Todas las Cifras'}
          </button>
        </div>
      </div>

      {/* MENSAJE DE ESTADO */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          )}
          <span className="font-semibold">{statusMessage.text}</span>
        </div>
      )}

      {/* ── BLOQUE 1: CIFRAS DEL SITIO WEB PRINCIPAL ────────────────────── */}
      <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">1. Cifras de Impacto · Sitio Web Principal</h3>
              <p className="text-xs text-purple-300/70">
                Se muestran en la sección "Impacto verificable" del Home y pie de página.
              </p>
            </div>
          </div>
          <a
            href="/#impacto"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-pink-300 hover:text-white flex items-center gap-1 font-bold"
          >
            Ver en Home <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Contadores Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-2">
            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
              Mujeres Orientadas
            </label>
            <input
              type="text"
              value={formData.site_mujeres_orientadas}
              onChange={(e) => handleChange('site_mujeres_orientadas', e.target.value)}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-lg font-bold focus:outline-none focus:border-pink-500"
              placeholder="450+"
            />
            <span className="text-[10px] text-purple-400">Ejemplo: 450+, 500+, 1.200</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-2">
            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
              Rutas Activadas
            </label>
            <input
              type="text"
              value={formData.site_rutas_activadas}
              onChange={(e) => handleChange('site_rutas_activadas', e.target.value)}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-lg font-bold focus:outline-none focus:border-pink-500"
              placeholder="310+"
            />
            <span className="text-[10px] text-purple-400">Ejemplo: 310+, 350+</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-2">
            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
              Acciones de Apoyo
            </label>
            <input
              type="text"
              value={formData.site_acciones_apoyo}
              onChange={(e) => handleChange('site_acciones_apoyo', e.target.value)}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-lg font-bold focus:outline-none focus:border-pink-500"
              placeholder="180+"
            />
            <span className="text-[10px] text-purple-400">Ejemplo: 180+, 200+</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-2">
            <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
              Procesos de Autonomía
            </label>
            <input
              type="text"
              value={formData.site_procesos_autonomia}
              onChange={(e) => handleChange('site_procesos_autonomia', e.target.value)}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-lg font-bold focus:outline-none focus:border-pink-500"
              placeholder="65"
            />
            <span className="text-[10px] text-purple-400">Ejemplo: 65, 80</span>
          </div>
        </div>

        {/* Textos de la sección de Impacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Subtítulo Superior (Eyebrow)</label>
            <input
              type="text"
              value={formData.site_impact_eyebrow}
              onChange={(e) => handleChange('site_impact_eyebrow', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Título Principal</label>
            <input
              type="text"
              value={formData.site_impact_title}
              onChange={(e) => handleChange('site_impact_title', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Descripción / Mensaje</label>
            <input
              type="text"
              value={formData.site_impact_subtitle}
              onChange={(e) => handleChange('site_impact_subtitle', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Preview en vivo */}
        <div className="bg-[#180426] border border-purple-800/40 rounded-2xl p-5 mt-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E12880] block mb-3">
            Vista Previa de la Sección en el Home:
          </span>
          <div className="bg-[#203c3d] text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#f0d2a7] uppercase tracking-wider">{formData.site_impact_eyebrow}</span>
              <h4 className="text-2xl font-serif font-bold leading-tight">{formData.site_impact_title}</h4>
              <p className="text-xs text-[#d9e6e1]">{formData.site_impact_subtitle}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-full md:w-auto">
              <div className="text-center">
                <span className="text-xl font-bold text-[#f0d2a7] font-mono block">{formData.site_mujeres_orientadas}</span>
                <span className="text-[10px] text-[#d9e6e1]">Mujeres orientadas</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-[#f0d2a7] font-mono block">{formData.site_rutas_activadas}</span>
                <span className="text-[10px] text-[#d9e6e1]">Rutas activadas</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-[#f0d2a7] font-mono block">{formData.site_acciones_apoyo}</span>
                <span className="text-[10px] text-[#d9e6e1]">Acciones de apoyo</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-[#f0d2a7] font-mono block">{formData.site_procesos_autonomia}</span>
                <span className="text-[10px] text-[#d9e6e1]">Procesos autonomía</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BLOQUE 2: CIFRAS DEL PROGRAMA SENDA CARIBE & IMPACT ENGINE ──── */}
      <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">2. Cifras Programa Senda Caribe & Impact Engine</h3>
              <p className="text-xs text-purple-300/70">
                Alimentan el Observatorio Público, el Motor de Impacto (`/caribe-seguro/impacto`) y el portal de protección.
              </p>
            </div>
          </div>
          <a
            href="/caribe-seguro/impacto"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-pink-300 hover:text-white flex items-center gap-1 font-bold"
          >
            Ver Motor de Impacto <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Campos Numéricos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Total Mujeres Acompañadas (Caribe)
            </label>
            <input
              type="number"
              value={formData.caribe_mujeres_acompanadas}
              onChange={(e) => handleChange('caribe_mujeres_acompanadas', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Total en el periodo actual</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Rutas Completadas / Activadas
            </label>
            <input
              type="number"
              value={formData.caribe_rutas_activadas}
              onChange={(e) => handleChange('caribe_rutas_activadas', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Rutas institucionales y comunitarias</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Citas Psicosociales / Legales
            </label>
            <input
              type="number"
              value={formData.caribe_citas_realizadas}
              onChange={(e) => handleChange('caribe_citas_realizadas', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Atenciones individuales realizadas</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Talleres de Autonomía Realizados
            </label>
            <input
              type="number"
              value={formData.caribe_talleres_realizados}
              onChange={(e) => handleChange('caribe_talleres_realizados', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Espacios grupales y formativos</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Planes de Protección Completados
            </label>
            <input
              type="number"
              value={formData.caribe_planes_proteccion}
              onChange={(e) => handleChange('caribe_planes_proteccion', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Mapas personales construidos</span>
          </div>

          <div className="bg-[#180426] border border-purple-800/50 rounded-2xl p-4 space-y-1.5">
            <label className="text-[11px] font-bold text-pink-300 uppercase tracking-wider block">
              Mejora Promedio IPSC (Puntos)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.caribe_variacion_ipsc}
              onChange={(e) => handleChange('caribe_variacion_ipsc', Number(e.target.value))}
              className="w-full bg-[#2d0c44] border border-purple-700/60 rounded-xl px-3 py-2 text-white font-mono text-base font-bold focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-purple-400">Incremento en índice a 90 días</span>
          </div>
        </div>

        {/* Parámetros Institucionales y Costo-Efectividad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Fondo Capital Semilla / Inversión (COP)</label>
            <input
              type="number"
              value={formData.caribe_fondo_capital_cop}
              onChange={(e) => handleChange('caribe_fondo_capital_cop', Number(e.target.value))}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-pink-500"
            />
            <span className="text-[10px] text-emerald-400 block font-mono">
              Costo por ruta resultante: ${costoPorRuta} COP
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Periodo Territorial Activo</label>
            <input
              type="text"
              value={formData.caribe_periodo}
              onChange={(e) => handleChange('caribe_periodo', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
              placeholder="2026-Q3 (Cartagena & Bolívar)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Dimensión Más Fortalecida</label>
            <input
              type="text"
              value={formData.caribe_dimension_fuerte}
              onChange={(e) => handleChange('caribe_dimension_fuerte', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Municipios y Barrios de Presencia Activa</label>
            <input
              type="text"
              value={formData.caribe_territorios}
              onChange={(e) => handleChange('caribe_territorios', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-purple-300">Dimensión en Fortalecimiento</label>
            <input
              type="text"
              value={formData.caribe_dimension_debil}
              onChange={(e) => handleChange('caribe_dimension_debil', e.target.value)}
              className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Notas de Publicación */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-purple-300">Nota de Transparencia / Metodología</label>
          <textarea
            rows={2}
            value={formData.caribe_notas}
            onChange={(e) => handleChange('caribe_notas', e.target.value)}
            className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* BOTÓN FINAL DE GUARDAR */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#E12880] hover:bg-[#c41070] text-white text-sm font-black shadow-xl shadow-pink-600/30 transition flex items-center justify-center gap-2"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Guardando en Base de Datos…' : 'Guardar y Publicar Cifras'}
        </button>
      </div>
    </form>
  );
}
