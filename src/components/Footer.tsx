import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return <footer className="senda-footer">
    <div className="senda-footer__top"><div className="senda-footer__brand"><div className="!w-[220px] !h-[68px]"><Image src="/logo.png" alt="Fundación Senda Mujer" fill className="object-contain" sizes="220px"/></div><p>Acompañamiento, protección y fortalecimiento integral para mujeres y niñas en Cartagena.</p><strong>“Ninguna mujer debería enfrentar sola su camino.”</strong></div>
      <div><h3>Encuentra tu ruta</h3><Link href="/triaje-psicologico">Test psicológico</Link><Link href="/agendar-cita">Agendar una cita</Link><Link href="/senda-universal">SENDA Universal</Link><Link href="/caribe-seguro">Senda Caribe</Link></div>
      <div><h3>Contacto 24/7</h3><p><b>Sede principal</b><br/>Barrio Arroz Barato<br/>Cartagena de Indias, Bolívar</p><a href="tel:+573014692095">+57 301 469 2095</a><a href="tel:155">Línea Púrpura Nacional 155</a></div>
      <div><h3>Conoce más</h3><Link href="/nosotros">Quiénes somos</Link><Link href="/modelos">Modelos CAM y THEMIS</Link><Link href="/caribe-seguro/aliados">Aliados</Link><Link href="/galeria">Galería</Link><Link href="/donar">Donaciones</Link></div>
    </div><div className="senda-footer__bottom"><span>© {new Date().getFullYear()} Fundación Senda Mujer · Cartagena, Colombia</span><span>Confidencialidad y protección de datos · Ley 1581</span></div>
  </footer>;
}
