'use client';

import React, { useState, useEffect } from 'react';
import CmsSetupScreen from '@/components/cms/CmsSetupScreen';
import CmsLoginScreen from '@/components/cms/CmsLoginScreen';
import CmsDashboard from '@/components/cms/CmsDashboard';

export default function CmsPage() {
  const [loading, setLoading] = useState(true);
  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const checkStatus = async () => {
    try {
      setLoading(true);
      // 1. Verificar si hay super admin
      const statusRes = await fetch('/api/cms/auth/status');
      const statusData = await statusRes.json();
      setHasSuperAdmin(statusData.hasSuperAdmin);

      // 2. Si ya hay super admin, verificar si hay sesión activa
      if (statusData.hasSuperAdmin) {
        const meRes = await fetch('/api/cms/auth/me');
        const meData = await meRes.json();
        if (meRes.ok && meData.authenticated) {
          setCurrentUser(meData.user);
        } else {
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.warn('Error al verificar estado del CMS:', err);
      setHasSuperAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/cms/auth/logout', { method: 'POST' });
      setCurrentUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-purple-300 font-bold uppercase tracking-wider">
          Iniciando entorno seguro CMS…
        </p>
      </div>
    );
  }

  // 1. Primer ingreso: No hay super admin creado aún en MongoDB
  if (!hasSuperAdmin) {
    return (
      <CmsSetupScreen
        onSuccess={(user) => {
          setHasSuperAdmin(true);
          setCurrentUser(user);
        }}
      />
    );
  }

  // 2. Hay super admin, pero no ha iniciado sesión
  if (!currentUser) {
    return (
      <CmsLoginScreen
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

  // 3. Usuario autenticado: Mostrar panel de control
  return <CmsDashboard currentUser={currentUser} onLogout={handleLogout} />;
}
