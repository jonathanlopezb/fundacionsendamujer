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
} from 'lucide-react';

export default function CrmPersonasPage() {
  const { can } = useCrmAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    city: 'Cartagena',
    locality: '',
    occupation: '',
    educationLevel: 'Secundaria',
    roles: ['BENEFICIARY'],
    protectedIdentity: false,
    pseudonym: '',
  });

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.append('q', search.trim());
      if (roleFilter) params.append('role', roleFilter);

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
  }, [roleFilter]);

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
      };

      const res = await fetch('/api/crm/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar persona');
      }

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
        city: 'Cartagena',
        locality: '',
        occupation: '',
        educationLevel: 'Secundaria',
        roles: ['BENEFICIARY'],
        protectedIdentity: false,
        pseudonym: '',
      });
      fetchPeople();
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  const handleRoleToggle = (role: string) => {
    if (formData.roles.includes(role)) {
      if (formData.roles.length > 1) {
        setFormData({ ...formData, roles: formData.roles.filter((r) => r !== role) });
      }
    } else {
      setFormData({ ...formData, roles: [...formData.roles, role] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            Directorio Único de Personas
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro unificado de beneficiarias, voluntarias, donantes y aliadas bajo la Ley 1581 de 2012.
          </p>
        </div>

        {can('people.write') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Persona</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, documento, teléfono o barrio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 w-full sm:w-auto"
          >
            <option value="">Todos los roles</option>
            <option value="BENEFICIARY">Beneficiaria</option>
            <option value="DONOR">Donante</option>
            <option value="VOLUNTEER">Voluntaria</option>
            <option value="STAFF">Equipo / Staff</option>
            <option value="PARTNER">Aliada</option>
            <option value="PROFESSIONAL">Profesional</option>
          </select>
        </div>
      </div>

      {/* People Table / List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs animate-pulse">Cargando directorio de personas...</div>
        ) : people.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No se encontraron personas con los criterios de búsqueda especificados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-3.5 font-semibold">Código</th>
                  <th className="p-3.5 font-semibold">Nombre / Identidad</th>
                  <th className="p-3.5 font-semibold">Documento</th>
                  <th className="p-3.5 font-semibold">Contacto</th>
                  <th className="p-3.5 font-semibold">Ubicación</th>
                  <th className="p-3.5 font-semibold">Roles</th>
                  <th className="p-3.5 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {people.map((p) => {
                  const displayName = p.protectedIdentity ? p.pseudonym || 'Identidad Protegida' : `${p.firstName} ${p.lastName}`;

                  return (
                    <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400 font-medium">{p.code}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {displayName}
                          {p.protectedIdentity && (
                            <span className="p-0.5 bg-amber-500/20 text-amber-400 rounded text-[9px] font-bold">
                              PROTEGIDA
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{p.occupation || 'Sin ocupación registrada'}</span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {p.documentType} {p.documentNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col gap-0.5 text-slate-300">
                          {p.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {p.phone}
                            </span>
                          )}
                          {p.email && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {p.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          <span>{p.address?.neighborhood || p.address?.city || 'Cartagena'}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {p.roles?.map((r: string) => (
                            <span
                              key={r}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/crm/personas/${p._id}`}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Ficha 360°</span>
                          <ChevronRight className="w-3 h-3" />
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

      {/* Modal Registrar Persona */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-400" />
                Registrar Nueva Persona en CRM
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreatePerson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. María Elena"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mendoza Castro"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo Doc *</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="PPT">Permiso Protección Temporal (PPT)</option>
                    <option value="PEP">Permiso Especial Permanencia (PEP)</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Número Documento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1047123456"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha Nacimiento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+57 300 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Barrio / Sector (Cartagena)</label>
                  <input
                    type="text"
                    placeholder="Ej. Nelson Mandela, Olaya Herrera, Pozón"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dirección Exacta</label>
                  <input
                    type="text"
                    placeholder="Ej. Mz 4 Lote 12 Sector Las Vegas"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Roles en la fundación */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Roles en la Fundación</label>
                <div className="flex flex-wrap gap-2">
                  {['BENEFICIARY', 'DONOR', 'VOLUNTEER', 'STAFF', 'PARTNER', 'PROFESSIONAL'].map((r) => {
                    const selected = formData.roles.includes(r);
                    return (
                      <button
                        type="button"
                        key={r}
                        onClick={() => handleRoleToggle(r)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modo Identidad Protegida */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Modo Identidad Protegida (Víctimas de Violencia / Alto Riesgo)
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.protectedIdentity}
                    onChange={(e) => setFormData({ ...formData, protectedIdentity: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700 focus:ring-0"
                  />
                </div>
                {formData.protectedIdentity && (
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Seudónimo Visible en Pantallas</label>
                    <input
                      type="text"
                      placeholder="Ej. Esperanza del Caribe"
                      value={formData.pseudonym}
                      onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Habeas Data Warning */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Al registrar esta persona, se emite constancia de autorización informada y tratamiento confidencial de datos de acuerdo con la Ley 1581 de 2012 de Colombia.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {creating ? 'Guardando...' : 'Guardar Persona en Base de Datos'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
