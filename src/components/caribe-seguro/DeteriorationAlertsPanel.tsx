'use client';

/**
 * DeteriorationAlertsPanel — Panel de Alertas de Deterioro
 *
 * Implementa el Sistema de Señales de Deterioro del Blueprint cap. 8.
 * Muestra alertas amarillas y rojas con su nivel y señales.
 * La decisión humana es OBLIGATORIA para resolver cualquier alerta.
 * El sistema prioriza la información; nunca sustituye el criterio profesional.
 */

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock, User, ChevronDown, ChevronUp,
  MessageSquare, ArrowUpCircle, Loader2, RefreshCw, ShieldAlert
} from 'lucide-react';

interface Alert {
  _id: string;
  beneficiaryInternalCode: string;
  alertLevel: 'amarilla' | 'roja';
  triggeredAt: string;
  signals: string[];
  dimensionsAffected: string[];
  suggestedActionBySystem: string;
  status: 'pendiente' | 'en_revision' | 'resuelta' | 'escalada';
  assignedTo: string;
  humanDecision: string;
  ipscTotalAtAlert: number;
  previousIPSCTotal: number | null;
}

const LEVEL_CONFIG = {
  roja: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    headerBg: 'bg-red-500',
    badgeBg: 'bg-red-100 text-red-800',
    label: '🔴 Alerta Roja — Revisión Prioritaria',
    desc: 'Múltiples señales detectadas. Revisión inmediata por Coordinación del Espacio Seguro.',
    icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
  },
  amarilla: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    headerBg: 'bg-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800',
    label: '🟡 Alerta Amarilla — Acompañamiento',
    desc: 'Señal detectada. Revisar en agenda profesional en las próximas 72 horas.',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  },
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En Revisión',
  resuelta: 'Resuelta',
  escalada: 'Escalada',
};

