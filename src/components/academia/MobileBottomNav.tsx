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
    <nav
      aria-label="Navegación Móvil Principal"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#100318]/95 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-3.5 flex items-center justify-around shadow-[0_-10px_25px_rgba(0,0,0,0.5)] safe-area-pb"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative cursor-pointer active:scale-95 ${
              isActive
                ? 'text-white font-black'
                : 'text-pink-200/60 hover:text-white'
            }`}
          >
            {/* Active Pill Glow */}
            {isActive && (
              <span className="absolute -top-2 w-6 h-1 rounded-full bg-gradient-to-r from-pink-500 to-amber-300 shadow-[0_0_10px_#ec4899]" />
            )}
            
            <div className="relative p-1">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'text-pink-400 scale-110 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-pink-100/60'
                }`}
              />
              {item.hasBadge && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#100318] animate-pulse" />
              )}
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-pink-300 font-extrabold' : 'text-pink-200/60'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>

  );
}
