'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { UserCheck, Clock, PlusCircle, Award, X } from 'lucide-react';

export default function CrmVoluntariosPage() {
  const { can } = useCrmAuth();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'volunteers' | 'shifts'>('volunteers');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [shiftData, setShiftData] = useState({
    volunteerId: '',
    hours: 4,
    activity: '',
    evaluation: 'Excelente desempeño',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resVol, resSh] = await Promise.all([
        fetch('/api/crm/volunteers?view=volunteers'),
        fetch('/api/crm/volunteers?view=shifts'),
      ]);
      if (resVol.ok) setVolunteers((await resVol.json()).volunteers || []);
      if (resSh.ok) setShifts((await resSh.json()).shifts || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterShift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'shift', ...shiftData }),
      });
      if (res.ok) {
        setModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" />
            Red de Voluntariado & Banco de Horas
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro de horas de apoyo, asignación de turnos y certificación de voluntarias.
          </p>
        </div>

        {can('volunteers.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Turno / Horas</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'volunteers' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Voluntarias Activas ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('shifts')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'shifts' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Historial de Turnos ({shifts.length})
        </button>
      </div>

      {activeTab === 'volunteers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {volunteers.map((vol) => (
            <div key={vol._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">{vol.personCode}</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {vol.hoursTotal || 0} hrs acumuladas
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{vol.personName}</h3>
              <p className="text-xs text-rose-300 font-medium">{vol.profession}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Disponibilidad: {vol.availability}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'shifts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">Fecha</th>
                <th className="p-3">Actividad</th>
                <th className="p-3">Horas</th>
                <th className="p-3">Evaluación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {shifts.map((sh) => (
                <tr key={sh._id} className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-300">{new Date(sh.date).toLocaleDateString('es-CO')}</td>
                  <td className="p-3 font-semibold text-white">{sh.activity}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{sh.hours} horas</td>
                  <td className="p-3 text-slate-400">{sh.evaluation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Registrar Turno */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Turno de Voluntariado
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterShift} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Voluntaria *</label>
                <select
                  required
                  value={shiftData.volunteerId}
                  onChange={(e) => setShiftData({ ...shiftData, volunteerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="">Seleccione voluntaria...</option>
                  {volunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.personName} ({v.profession})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Horas Realizadas *</label>
                <input
                  type="number"
                  required
                  value={shiftData.hours}
                  onChange={(e) => setShiftData({ ...shiftData, hours: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Actividad / Tarea Desarrollada *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Apoyo en logística taller de costura Mandela"
                  value={shiftData.activity}
                  onChange={(e) => setShiftData({ ...shiftData, activity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
                  Registrar Horas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
