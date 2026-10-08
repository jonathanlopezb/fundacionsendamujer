'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { CRM_ROLES_LIST, CrmRole } from '@/lib/crm/permissions';
import { Settings, UserPlus, Shield, UserCheck, Lock, Activity, X, AlertCircle } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-rose-400" />
            Configuración, Usuarios & Seguridad
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión de cuentas institucionales, control de accesos RBAC y auditoría inmutable del sistema.
          </p>
        </div>

        {can('users.manage') && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Usuario</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'users' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Usuarios del Equipo ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'roles' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Catálogo de Roles y Permisos (11 Roles)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'audit' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          Log de Auditoría Inmutable ({auditLogs.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">Nombre & Correo</th>
                <th className="p-3">Rol Institucional</th>
                <th className="p-3">Especialidad</th>
                <th className="p-3">Último Ingreso</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-bold text-white">{u.name}</div>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-rose-300 border border-slate-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{u.specialty || 'General'}</td>
                  <td className="p-3 text-slate-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('es-CO') : 'Nunca'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {can('users.manage') && u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleToggleUserStatus(u._id, u.status)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
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
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CRM_ROLES_LIST.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}>
                {r.id}
              </span>
              <h3 className="text-sm font-bold text-white pt-1">{r.label}</h3>
              <p className="text-xs text-slate-400">{r.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Acción</th>
                <th className="p-3">Entidad</th>
                <th className="p-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/40">
                  <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleString('es-CO')}</td>
                  <td className="p-3 font-semibold text-slate-200">
                    {log.userName} <span className="text-[10px] text-slate-500">({log.userRole})</span>
                  </td>
                  <td className="p-3 text-rose-400 font-bold">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.entity}</td>
                  <td className="p-3 text-slate-500">{log.ip || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear Usuario */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-rose-400" />
                Crear Nuevo Usuario del CRM
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dra. Laura Gómez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Institucional *</label>
                  <input
                    type="email"
                    required
                    placeholder="laura@fundacionsendamujer.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rol Asignado *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    {CRM_ROLES_LIST.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Especialidad / Cargo</label>
                  <input
                    type="text"
                    placeholder="Ej. Psicóloga Clínica / Abogada de Género"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contraseña Inicial (mín 8 caracteres) *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-2 bg-slate-800 rounded-xl">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-rose-600 font-bold text-white rounded-xl">
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
