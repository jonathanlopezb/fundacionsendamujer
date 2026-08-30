'use client';
import React from 'react';
import Link from 'next/link';
import { GraduationCap, Heart, ShieldCheck, Globe, PhoneCall } from 'lucide-react';

export default function AcademiaFooter() {
  return (
    <footer className="border-t py-12 px-4 sm:px-6 text-gray-400 text-xs" style={{ background: '#07070c', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white">SendaAcademia</div>
            <div className="text-[10px] text-gray-500">Plataforma Educativa de la Fundación Senda Mujer • Cartagena</div>
          </div>
        </div>

        {/* Center credits */}
        <div className="flex items-center gap-2 text-center text-[11px]">
          <span>Con el respaldo de la Fundación Senda Mujer & Dra. Sorelvis Caldera (+57 301 469 2095)</span>
        </div>

        {/* Back to main site link */}
        <div>
          <a
            href="/"
            className="text-xs font-semibold px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 text-purple-300 hover:text-white"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ir al Sitio Institucional Senda Mujer ↗</span>
          </a>
        </div>

      </div>
    </footer>
  );
}
