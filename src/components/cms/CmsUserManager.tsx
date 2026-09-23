'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Users, Shield, Trash2, CheckCircle2, AlertTriangle, KeyRound, Mail, User, Lock, Edit3, X } from 'lucide-react';

interface CmsUserRecord {
  id: string;
  fullName: string;
  email: string;
  username: string;
  documentNumber?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';
  status: 'ACTIVO' | 'INACTIVO';
  lastLogin?: string;
  createdBy?: string;
  createdAt: string;
}

export default function CmsUserManager({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<CmsUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulario nuevo usuario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'>('ADMIN');
  const [documentNumber, setDocumentNumber] = useState('');
  const [creating, setCreating] = useState(false);

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/users');
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Error al cargar usuarios.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con la API de usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Crear usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setCreating(true);

    try {
      const res = await fetch('/api/cms/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
          role,
          documentNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al crear usuario.');
      }

      setSuccessMsg('¡Usuario creado exitosamente!');
      setShowModal(false);
      setFullName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setDocumentNumber('');
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el nuevo usuario.');
    } finally {
      setCreating(false);
    }
  };

  // Alternar estado de usuario
  const handleToggleStatus = async (user: CmsUserRecord) => {
    const nextStatus = user.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      const res = await fetch(`/api/cms/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Estado de ${user.fullName} actualizado a ${nextStatus}.`);
        loadUsers();
      } else {
        setError(data.error || 'Error al cambiar estado.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario.');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Usuario ${name} eliminado.`);
        loadUsers();
      } else {
        setError(data.error || 'Error al eliminar usuario.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#240a38]/80 border border-purple-800/60 rounded-3xl p-6">
        <div>
          <div className="flex items-center gap-2 text-pink-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-pink-400" />
            Control de Accesos y Seguridad
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Gestión de Usuarios del CMS</h2>
          <p className="text-xs text-purple-300/70 mt-1">
            Crea administradores y editores con permisos controlados para gestionar el contenido.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-300 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="bg-[#240a38]/80 border border-purple-800/60 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-purple-300">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Cargando usuarios autorizados…</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-purple-300/70 text-xs">
            No se encontraron usuarios adicionales registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-purple-100">
              <thead className="bg-[#180426] text-[11px] font-bold text-purple-300 uppercase tracking-wider border-b border-purple-800/60">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Usuario / Nombre</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Rol</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Último Acceso</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-800/40">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-purple-950/30 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-white flex items-center gap-2">
                          {u.fullName}
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-purple-300/70 font-mono">@{u.username}</div>
                      </td>
                      <td className="py-4 px-4 text-purple-200">{u.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : u.role === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {u.role === 'SUPER_ADMIN' ? 'Super Admin' : u.role === 'ADMIN' ? 'Administrador' : 'Editor'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          disabled={isCurrent}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                            u.status === 'ACTIVO'
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                          } disabled:cursor-not-allowed`}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-purple-300/70 text-[11px]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit' }) : 'Sin registros'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación de Usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#240a38] border border-purple-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Crear Nuevo Usuario del CMS</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Nombre Completo <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Ana Pérez"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Correo <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ana@sendamujer.org"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Usuario <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ana.perez"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Rol Asignado
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-pink-500"
                  >
                    <option value="ADMIN">Administrador (Imágenes y SEO)</option>
                    <option value="EDITOR">Editor (Solo Imágenes)</option>
                    <option value="SUPER_ADMIN">Super Administrador (Total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                    Documento (Opcional)
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="C.C. número"
                    className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1 uppercase tracking-wider">
                  Contraseña Inicial <span className="text-pink-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#180426] border border-purple-700/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/30 outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-purple-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-pink-700 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-700/30 flex items-center gap-1.5"
                >
                  {creating ? 'Guardando…' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
