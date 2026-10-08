'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { CRM_ROLES_LIST, CrmRole, ROLE_PERMISSIONS } from '@/lib/crm/permissions';
import {
  Settings,
  UserPlus,
  Shield,
  UserCheck,
  Lock,
  Activity,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Key,
  ShieldAlert,
} from 'lucide-react';

export default function CrmConfiguracionPage() {
  const { user, can } = useCrmAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TRABAJADOR_SOCIAL',
    phone: '',
    specialty: '',
    documentNumber: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resUsers, resAudit] = await Promise.all([
        fetch('/api/crm/users'),
        fetch('/api/crm/audit'),
      ]);
      if (resUsers.ok) setUsers((await resUsers.json()).users || []);
      if (resAudit.ok) setAuditLogs((await resAudit.json()).logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setCreating(true);
      const res = await fetch('/api/crm/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear usuario');

      setModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'TRABAJADOR_SOCIAL',
        phone: '',
        specialty: '',
        documentNumber: '',
      });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch('/api/crm/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: nextStatus }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-950/60 border-purple-800 text-purple-300',
    DIRECTORA: 'bg-rose-950/60 border-rose-800 text-rose-300',
    COORDINADOR: 'bg-indigo-950/60 border-indigo-800 text-indigo-300',
    TRABAJADOR_SOCIAL: 'bg-amber-950/60 border-amber-800 text-amber-300',
    PSICOLOGO: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
    ABOGADO: 'bg-blue-950/60 border-blue-800 text-blue-300',
    GESTOR_PROGRAMAS: 'bg-teal-950/60 border-teal-800 text-teal-300',
    GESTOR_DONANTES: 'bg-pink-950/60 border-pink-800 text-pink-300',
    GESTOR_FINANCIERO: 'bg-cyan-950/60 border-cyan-800 text-cyan-300',
    VOLUNTARIO: 'bg-lime-950/60 border-lime-800 text-lime-300',
    CONSULTA: 'bg-slate-800 border-slate-700 text-slate-400',
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">Configuración, Usuarios & Seguridad</h1>
          </div>
          <p className="text-xs text-slate-400">
            Control de usuarios con roles RBAC (11 perfiles), alcance de programas y rastro de auditoría inmutable.
          </p>
        </div>

        {can('users.manage') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Usuario</span>
          </button>
        )}
      </div>

      {/* ── Sub-tabs ── */}
      <div className="border-b border-slate-800/80 flex gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Usuarios Institucionales ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'roles'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Matriz de Roles y Permisos (11)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-rose-500 text-rose-400 bg-rose-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Rastro de Auditoría Inmutable ({auditLogs.length})</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className="bg-[#161b27] border border-slate-800/80 rounded-2xl shadow-sm p-5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando configuración institucional...
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Correo</th>
                  <th className="py-3.5 px-4">Rol Asignado</th>
                  <th className="py-3.5 px-4">Especialidad</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${roleColors[u.role] || 'bg-slate-800 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{u.specialty || 'General'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                            : 'bg-red-950/60 border border-red-800 text-red-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {can('users.manage') && u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          {u.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'roles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRM_ROLES_LIST.map((r) => (
              <div key={r.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md border text-xs font-bold ${roleColors[r.id] || 'bg-slate-800 text-slate-300'}`}>
                    {r.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{r.id}</span>
                </div>
                <p className="text-xs text-slate-400">{r.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                  Permisos activos: {ROLE_PERMISSIONS[r.id]?.length || 0} acciones de dominio
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Acción</th>
                  <th className="py-3.5 px-4">Entidad</th>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">IP / Origen</th>
                  <th className="py-3.5 px-4">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/30 transition-colors font-mono">
                    <td className="py-3.5 px-4 font-bold text-rose-400 text-xs">{log.action}</td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">{log.entity}</td>
                    <td className="py-3.5 px-4 text-slate-400">{log.userName || log.userEmail || 'Sistema'}</td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{log.ip || '127.0.0.1'}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Nuevo Usuario ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#161b27] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Crear Usuario Institucional</h2>
                  <p className="text-[11px] text-slate-400">Asignación de rol RBAC y permisos</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Marcela Gómez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Institucional *</label>
                  <input
                    type="email"
                    required
                    placeholder="laura@fundacionsendamujer.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña Inicial *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rol Institucional (RBAC) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as CrmRole })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  >
                    <option value="DIRECTORA">Directora</option>
                    <option value="COORDINADOR">Coordinador(a)</option>
                    <option value="TRABAJADOR_SOCIAL">Trabajador(a) Social</option>
                    <option value="PSICOLOGO">Psicólogo(a)</option>
                    <option value="ABOGADO">Abogado(a) / Asesor Jurídico</option>
                    <option value="GESTOR_PROGRAMAS">Gestor(a) de Programas CAM</option>
                    <option value="GESTOR_DONANTES">Gestor(a) de Donantes</option>
                    <option value="GESTOR_FINANCIERO">Gestor(a) Financiero</option>
                    <option value="VOLUNTARIO">Voluntario(a)</option>
                    <option value="CONSULTA">Solo Consulta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad / Cargo</label>
                  <input
                    type="text"
                    placeholder="Ej. Psicología Clínica, Trabajo Comunitario"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white"
                  />
                </div>
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
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20"
                >
                  {creating ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
