'use client';

/**
 * /caribe-seguro/rutas — Route Engine (Rutas Institucionales)
 *
 * Trazabilidad de rutas consultadas dinámicamente desde MongoDB Atlas.
 */

import React, { useEffect, useState } from 'react';
import { Route, Clock, CheckCircle2, AlertTriangle, Building, Loader2, RefreshCw } from 'lucide-react';

interface RouteItem {
  _id: string;
  routeCode: string;
  routeName: string;
  provider: string;
  estimatedTime: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ACTIVATED' | 'PENDING';
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-emerald-950 text-emerald-300 border border-emerald-700/50',
  IN_PROGRESS: 'bg-blue-950 text-blue-300 border border-blue-700/50',
  ACTIVATED: 'bg-purple-950 text-purple-300 border border-purple-700/50',
  PENDING: 'bg-amber-950 text-amber-300 border border-amber-700/50',
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: 'Completada',
  IN_PROGRESS: 'En Proceso',
  ACTIVATED: 'Activada',
  PENDING: 'Pendiente',
};

export default function RutasPage() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/caribe-seguro/routes');
      const data = await res.json();
      if (data.success && Array.isArray(data.routes)) {
        setRoutes(data.routes);
        setTotal(data.total || data.routes.length);
      }
    } catch (err) {
      console.warn('Error cargando rutas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoutes(); }, []);

  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      {/* HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-teal-500 text-[#140320] text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          RUTAS DE ATENCIÓN — DATOS EN VIVO
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Gestión y Trazabilidad de Rutas
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Medición transparente de tiempos desde la solicitud inicial hasta la atención efectiva y cierre de la ruta. Datos consultados en tiempo real desde MongoDB Atlas.
        </p>
      </div>

      {/* STATS RÁPIDAS */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Rutas', val: total, color: 'text-white' },
            { label: 'Completadas', val: routes.filter(r => r.status === 'COMPLETED').length, color: 'text-emerald-400' },
            { label: 'En Proceso', val: routes.filter(r => r.status === 'IN_PROGRESS').length, color: 'text-blue-400' },
            { label: 'Activadas', val: routes.filter(r => r.status === 'ACTIVATED').length, color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#140320]/80 rounded-2xl border border-purple-900/40 p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[10px] font-bold text-pink-300/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* LISTA DE RUTAS */}
      <div className="bg-[#140320]/90 rounded-3xl border border-purple-800/50 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-white text-lg">Trazabilidad de Rutas Institucionales Activas</h3>
          <button
            type="button"
            onClick={fetchRoutes}
            className="flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors cursor-pointer bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-700/40"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-pink-300 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-bold">Cargando rutas desde MongoDB Atlas...</span>
          </div>
        ) : routes.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Route className="w-10 h-10 text-pink-400/40 mx-auto" />
            <p className="text-sm font-bold text-pink-300/70">No hay rutas registradas aún.</p>
            <p className="text-xs text-pink-300/40">Las rutas aparecerán aquí cuando sean creadas en el panel administrativo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((r) => (
              <div key={r._id} className="p-4 rounded-2xl border border-purple-900/40 bg-purple-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-pink-500/30 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-pink-400">{r.routeCode}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${STATUS_STYLES[r.status] || STATUS_STYLES.PENDING}`}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-white text-sm">{r.routeName}</h4>
                  <p className="text-xs text-pink-300/70 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" /> {r.provider}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-pink-200 bg-purple-900/40 px-4 py-2 rounded-xl border border-purple-700/40 shrink-0">
                  <Clock className="w-4 h-4 text-[#E12880]" />
                  <span>Tiempo estimado: {r.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
