import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, MessageCircle, Scale, ShieldCheck, Stethoscope } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import SendaAlliesLogos from '@/components/SendaAlliesLogos';
import { getCmsImageMap } from '@/lib/cms-service';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const needs = [
  [ShieldCheck, 'Estoy viviendo violencia', 'Orientación, protección y rutas.', '/triaje-psicologico'],
  [MessageCircle, 'Necesito hablar con alguien', 'Escucha y contención emocional.', '/triaje-psicologico'],
  [Scale, 'Necesito orientación jurídica', 'Derechos y acompañamiento legal.', '/agendar-cita?especialidad=Asesor%C3%ADa%20Jur%C3%ADdica'],
  [Stethoscope, 'Necesito atención en salud', 'Orientación médica y social.', '/agendar-cita'],
] as const;
const programs = ['Mujer Acompañada', 'Violencia Sexual', 'Contención Psicosocial', 'Salud y Derechos', 'Embarazo con Apoyo', 'Mujer y Justicia', 'Proyecto de Vida'];

export default async function HomePage() {
  const images = await getCmsImageMap();

  return <div className="prototype-home" itemScope itemType="https://schema.org/NGO">
    <HeroSection />
    <section className="senda-help-spotlight" aria-labelledby="help-spotlight-title"><div className="senda-shell"><div className="senda-help-spotlight__test"><p className="senda-eyebrow">¿No sabes por dónde empezar?</p><h2 id="help-spotlight-title">Empieza con el Test Psicológico.</h2><p>Una guía privada para reconocer cómo te sientes y encontrar el siguiente paso de acompañamiento.</p><div><Link href="/triaje-psicologico" className="senda-button senda-button--primary">Hacer el test ahora <ArrowRight/></Link><span>Gratuito · Confidencial · A tu ritmo</span></div></div><div className="senda-help-spotlight__universal"><p className="senda-eyebrow">SENDA Universal</p><h3>Conoce tus derechos. Encuentra tu ruta.</h3><p>Orientación práctica sobre salud, protección y servicios disponibles.</p><Link href="/senda-universal">Explorar SENDA Universal <ArrowRight/></Link></div></div></section>
    <section id="necesidades" className="senda-section"><div className="senda-shell"><SectionHead eyebrow="Empieza por aquí" title="¿Qué necesitas hoy?" text="No tienes que conocer las instituciones ni las palabras correctas. Elige una opción y te mostramos el siguiente paso."/><div className="senda-needs">{needs.map(([Icon, title, text, href]) => <Link key={title} href={href} className="senda-need-card"><Icon/><h3>{title}</h3><p>{text}</p><span className="senda-need-card__action">Elegir esta opción <ArrowRight aria-hidden="true"/></span></Link>)}</div></div></section>
    <section id="acompanamos" className="senda-model"><div className="senda-shell"><SectionHead eyebrow="Nuestro modelo" title="Tu camino con Senda" text="Un acompañamiento claro, humano y continuo."/><ol>{[['01','Escuchamos','Entendemos tu situación sin juzgar.'],['02','Orientamos','Identificamos necesidades y prioridades.'],['03','Activamos tu ruta','Conectamos la ayuda profesional.'],['04','Acompañamos','Damos continuidad y fortalecemos autonomía.']].map(([number,title,text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>
    <section id="senda-caribe" className="senda-section"><div className="senda-shell senda-caribe"><div><p className="senda-eyebrow">Senda Caribe</p><h2>Protección cercana para un Caribe más seguro.</h2><p>Prevención, rutas de atención, acompañamiento profesional y evidencia territorial en un solo ecosistema.</p><Link href="/caribe-seguro" className="senda-button senda-button--sand">Conocer Senda Caribe <ArrowRight/></Link></div><aside><div className="senda-caribe__identity"><b>SC</b><p><strong>Centro de acompañamiento</strong><small>Tu ruta, en un solo lugar</small></p></div>{[['Encontrar una ruta','/caribe-seguro/rutas'],['Mi plan de protección','/caribe-seguro/proteccion'],['Red profesional','/caribe-seguro/red']].map(([label,href]) => <Link href={href} key={href}><span>{label}</span><ArrowRight/></Link>)}</aside></div></section>
    <section id="ruta" className="senda-digital"><div className="senda-shell senda-digital__grid"><div><p className="senda-eyebrow">Herramienta de derechos</p><h2>Conoce tus derechos y encuentra tu ruta.</h2><p>SENDA Universal te orienta con preguntas claras sobre salud, protección, derechos y servicios disponibles.</p><Link href="/senda-universal" className="senda-button senda-button--primary">Comenzar orientación <ArrowRight/></Link></div><div className="senda-digital__panel"><header><span>Orientación gratuita</span><b>Paso 1 de 5</b></header><i><span/></i><h3>¿Qué necesitas hoy?</h3><p><b>01</b> Conozcamos tu situación</p><p className="muted"><b>02</b> Identifiquemos opciones</p></div></div></section>
    <section id="programas" className="senda-section"><div className="senda-shell"><SectionHead eyebrow="Cómo ayudamos" title="Programas para situaciones reales." link="/programas" linkText="Ver todos los programas"/><div className="senda-programs">{programs.map((title,index) => <Link href="/programas" key={title}><span>{String(index + 1).padStart(2,'0')}</span><h3>{title}</h3><p>{['Primera escucha y orientación social.','Protección, salud y acompañamiento de caso.','Salud mental, duelo y redes de apoyo.','Atención médica, social y jurídica.','Acompañamiento durante una etapa decisiva.','Orientación legal para ejercer derechos.','Educación, autonomía y oportunidades.'][index]}</p><ArrowRight/></Link>)}</div></div></section>
    <section id="historias" className="senda-stories"><div className="senda-shell"><SectionHead eyebrow="Historias de impacto" title="Lo que pasa cuando alguien acompaña." link="/galeria" linkText="Ver galería completa"/><div className="senda-story-grid">
      <Story
        src={images.home_story_1?.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"}
        alt={images.home_story_1?.altText || "Jornada de salud en Cartagena"}
        main
        label={images.home_story_1?.caption || "Arroz Barato · Cartagena"}
        title="Una jornada de salud puede abrir una ruta de cuidado."
      />
      <Story
        src={images.home_story_2?.imageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85"}
        alt={images.home_story_2?.altText || "Círculo de apoyo"}
        label={images.home_story_2?.caption || "Contención"}
        title="Escuchar también es proteger"
      />
      <Story
        src={images.home_story_3?.imageUrl || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85"}
        alt={images.home_story_3?.altText || "Mujeres en formación"}
        label={images.home_story_3?.caption || "Autonomía"}
        title="Volver a imaginar un proyecto de vida"
      />
    </div></div></section>
    <section id="impacto" className="senda-impact"><div className="senda-shell"><div><p className="senda-eyebrow">Impacto verificable</p><h2>No son cifras.<br/><em>Son vidas.</em></h2><p>Conoce nuestras historias, jornadas y resultados en territorio.</p><Link href="/galeria" className="senda-text-link">Ver historias de impacto <ArrowRight/></Link></div><dl>{[['0+','Mujeres orientadas'],['0+','Rutas activadas'],['0+','Acciones de apoyo'],['0','Procesos de autonomía']].map(([value,label]) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl></div></section>
    <section id="apoyar" className="senda-section"><div className="senda-shell senda-donate"><div><p className="senda-eyebrow">Haz parte del cambio</p><h2>Tu aporte puede convertirse en una acción concreta.</h2><p>Apoya atención, protección, salud y autonomía para mujeres y niñas en Cartagena.</p></div><Link href="/donar" className="senda-button senda-button--primary"><HeartHandshake/> Quiero apoyar</Link></div></section>
    <section id="aliados" className="senda-allies"><div className="senda-shell"><SectionHead eyebrow="Red que suma" title="Aliados que hacen posible cada ruta." text="Trabajamos de forma articulada para que el acompañamiento llegue a donde más se necesita."/><div className="senda-allies__grid">{[['Instituciones de salud','Atención médica digna y oportuna','IPS y redes de salud'],['Organizaciones sociales','Cuidado comunitario y prevención','Colectivos territoriales'],['Empresas con propósito','Oportunidades para la autonomía','Aliados empresariales']].map(([title,text,type], index) => <article key={title}><span>0{index + 1}</span><div className="senda-allies__mark">{index === 0 ? '✚' : index === 1 ? '◌' : '↗'}</div><h3>{title}</h3><p>{text}</p><small>{type}</small></article>)}</div><Link href="/caribe-seguro/aliados" className="senda-text-link senda-allies__link">Conoce nuestra red de aliados <ArrowRight/></Link></div></section>
    <SendaAlliesLogos />
  </div>;
}

function SectionHead({ eyebrow, title, text, link, linkText }: { eyebrow: string; title: string; text?: string; link?: string; linkText?: string }) { return <div className="senda-section-head"><div><p className="senda-eyebrow">{eyebrow}</p><h2>{title}</h2></div>{link ? <Link href={link} className="senda-text-link">{linkText} <ArrowRight/></Link> : <p>{text}</p>}</div>; }
function Story({ src, alt, title, label, main = false }: { src:string; alt:string; title:string; label?:string; main?:boolean }) { return <Link href="/galeria" className={`senda-story ${main ? 'senda-story--main' : ''}`}><Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 800px) 100vw, 60vw"/><div>{label && <span>{label}</span>}<h3>{title}</h3>{main && <p>Leer historia <ArrowRight/></p>}</div></Link>; }
