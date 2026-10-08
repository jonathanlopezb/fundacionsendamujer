'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CrmRole, Permission, hasPermission, canAccessModule } from './permissions';

export interface CrmUserClient {
  id: string;
  name: string;
  email: string;
  role: CrmRole;
  phone?: string;
  documentNumber?: string;
  specialty?: string;
  scopes?: {
    programIds: string[];
    projectIds: string[];
  };
  permissions: Permission[];
}

interface CrmAuthContextType {
  user: CrmUserClient | null;
  loading: boolean;
  isFirstRun: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  can: (permission: Permission) => boolean;
  canAccess: (moduleName: string) => boolean;
}

const CrmAuthContext = createContext<CrmAuthContextType | undefined>(undefined);

export function CrmAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CrmUserClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crm/auth/me', { cache: 'no-store' });
      const data = await res.json();

      if (data.isFirstRun) {
        setIsFirstRun(true);
        setUser(null);
      } else if (data.authenticated && data.user) {
        setIsFirstRun(false);
        setUser(data.user);
      } else {
        setIsFirstRun(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Error al consultar sesión CRM:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    try {
      await fetch('/api/crm/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/crm/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const can = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const canAccess = (moduleName: string): boolean => {
    if (!user) return false;
    return canAccessModule(user.role, moduleName);
  };

  return (
    <CrmAuthContext.Provider
      value={{
        user,
        loading,
        isFirstRun,
        refreshUser,
        logout,
        can,
        canAccess,
      }}
    >
      {children}
    </CrmAuthContext.Provider>
  );
}

export function useCrmAuth() {
  const context = useContext(CrmAuthContext);
  if (!context) {
    throw new Error('useCrmAuth debe usarse dentro de un CrmAuthProvider');
  }
  return context;
}
