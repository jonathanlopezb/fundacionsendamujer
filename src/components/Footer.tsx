import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Scale, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-senda-purple-dark text-pink-100 pt-16 pb-12 border-t border-senda-purple">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Logo & About */}
        <div className="space-y-4">
          <div className="relative w-56 h-16 bg-white/90 rounded-xl p-2 shadow-inner">
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
          <p className="text-xs font-semibold text-amber-300 italic">
            &ldquo;Ninguna mujer debería enfrentar sola su camino ♡&rdquo;
          </p>
        </div>

        {/* Col 2: Cartagena Emergency Contacts */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Cartagena & Atención 24/7
          </h4>
          <ul className="text-xs space-y-2 text-pink-100">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-senda-pink shrink-0 mt-0.5" />
              <span>Sede Principal: Cartagena de Indias, Bolívar (Barrio Manga / Pie de la Popa)</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="tel:3176575800" className="hover:text-amber-300 font-semibold">
                Línea Directa / WhatsApp: +57 317 657 5800
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-senda-pink shrink-0" />
              <span>Línea Púrpura Nacional: 155 | Policía: 123</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>contacto@fundacionsendamujer.org</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Programas & Navegación */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider">
            Nuestros 7 Programas
          </h4>
          <ul className="text-xs space-y-2 text-pink-200">
            <li><Link href="/programas#programa-1" className="hover:text-white">🌷 Mujer Acompañada</Link></li>
            <li><Link href="/programas#programa-2" className="hover:text-white">🕊️ Víctimas Violencia Sexual</Link></li>
            <li><Link href="/programas#programa-3" className="hover:text-white">🧠 Contención Psicosocial</Link></li>
            <li><Link href="/programas#programa-4" className="hover:text-white">⚕️ Ruta de Salud & Derechos</Link></li>
            <li><Link href="/programas#programa-5" className="hover:text-white">🤰 Embarazo con Apoyo</Link></li>
            <li><Link href="/programas#programa-6" className="hover:text-white">👩‍⚖️ Mujer y Justicia</Link></li>
            <li><Link href="/programas#programa-7" className="hover:text-white">🎓 Proyecto de Vida</Link></li>
            <li className="pt-1 border-t border-purple-800/40"><Link href="/#aliados" className="text-amber-300 font-bold hover:text-white flex items-center gap-1">🤝 nuestros Aliados Institucionales</Link></li>
          </ul>
        </div>

        {/* Col 4: Marco Jurídico & Garantía Confidencial */}
        <div className="space-y-3">
          <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4" /> Marco Jurídico & Derechos
          </h4>
          <p className="text-[11px] text-pink-200 leading-relaxed bg-senda-purple/60 p-3 rounded-lg border border-pink-500/20">
            Orientación bajo la jurisprudencia constitucional colombiana (Sentencia C-055 de 2022 y C-355 de 2006). Acompañamiento imparcial, confidencial y respetuoso tanto en la interrupción voluntaria como en la continuidad del embarazo y adopción.
          </p>
          <div className="pt-1 flex items-center gap-2 text-xs text-amber-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Confidencialidad y Protección de Datos</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-6 border-t border-pink-900/50 flex flex-col md:flex-row justify-between items-center text-xs text-pink-300">
        <p>© {new Date().getFullYear()} Fundación Senda Mujer. Todos los derechos reservados. Cartagena, Colombia.</p>
        <p className="mt-2 md:mt-0 flex items-center gap-1">
          <span>Diseño Elite para la Protección e Inclusión Femenina</span>
          <Heart className="w-3 h-3 text-senda-pink fill-senda-pink" />
        </p>
      </div>
    </footer>
  );
}
