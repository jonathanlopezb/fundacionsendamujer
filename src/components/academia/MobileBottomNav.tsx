'use client';
import React from 'react';
import { Home, BookOpen, Radio, Users, User } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  user: { name: string; email: string } | null;
}

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  onOpenAuth,
  user,
}: Props) {
  const items = [
    { id: 'Inicio', label: 'Inicio', icon: Home },
    { id: 'Cursos', label: 'Cursos', icon: BookOpen },
    { id: 'En vivo', label: 'En vivo', icon: Radio, hasBadge: true },
    { id: 'Comunidad', label: 'Comunidad', icon: Users },
    { id: 'Recursos', label: user ? 'Logros' : 'Perfil', icon: User },
  ];

  const handleClick = (id: string) => {
    if (id === 'Recursos' && !user) {
      onOpenAuth();
    } else {
      onSelectTab(id);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#12031a]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              isActive
                ? 'text-pink-400 font-bold scale-105'
                : 'text-pink-100/60 hover:text-white'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-pink-400' : 'text-pink-100/60'}`} />
              {item.hasBadge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
