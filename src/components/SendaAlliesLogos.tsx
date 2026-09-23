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
  allies = DEFAULT_ALLIES,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  allies?: AllyItem[];
}) {
  return (
    <section className="senda-allies senda-allies--logos" aria-labelledby="allies-title">
      <div className="senda-shell">
        <p className="senda-eyebrow">{eyebrow}</p>
        <h2 id="allies-title">{title}</h2>
        <p className="senda-allies__intro">{intro}</p>
        <div className="senda-logo-row">
          {allies.map(({ src, name }) => (
            <div className="senda-logo-card" key={name}>
              <Image
                src={src}
                alt={`Logo de ${name}`}
                width={180}
                height={120}
                className="senda-logo-card__image"
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
