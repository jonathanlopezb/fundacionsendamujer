'use client';
import React, { useState, useEffect } from 'react';
import AcademiaNavbar from '@/components/academia/AcademiaNavbar';
import LiveClassBanner from '@/components/academia/LiveClassBanner';
import CourseCatalog from '@/components/academia/CourseCatalog';
import AuthModal from '@/components/academia/AuthModal';
import AcademiaFooter from '@/components/academia/AcademiaFooter';

export default function AcademiaPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('senda_academia_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (name: string, email: string) => {
    const userData = { name, email };
    setUser(userData);
    localStorage.setItem('senda_academia_user', JSON.stringify(userData));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('senda_academia_user');
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f', color: '#f0f0f5' }}>
      <AcademiaNavbar user={user} onOpenAuth={openAuth} onLogout={handleLogout} />
      <LiveClassBanner onOpenAuth={() => openAuth('register')} user={user} />
      <CourseCatalog user={user} onOpenAuth={() => openAuth('login')} />
      <AcademiaFooter />
      {authModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLogin={handleLogin}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </div>
  );
}
