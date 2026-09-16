import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="senda-hero">
      <div className="senda-shell senda-hero__grid">
        <div className="senda-hero__content">
          <p className="senda-eyebrow">Cartagena · Bolívar · Colombia</p>
          <h1>Ninguna mujer debería enfrentar <em>sola</em> su camino.</h1>
          <p className="senda-hero__lead">Acompañamiento gratuito, confidencial e integral para mujeres y niñas que necesitan apoyo psicológico, médico, jurídico o social.</p>
          <div className="senda-hero__actions">
            <Link href="#necesidades" className="senda-button senda-button--primary">Necesito ayuda <span aria-hidden="true">→</span></Link>
            <Link href="/triaje-psicologico" className="senda-button senda-button--secondary">Hacer test psicológico</Link>
          </div>
          <p className="senda-assurances"><span>● Gratuito</span><span>● Confidencial</span><span>● Sin juzgamiento</span></p>
        </div>
        <div className="senda-hero__image-wrap"><div className="senda-hero__image">
          <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=85" alt="Acompañamiento humano y profesional de Fundación Senda Mujer" fill priority className="object-cover" sizes="(max-width: 900px) 100vw, 43vw" />
          <div className="senda-hero__image-gradient" />
          <div className="senda-hero__caption"><strong>Sorelvis Murillo Arreola</strong><span>Trabajadora Social</span></div>
        </div></div>
      </div>
    </section>
  );
}
