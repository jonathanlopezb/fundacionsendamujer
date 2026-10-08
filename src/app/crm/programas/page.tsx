'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { Layers, PlusCircle, CheckCircle2, Users, BookOpen, X } from 'lucide-react';

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
    productiveLine: 'Costura y Confección',
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
      }
      if (resEnroll.ok) {
        const je = await resEnroll.json();
        setEnrollments(je.enrollments || []);
      }
      if (resPeople.ok) {
        const jpe = await resPeople.json();
        setPeople(jpe.people || []);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-rose-400" />
            Programas & Líneas Productivas CAM
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centro de Apoyo a la Mujer (CAM), Ruta THEMIS y proyectos de autonomía económica.
          </p>
        </div>

        {can('programs.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Inscribir en Línea CAM</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('programs')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'programs' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Catálogo Institucional ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'enrollments' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Participantes Inscritas ({enrollments.length})
        </button>
      </div>

      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {programs.map((p) => (
            <div key={p._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded">
                  {p.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                  ACTIVO
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-3">{p.description}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                Población: {p.targetPopulation}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Participante</th>
                  <th className="p-3">Línea Productiva</th>
                  <th className="p-3">Cohorte</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">Fecha Inscripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {enrollments.map((e) => (
                  <tr key={e._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">
                      {e.personName} <span className="font-mono text-[10px] text-slate-400 block">{e.personCode}</span>
                    </td>
                    <td className="p-3 text-slate-200">{e.productiveLine}</td>
                    <td className="p-3 text-slate-400 font-mono">{e.cohortId || '2026-I'}</td>
                    <td className="p-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{new Date(e.enrolledAt).toLocaleDateString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Inscripción */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Inscribir Participante en Programa
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEnroll} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Participante *</label>
                <select
                  required
                  value={enrollData.personId}
                  onChange={(e) => setEnrollData({ ...enrollData, personId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="">Seleccione participante...</option>
                  {people.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Programa Institucional *</label>
                <select
                  required
                  value={enrollData.programId}
                  onChange={(e) => setEnrollData({ ...enrollData, programId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="">Seleccione programa...</option>
                  {programs.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Línea Productiva / Área</label>
                <select
                  value={enrollData.productiveLine}
                  onChange={(e) => setEnrollData({ ...enrollData, productiveLine: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="Costura y Confección">Costura y Confección</option>
                  <option value="Panadería y Repostería">Panadería y Repostería</option>
                  <option value="Sublimación y Estampado">Sublimación y Estampado</option>
                  <option value="Huertas Caseras y Agroecología">Huertas Caseras y Agroecología</option>
                  <option value="Piscicultura y Cría Menor">Piscicultura y Cría Menor</option>
                  <option value="Manualidades y Artesanías">Manualidades y Artesanías</option>
                  <option value="Liderazgo Comunitario">Liderazgo Comunitario</option>
                  <option value="Habilidades Digitales">Habilidades Digitales</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
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