function AlertCard({ alert, onAction }: { alert: Alert; onAction: () => void }) {
  const [expanded, setExpanded] = useState(alert.alertLevel === 'roja' && alert.status === 'pendiente');
  const [decision, setDecision] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isActing, setIsActing] = useState(false);
  const [localError, setLocalError] = useState('');

  const cfg = LEVEL_CONFIG[alert.alertLevel];
  const isPending = alert.status === 'pendiente' || alert.status === 'en_revision';

  const act = async (action: 'asignar' | 'resolver' | 'escalar') => {
    if (action === 'resolver' && decision.trim().length < 10) {
      setLocalError('La decisión profesional debe tener al menos 10 caracteres.');
      return;
    }
    setLocalError('');
    setIsActing(true);
    try {
      const res = await fetch('/api/caribe-seguro/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert._id,
          action,
          humanDecision: decision,
          assignedTo,
          assignedToRole: 'profesional',
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      onAction();
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${cfg.border} ${cfg.bg}`}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0`}>
            {cfg.icon}
          </div>
          <div className="text-left">
            <p className="font-extrabold text-sm text-slate-900">{cfg.label}</p>
            <p className="text-[11px] text-slate-600 font-mono">
              Expediente: <strong>{alert.beneficiaryInternalCode}</strong> •{' '}
              {new Date(alert.triggeredAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cfg.badgeBg}`}>
                {STATUS_LABELS[alert.status]}
              </span>
              <span className="text-[10px] text-slate-500">
                IPSC: <strong>{alert.ipscTotalAtAlert?.toFixed(1)}/10</strong>
                {alert.previousIPSCTotal && (
                  <> • Anterior: {alert.previousIPSCTotal.toFixed(1)}</>
                )}
              </span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-white/50 pt-3">

          {/* Señales */}
          <div className="space-y-1.5">
            <p className="text-xs font-extrabold text-slate-700">Señales detectadas:</p>
            {alert.signals.map((s, i) => (
              <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-amber-500 shrink-0 mt-0.5">⚠</span> {s}
              </p>
            ))}
          </div>

          {/* Dimensiones afectadas */}
          {alert.dimensionsAffected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {alert.dimensionsAffected.map((d) => (
                <span key={d} className="text-[10px] bg-white border border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                  {d}
                </span>
              ))}
            </div>
          )}

          {/* Sugerencia del sistema */}
          <div className="p-3 bg-white/60 rounded-xl border border-white text-xs text-slate-600">
            <p className="font-bold text-slate-700 mb-0.5">Acción sugerida por el sistema:</p>
            <p className="italic">{alert.suggestedActionBySystem}</p>
            <p className="text-[10px] text-slate-400 mt-1 font-bold">
              ⚠️ La decisión final corresponde SIEMPRE al equipo profesional, nunca al sistema automatizado.
            </p>
          </div>

          {/* Ya resuelta o escalada */}
          {!isPending && alert.humanDecision && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <p className="font-bold text-emerald-800">Decisión profesional registrada:</p>
              <p className="text-emerald-700 mt-0.5">{alert.humanDecision}</p>
            </div>
          )}

          {/* Acciones — solo si está pendiente o en revisión */}
          {isPending && (
            <div className="space-y-3 pt-1">
              {/* Asignar a profesional */}
              {alert.status === 'pendiente' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Nombre del profesional responsable"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#E12880]"
                  />
                  <button
                    type="button"
                    onClick={() => act('asignar')}
                    disabled={isActing || !assignedTo.trim()}
                    className="bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer hover:bg-slate-600 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" /> Asignar
                  </button>
                </div>
              )}

              {/* Decisión humana (obligatoria para resolver) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">
                  Decisión profesional * <span className="text-slate-400 font-normal">(obligatoria para resolver)</span>
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="Describe la acción tomada: p.ej. 'Se reagendó cita de seguimiento para 2 sept. 2026. Se verificó que la beneficiaria tiene contacto con red de apoyo familiar...'"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#E12880] resize-none"
                />
                <p className="text-[10px] text-slate-400">Mínimo 10 caracteres. Esta decisión queda registrada en el historial de auditoría.</p>
              </div>

              {localError && (
                <p className="text-xs text-red-600 font-bold">{localError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => act('resolver')}
                  disabled={isActing}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Resolver con Decisión
                </button>
                <button
                  type="button"
                  onClick={() => act('escalar')}
                  disabled={isActing}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer hover:opacity-90 flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  Escalar a Coordinación
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Panel principal ──────────────────────────────────────────────────────────
interface DeteriorationAlertsPanelProps {
  showOnlyPending?: boolean;
}

export default function DeteriorationAlertsPanel({ showOnlyPending = false }: DeteriorationAlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pendiente' | 'all' | 'resuelta'>(showOnlyPending ? 'pendiente' : 'pendiente');
  const [levelFilter, setLevelFilter] = useState<'all' | 'roja' | 'amarilla'>('all');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', filter);
      if (levelFilter !== 'all') params.set('level', levelFilter);

      const res = await fetch(`/api/caribe-seguro/alerts?${params}`);
      const data = await res.json();
      if (data.success) setAlerts(data.alerts);
    } catch (err) {
      console.error('Error cargando alertas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [filter, levelFilter]);

  const rojas = alerts.filter((a) => a.alertLevel === 'roja').length;
  const amarillas = alerts.filter((a) => a.alertLevel === 'amarilla').length;

  return (
    <div className="space-y-5">

      {/* Header con métricas */}
      <div className="bg-gradient-to-r from-[#3B0852] to-[#52166F] rounded-2xl p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">SISTEMA CARIBE SEGURO</span>
          <h3 className="text-xl font-black">Panel de Señales de Deterioro</h3>
          <p className="text-xs text-pink-200 mt-0.5">
            El sistema organiza la información. La decisión es siempre del equipo profesional.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-black text-red-300">{rojas}</p>
            <p className="text-[10px] text-red-200 font-bold">Rojas</p>
          </div>
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-black text-amber-300">{amarillas}</p>
            <p className="text-[10px] text-amber-200 font-bold">Amarillas</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {(['pendiente', 'all', 'resuelta'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
              filter === s
                ? 'bg-[#52166F] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-[#52166F]'
            }`}
          >
            {s === 'pendiente' ? 'Pendientes' : s === 'all' ? 'Todas' : 'Resueltas'}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {(['all', 'roja', 'amarilla'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevelFilter(l)}
              className={`px-3 py-2 rounded-full text-xs font-bold cursor-pointer transition-all ${
                levelFilter === l
                  ? l === 'roja' ? 'bg-red-500 text-white' : l === 'amarilla' ? 'bg-amber-400 text-white' : 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {l === 'all' ? 'Todos los niveles' : l === 'roja' ? '🔴 Roja' : '🟡 Amarilla'}
            </button>
          ))}
          <button
            type="button"
            onClick={fetchAlerts}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 cursor-pointer hover:border-[#E12880]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista de alertas */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-sm">Cargando alertas...</span>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="font-extrabold text-emerald-800">Sin alertas en este filtro</p>
          <p className="text-xs text-emerald-600">No hay señales de deterioro pendientes de revisión.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard key={alert._id} alert={alert} onAction={fetchAlerts} />
          ))}
        </div>
      )}

      {/* Nota ética */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-800 font-semibold">
        ℹ️ <strong>Límite ético:</strong> Este sistema identifica señales de deterioro en las dimensiones del IPSC, no predice probabilidades de violencia futura. Toda acción requiere decisión de un profesional humano. Blueprint cap. 8 — Fundación Senda Mujer.
      </div>
    </div>
  );
}
