'use client';

/**
 * /caribe-seguro/red — Red Profesional Caribe Seguro
 *
 * Muestra los médicos/profesionales reales registrados en MongoDB Atlas.
 */

import React, { useEffect, useState } from 'react';
import { Users, Shield, MapPin, Loader2, RefreshCw, Phone, Mail } from 'lucide-react';

interface Doctor {
  _id: string;
  fullName: string;
  role: string;
  specialty: string;
  serviceArea?: string;
  email?: string;
  rethusCode?: string;
  isActive?: boolean;
}

const SPECIALTY_COLORS: Record<string, string> = {
  MEDICA: 'from-blue-500 to-cyan-600',
  PSICOLOGA: 'from-purple-600 to-indigo-600',
  TRABAJADORA_SOCIAL: 'from-teal-500 to-emerald-600',
  ABOGADA: 'from-amber-500 to-yellow-600',
  NUTRICIONISTA: 'from-green-500 to-teal-500',
  DIRECTORA: 'from-[#E12880] to-[#52166F]',
  ADMIN: 'from-pink-600 to-rose-700',
};

export default function RedPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/doctors');
      const data = await res.json();
      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors.filter((d: Doctor) => d.isActive !== false));
      }
    } catch (err) {
      console.warn('Error cargando profesionales:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="p-4 sm:p-8 space-y-10 animate-fadeIn">
      {/* HERO */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="bg-pink-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          EQUIPO PROFESIONAL — DATOS EN VIVO
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
          Red Profesional Caribe Seguro
        </h1>
        <p className="text-sm text-pink-200/90 leading-relaxed">
          Red de especialistas en psicología, derecho, trabajo social y salud orientadas al acompañamiento multidisciplinario de mujeres en el Caribe. Equipo consultado en tiempo real desde MongoDB Atlas.
        </p>
      </div>

      {/* HEADER CON CONTADOR */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-pink-300/70">
          {loading ? 'Cargando...' : `${doctors.length} profesional${doctors.length !== 1 ? 'es' : ''} activo${doctors.length !== 1 ? 's' : ''} registrado${doctors.length !== 1 ? 's' : ''}`}
        </p>
        <button
          type="button"
          onClick={fetchDoctors}
          className="flex items-center gap-1.5 text-xs font-bold text-pink-300 hover:text-white transition-colors cursor-pointer bg-purple-900/40 px-3 py-1.5 rounded-full border border-purple-700/40"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-pink-300 gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">Cargando equipo profesional desde MongoDB Atlas...</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <Users className="w-10 h-10 text-pink-400/40 mx-auto" />
          <p className="text-sm font-bold text-pink-300/70">No hay profesionales registrados aún.</p>
          <p className="text-xs text-pink-300/40">Los perfiles aparecerán aquí una vez sean creados en el panel administrativo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((prof) => {
            const colorClass = SPECIALTY_COLORS[prof.role] || 'from-[#E12880] to-[#52166F]';
            return (
              <div key={prof._id} className="bg-[#140320]/80 rounded-3xl border border-purple-900/40 p-6 space-y-3 shadow-md hover:border-pink-500/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClass} text-white font-extrabold flex items-center justify-center text-base shadow-sm shrink-0`}>
                    {getInitials(prof.fullName)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">{prof.fullName}</h3>
                    <span className="text-xs font-bold text-pink-400">{prof.role?.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-900/40 space-y-1.5 text-xs text-pink-200/80">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#E12880] shrink-0" />
                    <span><strong>Especialidad:</strong> {prof.specialty}</span>
                  </div>
                  {prof.serviceArea && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Zona de atención:</strong> {prof.serviceArea}</span>
                    </div>
                  )}
                  {prof.rethusCode && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">
                        RETHUS: {prof.rethusCode}
                      </span>
                    </div>
                  )}
                  {prof.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate font-mono">{prof.email}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
