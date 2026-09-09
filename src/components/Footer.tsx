import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-senda-purple-dark text-pink-100 pt-16 pb-12 border-t border-senda-purple font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Logo & About */}
        <div className="space-y-4">
          <div className="relative w-56 h-16 bg-white/95 rounded-2xl p-2 shadow-sm">
            <Image
              src="/logo.png"
              alt="Fundación Senda Mujer"
              fill
              className="object-contain p-1"
            />
          </div>
          <p className="text-xs text-pink-200 leading-relaxed">
            Fundación para el acompañamiento, protección y fortalecimiento integral de mujeres y niñas en situación de vulnerabilidad en Cartagena, Bolívar y Colombia.
          </p>
          <p className="text-xs font-bold text-amber-300 italic">
            &ldquo;Ninguna mujer debería enfrentar sola su camino&rdquo;
          </p>
        </div>

        {/* Col 2: Cartagena Emergency Contacts */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            Cartagena & Atención 24/7
          </h4>
          <ul className="text-xs space-y-2 text-pink-100">
            <li className="leading-relaxed">
              <span className="font-bold text-white block">Sede Principal:</span>
              Cartagena de Indias, Bolívar (Barrio Manga / Pie de la Popa)
            </li>
            <li>
              <span className="font-bold text-white block">Línea Directa / WhatsApp:</span>
              <a href="tel:3014692095" className="hover:text-amber-300 font-semibold text-pink-200">
                +57 301 469 2095
              </a>
            </li>
            <li>
              <span className="font-bold text-white block">Líneas de Emergencia:</span>
              Línea Púrpura Nacional 155 · Policía 123
            </li>
            <li>
              <span className="font-bold text-white block">Correo Electrónico:</span>
              <span className="text-pink-200">contacto@fundacionsendamujer.org</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Programas & Navegación */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            Nuestros 7 Programas
          </h4>
          <ul className="text-xs space-y-2 text-pink-200">
            <li><Link href="/programas#programa-1" className="hover:text-white transition-colors">Mujer Acompañada</Link></li>
            <li><Link href="/programas#programa-2" className="hover:text-white transition-colors">Víctimas Violencia Sexual</Link></li>
            <li><Link href="/programas#programa-3" className="hover:text-white transition-colors">Contención Psicosocial</Link></li>
            <li><Link href="/programas#programa-4" className="hover:text-white transition-colors">Ruta de Salud & Derechos</Link></li>
            <li><Link href="/programas#programa-5" className="hover:text-white transition-colors">Embarazo con Apoyo</Link></li>
            <li><Link href="/programas#programa-6" className="hover:text-white transition-colors">Mujer y Justicia</Link></li>
            <li><Link href="/programas#programa-7" className="hover:text-white transition-colors">Proyecto de Vida</Link></li>
            <li className="pt-1.5 border-t border-purple-800/40">
              <Link href="/#aliados" className="text-amber-300 font-bold hover:text-white transition-colors">
                Nuestros Aliados Institucionales →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Marco Jurídico & Garantía Confidencial */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            Marco Jurídico & Derechos
          </h4>
          <p className="text-[11px] text-pink-200 leading-relaxed bg-senda-purple/60 p-3.5 rounded-2xl border border-pink-500/20">
            Orientación bajo la jurisprudencia constitucional colombiana (Sentencia C-055 de 2022 y C-355 de 2006). Acompañamiento imparcial, confidencial y respetuoso tanto en la interrupción voluntaria como en la continuidad del embarazo y adopción.
          </p>
          <div className="pt-1 text-xs text-emerald-300 font-bold">
            100% Confidencialidad y Protección de Datos Ley 1581
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-6 border-t border-pink-900/50 flex flex-col md:flex-row justify-between items-center text-xs text-pink-300">
        <p>© {new Date().getFullYear()} Fundación Senda Mujer. Todos los derechos reservados. Cartagena, Colombia.</p>
        <p className="mt-2 md:mt-0 font-medium">
          Diseño Elite para la Protección e Inclusión Femenina
        </p>
      </div>
    </footer>
  );
}
