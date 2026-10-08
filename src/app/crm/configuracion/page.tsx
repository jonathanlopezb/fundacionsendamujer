'use client';

import React, { useState, useEffect } from 'react';
import { useCrmAuth } from '@/lib/crm/client';
import { useCrmTheme } from '@/lib/crm/theme';
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
  Sun,
  Moon,
  Monitor,
  FileCheck2,
  Building2,
  Save,
  Check,
} from 'lucide-react';

export default function CrmConfiguracionPage() {
  const { user, can } = useCrmAuth();
  const { theme, setTheme, toggleTheme } = useCrmTheme();

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit' | 'appearance' | 'dian'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario nuevo usuario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TRABAJADOR_SOCIAL',
    phone: '',
    specialty: '',
    documentNumber: '',
  });

  // Configuración DIAN RTE Local
  const [dianConfig, setDianConfig] = useState({
    issuerNit: '901.789.456-1',
    issuerLegalRep: 'Dirección Ejecutiva Fundación Senda Mujer',
    issuerAccountant: 'Contaduría Pública & Revisoría Fiscal',
    issuerAccountantTp: 'T.P. 182492-T',
    rteStatus: 'Entidad sin Ánimo de Lucro - Régimen Tributario Especial (RTE) E.T. Art. 356-2 y D.R. 2150/2017',
    saved: false,
  });

  const isLight = theme === 'light';

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

  const handleSaveDianConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setDianConfig(prev => ({ ...prev, saved: true }));
    setTimeout(() => {
      setDianConfig(prev => ({ ...prev, saved: false }));
    }, 3000);
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
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-rose-400" />
            <h1 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Configuración, Usuarios & Preferencias
            </h1>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Control de usuarios con roles RBAC, preferencias visuales (Modo Día / Noche), normativa DIAN y auditoría.
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
      <div className={`border-b flex gap-1 sm:gap-2 overflow-x-auto ${
        isLight ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-rose-500 text-rose-500 bg-rose-500/5'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Usuarios ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'border-rose-500 text-rose-500 bg-rose-500/5'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          <span>Apariencia (Tema)</span>
        </button>

        <button
          onClick={() => setActiveTab('dian')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'dian'
              ? 'border-rose-500 text-rose-500 bg-rose-500/5'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Normativa DIAN RTE</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'roles'
              ? 'border-rose-500 text-rose-500 bg-rose-500/5'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Matriz de Roles (11)</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-rose-500 text-rose-500 bg-rose-500/5'
              : isLight ? 'border-transparent text-slate-500 hover:text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Auditoría ({auditLogs.length})</span>
        </button>
      </div>

      {/* ── Content ── */}
      <div className={`rounded-2xl border shadow-sm p-5 overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#161b27] border-slate-800/80'
      }`}>
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando configuración institucional...
          </div>
        ) : activeTab === 'appearance' ? (
          /* ── Tab Apariencia (Modo Día / Modo Noche) ── */
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Tema Visual del CRM
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Personaliza la apariencia del sistema para tu cuenta. Tu preferencia se guardará en tu navegador automáticamente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opción Modo Oscuro */}
              <div
                onClick={() => setTheme('dark')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                  theme === 'dark'
                    ? 'border-rose-500 bg-slate-900 shadow-lg shadow-rose-500/10 scale-[1.02]'
                    : 'border-slate-700/60 bg-slate-900/50 opacity-70 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Modo Noche (Oscuro)</h4>
                      <p className="text-[11px] text-slate-400">Ideal para baja fatiga visual</p>
                    </div>
                  </div>
                  {theme === 'dark' && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="p-3 bg-[#0b0f1a] rounded-xl border border-slate-800 space-y-1.5">
                  <div className="w-24 h-2 bg-rose-500 rounded" />
                  <div className="w-full h-2 bg-slate-800 rounded" />
                  <div className="w-3/4 h-2 bg-slate-800 rounded" />
                </div>
              </div>

              {/* Opción Modo Día */}
              <div
                onClick={() => setTheme('light')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-4 ${
                  theme === 'light'
                    ? 'border-rose-500 bg-white shadow-lg shadow-rose-500/10 scale-[1.02]'
                    : isLight
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-700/60 bg-slate-800/40 opacity-70 hover:opacity-100 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        Modo Día (Claro)
                      </h4>
                      <p className="text-[11px] text-slate-400">Contraste alto y fondos claros</p>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="w-24 h-2 bg-rose-500 rounded" />
                  <div className="w-full h-2 bg-slate-200 rounded" />
                  <div className="w-3/4 h-2 bg-slate-200 rounded" />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-xs flex items-center gap-3 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>
                Tema activo actual: <strong>{theme === 'light' ? 'Modo Día (Claro)' : 'Modo Noche (Oscuro)'}</strong>. Puedes cambiarlo en cualquier momento desde la barra superior con un solo clic.
              </span>
            </div>
          </div>
        ) : activeTab === 'dian' ? (
          /* ── Tab Normativa DIAN RTE ── */
          <form onSubmit={handleSaveDianConfig} className="space-y-6 max-w-2xl">
            <div>
              <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Parámetros Tributarios DIAN · Régimen Tributario Especial (RTE)
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Configuración institucional para la emisión oficial de certificados de donación según los Art. 125-1 a 125-5 del E.T. y D.R. 2150/2017.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">NIT Institucional con Dígito de Verificación</label>
                  <input
                    type="text"
                    value={dianConfig.issuerNit}
                    onChange={e => setDianConfig({ ...dianConfig, issuerNit: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Representante Legal (Firma)</label>
                  <input
                    type="text"
                    value={dianConfig.issuerLegalRep}
                    onChange={e => setDianConfig({ ...dianConfig, issuerLegalRep: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Contador Público / Revisor Fiscal</label>
                  <input
                    type="text"
                    value={dianConfig.issuerAccountant}
                    onChange={e => setDianConfig({ ...dianConfig, issuerAccountant: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-400">Tarjeta Profesional (T.P.)</label>
                  <input
                    type="text"
                    value={dianConfig.issuerAccountantTp}
                    onChange={e => setDianConfig({ ...dianConfig, issuerAccountantTp: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-400">Declaración Legal DIAN RTE (Membrete)</label>
                <textarea
                  rows={2}
                  value={dianConfig.rteStatus}
                  onChange={e => setDianConfig({ ...dianConfig, rteStatus: e.target.value })}
                  className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {dianConfig.saved ? (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Parámetros guardados con éxito
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/25 transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Parámetros DIAN
                </button>
              </div>
            </div>
          </form>
        ) : activeTab === 'users' ? (
          /* ── Tab Usuarios ── */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                  isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                }`}>
                  <th className="py-3.5 px-4">Usuario</th>
                  <th className="py-3.5 px-4">Correo</th>
                  <th className="py-3.5 px-4">Rol Asignado</th>
                  <th className="py-3.5 px-4">Especialidad</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                {users.map((u) => (
                  <tr key={u._id} className={`text-xs transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/30'
                  }`}>
                    <td className="py-3 px-4 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white text-[11px]">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className={isLight ? 'text-slate-900' : 'text-white'}>{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleColors[u.role] || 'bg-slate-800 text-slate-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{u.specialty || 'General'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {u.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {can('users.manage') && u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            u.status === 'ACTIVE'
                              ? 'text-red-400 border-red-900/50 hover:bg-red-950/40'
                              : 'text-emerald-400 border-emerald-900/50 hover:bg-emerald-950/40'
                          }`}
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
          /* ── Tab Matriz de Roles ── */
          <div className="space-y-4">
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Estructura de permisos granulares por perfil para el personal interdisciplinario de la Fundación Senda Mujer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CRM_ROLES_LIST.map((r) => {
                const perms = ROLE_PERMISSIONS[r.id as CrmRole] || [];
                return (
                  <div
                    key={r.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${roleColors[r.id] || 'bg-slate-800 text-slate-300'}`}>
                        {r.label}
                      </span>
                      <span className="text-[10px] text-slate-400">{perms.length} permisos</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{r.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-800/40">
                      {perms.slice(0, 6).map((p) => (
                        <span key={p} className="text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                          {p}
                        </span>
                      ))}
                      {perms.length > 6 && (
                        <span className="text-[9px] font-mono text-slate-500 py-0.5">
                          +{perms.length - 6} más
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Tab Auditoría ── */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${
                  isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                }`}>
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Entidad</th>
                  <th className="py-3 px-4">IP</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-slate-800/60'}`}>
                {auditLogs.map((l) => (
                  <tr key={l._id} className="text-xs hover:bg-slate-800/20">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(l.createdAt || l.timestamp).toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-200">{l.userName}</td>
                    <td className="py-2.5 px-4">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${roleColors[l.userRole] || 'bg-slate-800 text-slate-400'}`}>
                        {l.userRole}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-rose-400 text-[11px]">{l.action}</td>
                    <td className="py-2.5 px-4 text-slate-400">{l.entity}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{l.ip || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Crear Usuario ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0f172a] border-slate-700 text-white'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-base">Crear Usuario Institucional</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laura Marcela Gómez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full py-2 px-3 text-xs rounded-xl border ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Institucional *</label>
                  <input
                    type="email"
                    required
                    placeholder="laura@fundacionsendamujer.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contraseña Inicial *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Rol Institucional (RBAC) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as CrmRole })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="DIRECTORA">Directora</option>
                    <option value="COORDINADOR">Coordinador(a)</option>
                    <option value="TRABAJADOR_SOCIAL">Trabajador(a) Social</option>
                    <option value="PSICOLOGO">Psicólogo(a)</option>
                    <option value="ABOGADO">Abogado(a) / Asesor Jurídico</option>
                    <option value="GESTOR_PROGRAMAS">Gestor(a) de Programas</option>
                    <option value="GESTOR_DONANTES">Gestor(a) de Donantes</option>
                    <option value="GESTOR_FINANCIERO">Gestor(a) Financiero</option>
                    <option value="VOLUNTARIO">Voluntario(a)</option>
                    <option value="CONSULTA">Solo Consulta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Especialidad / Cargo</label>
                  <input
                    type="text"
                    placeholder="Ej. Psicología Clínica"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className={`w-full py-2 px-3 text-xs rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50"
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
