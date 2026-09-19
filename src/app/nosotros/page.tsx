import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Quiénes somos', description: 'Conoce Fundación Senda Mujer y nuestro modelo de acompañamiento para mujeres y niñas en Cartagena.', alternates: { canonical: '/nosotros' } };
import type { ComponentType } from 'react';
import { ArrowRight, HeartHandshake, Scale, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { DefensoriaLogo, ProfamiliaLogo, UnicartagenaLogo } from '@/components/AllyLogos';

const principles = ['Dignidad humana', 'Autonomía', 'Confidencialidad', 'No discriminación', 'Enfoque de género', 'Derechos humanos'];

const allies: Array<{ Logo: ComponentType<{ className?: string; size?: number }>; name: string }> = [
  { Logo: DefensoriaLogo, name: 'Defensoría del Pueblo' },
  { Logo: ProfamiliaLogo, name: 'Profamilia' },
  { Logo: UnicartagenaLogo, name: 'Universidad de Cartagena' },
];

export default function NosotrosPage() {
  return <main className="prototype-home senda-about">
    <section className="senda-about__hero"><div className="senda-shell senda-about__hero-grid"><div><p className="senda-eyebrow">Fundación Senda Mujer · Cartagena</p><h1>Cuidar, orientar y abrir caminos posibles.</h1><p>Somos una fundación que acompaña a mujeres y niñas desde la escucha, el respeto por sus decisiones y la conexión con rutas de protección, salud, justicia y autonomía.</p><Link className="senda-button senda-button--primary" href="/agendar-cita">Hablar con Senda <ArrowRight/></Link></div><div className="senda-about__photo"><Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85" alt="Equipo de acompañamiento de Fundación Senda Mujer" fill priority className="object-cover" sizes="(max-width: 900px) 100vw, 44vw"/><span>Cartagena · Bolívar</span></div></div></section>
    <section className="senda-section"><div className="senda-shell senda-about__intro"><p className="senda-eyebrow">Quiénes somos</p><h2>Una red humana para momentos que no deberían vivirse a solas.</h2><p>Trabajamos por el acompañamiento, protección y fortalecimiento integral de mujeres y niñas en situación de vulnerabilidad. Articulamos orientación social, apoyo psicosocial, salud, derechos y oportunidades para construir alternativas de vida digna.</p></div></section>
    <section className="senda-about__purpose"><div className="senda-shell senda-about__purpose-grid"><article><span><HeartHandshake/></span><p className="senda-eyebrow">Nuestra misión</p><h2>Acompañar decisiones libres e informadas.</h2><p>Brindar atención integral, gratuita y confidencial a mujeres y niñas, fortaleciendo sus derechos, su bienestar y sus redes de apoyo mediante rutas claras y atención cercana.</p></article><article><span><Sparkles/></span><p className="senda-eyebrow">Nuestra visión</p><h2>Un Caribe donde ninguna mujer camine sola.</h2><p>Ser una referencia territorial de cuidado y protección, reconocida por transformar barreras en oportunidades y por impulsar comunidades más seguras, equitativas y solidarias.</p></article></div></section>
    <section className="senda-section"><div className="senda-shell"><div className="senda-section-head"><div><p className="senda-eyebrow">Cómo actuamos</p><h2>Principios que guían cada atención.</h2></div><p>La persona, su seguridad y su decisión están siempre en el centro.</p></div><div className="senda-about__principles">{principles.map((principle, index) => <div key={principle}><span>0{index + 1}</span><h3>{principle}</h3></div>)}</div></div></section>
    <section className="senda-about__rights"><div className="senda-shell"><Scale/><div><p className="senda-eyebrow">Autonomía y derechos</p><h2>Acompañamos sin juzgar.</h2><p>Ofrecemos orientación respetuosa para que cada mujer pueda conocer sus opciones y tomar decisiones informadas sobre su vida, su salud y su proyecto personal. La confidencialidad y el respeto son irrenunciables.</p></div><ShieldCheck/></div></section>
    <section className="senda-allies senda-allies--logos" aria-labelledby="allies-title"><div className="senda-shell"><p className="senda-eyebrow">Alianzas que protegen</p><h2 id="allies-title">Una red que amplía el alcance del cuidado.</h2><p className="senda-allies__intro">Aliados institucionales que fortalecen las rutas de derechos, salud y formación en el territorio.</p><div className="senda-logo-row">{allies.map(({ Logo, name }) => <div className="senda-logo-card" key={name}><Logo size={76} className="h-[76px] w-[76px]"/><span>{name}</span></div>)}</div></div></section>
    <section className="senda-section"><div className="senda-shell senda-donate"><div><p className="senda-eyebrow">Haz parte</p><h2>El cuidado colectivo transforma vidas.</h2><p>Tu aporte se convierte en atención, orientación y oportunidades concretas para mujeres y niñas de Cartagena.</p></div><Link href="/donar" className="senda-button senda-button--primary">Quiero apoyar <ArrowRight/></Link></div></section>
  </main>;
}
