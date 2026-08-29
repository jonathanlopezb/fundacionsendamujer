'use client';

import React, { useEffect, useState } from 'react';
import { ChefHat, ArrowLeft, Search, Bookmark, Utensils, Heart } from 'lucide-react';

interface CamouflageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CamouflageOverlay({ isOpen, onClose }: CamouflageOverlayProps) {
  const [activeTab, setActiveTab] = useState<'recetas' | 'tips' | 'postres'>('recetas');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-amber-50 text-slate-800 overflow-y-auto font-sans animate-fadeIn">
      {/* Camouflage Top Bar */}
      <header className="bg-amber-800 text-amber-50 px-6 py-4 shadow-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-700 p-2 rounded-lg">
            <ChefHat className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight">Sabores de La Heroica</h1>
            <p className="text-xs text-amber-200">Gastronomía & Recetas Tradicionales de Cartagena</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-xs bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded-full transition-colors"
            title="Volver de forma discreta"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Salir de cocina</span>
          </button>
        </div>
      </header>

      {/* Camouflage Banner */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <span className="bg-amber-500/30 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Especial Gastronómico Cartagena
          </span>
          <h2 className="text-3xl font-bold mt-3 mb-2">Las 5 Mejores Recetas de Postres y Arroces Caribeños</h2>
          <p className="text-amber-100 text-sm max-w-2xl">
            Aprende a preparar el auténtico Arroz con Coco Titoté, Arepa e&apos; Huevo y la Posta Cartagenera con el secreto del azúcar moreno y clavos de olor.
          </p>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 border-b border-amber-200 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('recetas')}
            className={`font-medium text-sm px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'recetas' ? 'bg-amber-800 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Platos Típicos
          </button>
          <button
            onClick={() => setActiveTab('postres')}
            className={`font-medium text-sm px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'postres' ? 'bg-amber-800 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Dulces del Portal de los Dulces
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`font-medium text-sm px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tips' ? 'bg-amber-800 text-white' : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            Consejos de Cocina
          </button>
        </div>

        {/* Grid of Camouflage Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-amber-200 h-40 flex items-center justify-center text-amber-700">
              <Utensils className="w-12 h-12 opacity-50" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center text-xs text-amber-800 font-semibold mb-2">
                <span>⏱️ 45 MIN</span>
                <span>FÁCIL</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Arroz de Titoté y Coco</h3>
              <p className="text-xs text-slate-600 mb-4">
                El secreto consiste en fritar la primera leche de coco hasta formar los chicharroncitos oscuros dorados.
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-amber-50">
                <span className="text-xs text-amber-700 font-semibold">4 Porciones</span>
                <Heart className="w-4 h-4 text-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-amber-300 h-40 flex items-center justify-center text-amber-800">
              <Utensils className="w-12 h-12 opacity-50" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center text-xs text-amber-800 font-semibold mb-2">
                <span>⏱️ 30 MIN</span>
                <span>TRADICIONAL</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Posta Negra a la Cartagenera</h3>
              <p className="text-xs text-slate-600 mb-4">
                Punta de anca sellada y dorada a fuego lento con salsa de panela, cebolla, ajo y malta caribeña.
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-amber-50">
                <span className="text-xs text-amber-700 font-semibold">6 Porciones</span>
                <Heart className="w-4 h-4 text-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-amber-100 h-40 flex items-center justify-center text-amber-700">
              <Utensils className="w-12 h-12 opacity-50" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center text-xs text-amber-800 font-semibold mb-2">
                <span>⏱️ 20 MIN</span>
                <span>RÁPIDO</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">Cocada de Guayaba y Ajonjolí</h3>
              <p className="text-xs text-slate-600 mb-4">
                El postre tradicional del centro histórico con coco rallado fresco y panela derretida.
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-amber-50">
                <span className="text-xs text-amber-700 font-semibold">12 Unidades</span>
                <Heart className="w-4 h-4 text-amber-500 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Safety Info */}
        <div className="mt-12 p-4 bg-amber-100/50 rounded-xl text-center text-xs text-amber-900 flex justify-between items-center">
          <span>💡 Consejo: Guarda esta página en favoritos para consultar más recetas de la Costa Caribe.</span>
          <button
            onClick={onClose}
            className="text-amber-800 underline font-semibold hover:text-amber-950"
          >
            Volver a Navegar
          </button>
        </div>
      </div>
    </div>
  );
}
