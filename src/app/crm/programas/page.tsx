'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  Users,
  BookOpen,
  X,
  Sparkles,
  Calendar,
  CheckSquare,
  Award,
  ArrowUpRight,
} from 'lucide-react';

export default function CrmProgramasPage() {
  const { can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'programs' | 'enrollments'>('programs');
  const [programs, setPrograms] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [enrollData, setEnrollData] = useState({
    personId: '',
    programId: '',
    productiveLine: 'SEWING',
    cohortId: '2026-I',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProg, resEnroll, resPeople] = await Promise.all([
        fetch('/api/crm/programs?view=programs'),
        fetch('/api/crm/programs?view=enrollments'),
        fetch('/api/crm/people?limit=100'),
      ]);

      if (resProg.ok) {
        const jp = await resProg.json();
        setPrograms(jp.programs || []);
        if (jp.programs?.length > 0 && !enrollData.programId) {
          setEnrollData((prev) => ({ ...prev, programId: jp.programs[0]._id }));
        }
      }
      if (resEnroll.ok) {
        const je = await resEnroll.json();
        setEnrollments(je.enrollments || []);
      }
      if (resPeople.ok) {
        const jpe = await resPeople.json();
        setPeople(jpe.people || []);
        if (jpe.people?.length > 0 && !enrollData.personId) {
          setEnrollData((prev) => ({ ...prev, personId: jpe.people[0]._id }));
        }
      }
    } catch (err) {
      console.error('Error al cargar programas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/crm/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'enrollment', ...enrollData }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error en inscripción:', err);
    } finally {
      setCreating(false);
    }
  };

  const lineNames: Record<string, string> = {
    SEWING: 'Modistería & Confección',
    BAKING: 'Repostería & Panadería',
    SUBLIMATION: 'Estampado & Sublimación',
    GARDENING: 'Huertas Urbanas',
    CRAFTS: 'Artesanías & Manualidades',
    OTHER: 'Formación General',
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Programas & Formación Productiva CAM</h1>
          </div>
          <p className="text-xs text-slate-400">
            Centro de Apoyo a la Mujer (CAM), Ruta THEMIS y proyectos de autonomía económica.
          </p>
        </div>

        {can('programs.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Inscribir en Línea CAM</span>
          </button>
        )}
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'programs'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Catálogo de Programas ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enrollments')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'enrollments'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Participantes Inscritas ({enrollments.length})</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando programas...
          </div>
        ) : activeTab === 'programs' ? (
          programs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">No hay programas registrados aún.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map((p) => (
                <div key={p._id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {p.code}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{p.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-2">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                    Población: {p.targetPopulation || 'Mujeres en vulnerabilidad'}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : enrollments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No hay inscripciones registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Participante</th>
                  <th className="py-3.5 px-4">Programa</th>
                  <th className="py-3.5 px-4">Línea Productiva</th>
                  <th className="py-3.5 px-4">Cohorte</th>
                  <th className="py-3.5 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {enrollments.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{e.personName || 'Participante'}</td>
                    <td className="py-3.5 px-4 text-slate-300">{e.programCode || 'CAM'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-950/60 border border-purple-800 text-purple-300">
                        {lineNames[e.productiveLine] || e.productiveLine}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{e.cohortId || '2026-I'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Inscribir ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Inscribir en Programa CAM</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnroll} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Participante *</label>
                <select
                  required
                  value={enrollData.personId}
                  onChange={(e) => setEnrollData({ ...enrollData, personId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName} — {p.documentNumberMasked || '•••'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Programa</label>
                <select
                  value={enrollData.programId}
                  onChange={(e) => setEnrollData({ ...enrollData, programId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {programs.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Línea Productiva (CAM)</label>
                <select
                  value={enrollData.productiveLine}
                  onChange={(e) => setEnrollData({ ...enrollData, productiveLine: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="SEWING">Modistería & Confección</option>
                  <option value="BAKING">Repostería & Panadería</option>
                  <option value="SUBLIMATION">Estampado & Sublimación</option>
                  <option value="GARDENING">Huertas Urbanas</option>
                  <option value="CRAFTS">Artesanías & Manualidades</option>
                  <option value="OTHER">Formación General</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  {creating ? 'Inscribiendo...' : 'Confirmar Inscripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
