'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import {
  UserCheck,
  Clock,
  PlusCircle,
  Award,
  X,
  User,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';

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
      if (resVol.ok) {
        const jv = await resVol.json();
        setVolunteers(jv.volunteers || []);
        if (jv.volunteers?.length > 0 && !shiftData.volunteerId) {
          setShiftData((prev) => ({ ...prev, volunteerId: jv.volunteers[0]._id }));
        }
      }
      if (resSh.ok) {
        const js = await resSh.json();
        setShifts(js.shifts || []);
      }
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
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Red de Voluntariado & Banco de Horas</h1>
          </div>
          <p className="text-xs text-slate-400">
            Registro de horas de apoyo comunitario, asignación de turnos y emisión de certificados.
          </p>
        </div>

        {can('volunteers.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Turno / Horas</span>
          </button>
        )}
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'volunteers'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Voluntarias Registradas ({volunteers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shifts')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'shifts'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Historial de Turnos ({shifts.length})</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando red de voluntarias...
          </div>
        ) : activeTab === 'volunteers' ? (
          volunteers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No hay voluntarias registradas en la base de datos aún.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteers.map((v) => (
                <div key={v._id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{v.personName || 'Voluntaria'}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 border border-purple-800 text-purple-300">
                      {v.hoursTotal || 0} hrs
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Profesión: {v.profession || 'Por definir'}</p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Estado: {v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : shifts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No hay turnos registrados aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Voluntaria</th>
                  <th className="py-3.5 px-4">Actividad Realizada</th>
                  <th className="py-3.5 px-4">Horas</th>
                  <th className="py-3.5 px-4">Evaluación</th>
                  <th className="py-3.5 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {shifts.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{s.volunteerName || 'Voluntaria'}</td>
                    <td className="py-3.5 px-4 text-slate-300">{s.activity}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{s.hours} hrs</td>
                    <td className="py-3.5 px-4 text-emerald-400 text-[11px]">{s.evaluation}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(s.date || s.createdAt).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Registrar Turno ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Registrar Turno / Horas</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterShift} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Voluntaria *</label>
                <select
                  required
                  value={shiftData.volunteerId}
                  onChange={(e) => setShiftData({ ...shiftData, volunteerId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                >
                  {volunteers.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.personName || 'Voluntaria'} ({v.profession || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Actividad Realizada *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Apoyo en brigada psicosocial y toma de asistencia"
                  value={shiftData.activity}
                  onChange={(e) => setShiftData({ ...shiftData, activity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Horas de Apoyo</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={shiftData.hours}
                  onChange={(e) => setShiftData({ ...shiftData, hours: parseInt(e.target.value) || 4 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white font-mono"
                />
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20"
                >
                  Registrar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
