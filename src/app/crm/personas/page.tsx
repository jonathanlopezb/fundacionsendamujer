'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCrmAuth } from '@/lib/crm/client';
import {
  Users,
  Search,
  PlusCircle,
  Shield,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Filter,
  X,
  UserCheck,
  AlertCircle,
  Download,
  Eye,
  FileHeart,
  Layers,
  Sparkles,
  Building,
  CheckCircle2,
} from 'lucide-react';

export default function CrmPersonasPage() {
  const { can } = useCrmAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    birthDate: '',
    gender: 'FEMALE',
    phone: '',
    email: '',
    street: '',
    neighborhood: '',
    city: 'Barranquilla',
    locality: '',
    occupation: '',
    educationLevel: 'Secundaria',
    roles: ['BENEFICIARY'],
    protectedIdentity: false,
    pseudonym: '',
    consentHabeasData: true,
  });

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      if (roleFilter) params.append('role', roleFilter);
      if (genderFilter) params.append('gender', genderFilter);

      const res = await fetch(`/api/crm/people?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setPeople(json.people || []);
      }
    } catch (err) {
      console.error('Error al consultar personas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [roleFilter, genderFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPeople();
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        birthDate: formData.birthDate || undefined,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        address: {
          street: formData.street,
          neighborhood: formData.neighborhood,
          city: formData.city,
          locality: formData.locality,
        },
        occupation: formData.occupation,
        educationLevel: formData.educationLevel,
        roles: formData.roles,
        protectedIdentity: formData.protectedIdentity,
        pseudonym: formData.pseudonym,
        consentHabeasData: formData.consentHabeasData,
      };

      const res = await fetch('/api/crm/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Error al registrar la persona');
      }

      setSuccessMsg('Persona registrada exitosamente en el CRM');
      setModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        documentType: 'CC',
        documentNumber: '',
        birthDate: '',
        gender: 'FEMALE',
        phone: '',
        email: '',
        street: '',
        neighborhood: '',
        city: 'Barranquilla',
        locality: '',
        occupation: '',
        educationLevel: 'Secundaria',
        roles: ['BENEFICIARY'],
        protectedIdentity: false,
        pseudonym: '',
        consentHabeasData: true,
      });
      fetchPeople();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  const exportToCSV = () => {
    if (people.length === 0) return;
    const headers = ['ID', 'Nombres', 'Apellidos', 'Documento', 'Género', 'Teléfono', 'Correo', 'Ciudad', 'Barrio', 'Roles', 'Fecha Registro'];
    const rows = people.map((p) => [
      p._id,
      `"${p.firstName || ''}"`,
      `"${p.lastName || ''}"`,
      `"${p.documentType || ''} ${p.documentNumberMasked || '***'}"`,
      `"${p.gender || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.email || ''}"`,
      `"${p.address?.city || ''}"`,
      `"${p.address?.neighborhood || ''}"`,
      `"${(p.roles || []).join(', ')}"`,
      `"${new Date(p.createdAt).toLocaleDateString('es-CO')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Personas_CRM_SendaMujer_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleRole = (r: string) => {
    if (formData.roles.includes(r)) {
      if (formData.roles.length > 1) {
        setFormData({ ...formData, roles: formData.roles.filter((x) => x !== r) });
      }
    } else {
      setFormData({ ...formData, roles: [...formData.roles, r] });
    }
  };

  const roleBadgeMap: Record<string, { label: string; color: string }> = {
    BENEFICIARY: { label: 'Participante', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
    DONOR: { label: 'Donante', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
    VOLUNTEER: { label: 'Voluntaria', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
    STAFF: { label: 'Equipo / Staff', color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
    PARTNER: { label: 'Aliada / Institucional', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    PROFESSIONAL: { label: 'Profesional', color: 'bg-teal-500/10 text-teal-300 border-teal-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Directorio Unificado de Personas</h1>
          </div>
          <p className="text-xs text-slate-400">
            Registro único bajo principio de una sola persona con múltiples roles (Participante, Donante, Voluntaria, Aliada).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {people.length > 0 && (
            <button
              onClick={exportToCSV}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Exportar listado a Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar CSV</span>
            </button>
          )}

          {can('people.write') && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Persona</span>
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ── Filters & Search Bar ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por nombre, documento o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-rose-500/60"
            >
              <option value="">Todos los Roles</option>
              <option value="BENEFICIARY">Participantes</option>
              <option value="DONOR">Donantes</option>
              <option value="VOLUNTEER">Voluntarias</option>
              <option value="STAFF">Equipo / Staff</option>
              <option value="PARTNER">Aliadas</option>
              <option value="PROFESSIONAL">Profesionales</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-slate-900/80 border border-slate-700/60 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-rose-500/60"
            >
              <option value="">Todos los Géneros</option>
              <option value="FEMALE">Mujer / Femenino</option>
              <option value="MALE">Hombre / Masculino</option>
              <option value="OTHER">Otro / No binario</option>
            </select>

            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700/60 transition-colors"
            >
              Buscar
            </button>
            {(search || roleFilter || genderFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  setGenderFilter('');
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/40 border border-slate-700/40"
                title="Limpiar filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
          <span>{people.length} personas encontradas</span>
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Tratamiento seguro de datos Ley 1581 / 2012
          </span>
        </div>
      </div>

      {/* ── Table / List ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando directorio de personas...
          </div>
        ) : people.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-600 opacity-40 mb-1" />
            <p className="text-sm font-semibold text-slate-300">No se encontraron personas registradas</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Utiliza el botón superior para crear el primer registro en la base de datos de la Fundación.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Persona / Identidad</th>
                  <th className="py-3.5 px-4">Documento</th>
                  <th className="py-3.5 px-4">Contacto</th>
                  <th className="py-3.5 px-4">Ubicación</th>
                  <th className="py-3.5 px-4">Roles Activos</th>
                  <th className="py-3.5 px-4 text-right">Ficha 360°</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {people.map((person) => {
                  const displayName = person.protectedIdentity && person.pseudonym
                    ? `${person.pseudonym} (Identidad Protegida)`
                    : `${person.firstName} ${person.lastName}`;

                  return (
                    <tr key={person._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs flex-shrink-0">
                            {person.firstName?.[0]?.toUpperCase()}
                            {person.lastName?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-white block group-hover:text-rose-300 transition-colors">
                              {displayName}
                            </span>
                            {person.protectedIdentity && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-medium text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded mt-0.5">
                                <Shield className="w-2.5 h-2.5" />
                                Seudónimo Activo
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {person.documentType} {person.documentNumberMasked || '••••••••'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {person.phone ? (
                            <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {person.phone}
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[11px]">Sin teléfono</span>
                          )}
                          {person.email && (
                            <span className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {person.email}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <span>
                            {person.address?.city || 'Barranquilla'}
                            {person.address?.neighborhood ? `, ${person.address.neighborhood}` : ''}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(person.roles || ['BENEFICIARY']).map((r: string) => {
                            const b = roleBadgeMap[r] || { label: r, color: 'bg-slate-800 text-slate-300 border-slate-700' };
                            return (
                              <span key={r} className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${b.color}`}>
                                {b.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/crm/personas/${person._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-600 hover:text-white text-slate-300 border border-slate-700/60 text-xs font-medium transition-all"
                        >
                          <span>Ver 360°</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal de Creación de Persona ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Registrar Nueva Persona</h2>
                  <p className="text-[11px] text-slate-400">Directorio institucional con consentimiento y Habeas Data</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreatePerson} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Lucía"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Polo Gutiérrez"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Documento y Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo Documento</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                    <option value="PASSPORT">Pasaporte</option>
                    <option value="RC">Registro Civil (RC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">No. Documento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1047123456"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Género</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="FEMALE">Mujer / Femenino</option>
                    <option value="MALE">Hombre / Masculino</option>
                    <option value="OTHER">Otro / No binario</option>
                  </select>
                </div>
              </div>

              {/* Teléfono y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad / Municipio</label>
                  <input
                    type="text"
                    placeholder="Barranquilla"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Barrio / Vereda</label>
                  <input
                    type="text"
                    placeholder="Ej. El Bosque"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección / Calle</label>
                  <input
                    type="text"
                    placeholder="Calle 60 # 9B-20"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Ocupación y Nivel Educativo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ocupación / Oficio</label>
                  <input
                    type="text"
                    placeholder="Ej. Emprendedora, Costurera, Estudiante"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel Educativo</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Ninguno">Ninguno</option>
                    <option value="Primaria">Primaria Incompleta / Completa</option>
                    <option value="Secundaria">Secundaria / Bachillerato</option>
                    <option value="Técnico/Tecnológico">Técnico o Tecnológico</option>
                    <option value="Universitario">Universitario</option>
                    <option value="Postgrado">Postgrado</option>
                  </select>
                </div>
              </div>

              {/* Selección de Roles en la Organización */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Roles de la Persona en Senda Mujer</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'BENEFICIARY', label: 'Participante (CAM/THEMIS)' },
                    { id: 'DONOR', label: 'Donante' },
                    { id: 'VOLUNTEER', label: 'Voluntaria' },
                    { id: 'STAFF', label: 'Staff Institucional' },
                    { id: 'PARTNER', label: 'Aliada Externa' },
                    { id: 'PROFESSIONAL', label: 'Profesional Asignada' },
                  ].map((r) => {
                    const active = formData.roles.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleRole(r.id)}
                        className={`p-2 text-left rounded-xl border text-[11px] font-medium transition-all ${
                          active
                            ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Identidad Protegida */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">Modo de Identidad Protegida (Seudónimo)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.protectedIdentity}
                    onChange={(e) => setFormData({ ...formData, protectedIdentity: e.target.checked })}
                    className="w-4 h-4 text-rose-500 rounded bg-slate-950 border-slate-700"
                  />
                </div>
                {formData.protectedIdentity && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Seudónimo visible en listados y reportes generales *
                    </label>
                    <input
                      type="text"
                      required={formData.protectedIdentity}
                      placeholder="Ej. Esperanza Caribe 01"
                      value={formData.pseudonym}
                      onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-3 text-xs text-white"
                    />
                  </div>
                )}
              </div>

              {/* Habeas Data Checkbox */}
              <div className="flex items-start gap-2.5 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  required
                  checked={formData.consentHabeasData}
                  onChange={(e) => setFormData({ ...formData, consentHabeasData: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-rose-500 rounded bg-slate-950 border-slate-700"
                />
                <span>
                  Declaro que la persona ha autorizado el tratamiento de sus datos personales conforme a la política institucional de la Fundación Senda Mujer y la Ley 1581 de 2012 de Colombia.
                </span>
              </div>

              {/* Botón Submit */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 disabled:opacity-50 flex items-center gap-2"
                >
                  {creating && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Guardar Persona</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
