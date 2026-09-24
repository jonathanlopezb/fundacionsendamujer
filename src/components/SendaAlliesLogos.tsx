'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

interface AllyItem {
  src: string;
  name: string;
}

const DEFAULT_ALLIES: AllyItem[] = [
  { src: '/defensoria.png', name: 'Defensoría del Pueblo' },
  { src: '/profamilia.jpg', name: 'Profamilia' },
  { src: '/sena.png', name: 'SENA' },
];

export default function SendaAlliesLogos({
  eyebrow = 'Alianzas que protegen',
  title = 'Juntas hacemos que cada ruta llegue más lejos.',
  intro = 'Una red institucional comprometida con el cuidado, los derechos y la autonomía de las mujeres.',
  allies: initialAllies,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  allies?: AllyItem[];
}) {
  const [alliesList, setAlliesList] = useState<AllyItem[]>(initialAllies || DEFAULT_ALLIES);

  useEffect(() => {
    async function loadDynamicAllies() {
      try {
        const res = await fetch('/api/cms/allies');
        const data = await res.json();
        if (data.allies && data.allies.length > 0) {
          const featured = data.allies.filter((a: any) => a.isFeaturedInHome !== false);
          if (featured.length > 0) {
            setAlliesList(
              featured.map((a: any) => ({
                src: a.logoUrl || a.src,
                name: a.name,
              }))
            );
          }
        }
      } catch (err) {
        console.warn('Usando lista de aliados predeterminada:', err);
      }
    }
    loadDynamicAllies();
  }, []);

  return (
    <section className="senda-allies senda-allies--logos" aria-labelledby="allies-title">
      <div className="senda-shell">
        <p className="senda-eyebrow">{eyebrow}</p>
        <h2 id="allies-title">{title}</h2>
        <p className="senda-allies__intro">{intro}</p>
        <div className="senda-logo-row">
          {alliesList.map(({ src, name }) => (
            <div className="senda-logo-card" key={name}>
              <img
                src={src}
                alt={`Logo de ${name}`}
                width={180}
                height={120}
                className="senda-logo-card__image object-contain max-h-[70px] w-auto mx-auto"
              />
            </div>
          ))}
        </div>
        <div className="senda-donation-cert">
          <ShieldCheck aria-hidden="true" />
          <p>
            <strong>Donaciones con constancia.</strong>
            <span>Certificamos cada donación recibida y hacemos seguimiento transparente a su destinación.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
