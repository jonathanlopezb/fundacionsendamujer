'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, MessageCircle, Scale, ShieldCheck, Stethoscope } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import SendaAlliesLogos from '@/components/SendaAlliesLogos';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t, language } = useLanguage();
  const [images, setImages] = useState<Record<string, any>>({});
  const [stats, setStats] = useState<Record<string, any>>({
    site_impact_eyebrow: 'Impacto verificable',
    site_impact_title: 'Métricas reales,\nacompañamiento continuo.',
    site_impact_subtitle: 'Registramos y acompañamos cada caso con confidencialidad y rigor.',
    site_mujeres_orientadas: '1,450+',
    site_rutas_activadas: '620+',
    site_acciones_apoyo: '2,890+',
    site_procesos_autonomia: '340+',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [imagesRes, statsRes] = await Promise.all([
          fetch('/api/cms/images'),
          fetch('/api/cms/stats'),
        ]);
        if (imagesRes.ok) {
          const imgData = await imagesRes.json();
          if (imgData.images) setImages(imgData.images);
        }
        if (statsRes.ok) {
          const stData = await statsRes.json();
          if (stData.stats) setStats(stData.stats);
        }
      } catch (err) {
        // use default state
      }
    }
    loadData();
  }, []);

  const needs = [
    [ShieldCheck, t('needs.card1_title'), t('needs.card1_text'), '/triaje-psicologico'],
    [MessageCircle, t('needs.card2_title'), t('needs.card2_text'), '/triaje-psicologico'],
    [Scale, t('needs.card3_title'), t('needs.card3_text'), '/agendar-cita?especialidad=Asesor%C3%ADa%20Jur%C3%ADdica'],
    [Stethoscope, t('needs.card4_title'), t('needs.card4_text'), '/agendar-cita'],
  ] as const;

  const programs = [
    { title: t('programs.p1_title'), desc: t('programs.p1_desc') },
    { title: t('programs.p2_title'), desc: t('programs.p2_desc') },
    { title: t('programs.p3_title'), desc: t('programs.p3_desc') },
    { title: t('programs.p4_title'), desc: t('programs.p4_desc') },
    { title: t('programs.p5_title'), desc: t('programs.p5_desc') },
    { title: t('programs.p6_title'), desc: t('programs.p6_desc') },
    { title: t('programs.p7_title'), desc: t('programs.p7_desc') },
  ];

  return (
    <div className="prototype-home" itemScope itemType="https://schema.org/NGO">
      <HeroSection />

      {/* Spotlight */}
      <section className="senda-help-spotlight" aria-labelledby="help-spotlight-title">
        <div className="senda-shell">
          <div className="senda-help-spotlight__test">
            <p className="senda-eyebrow">{t('spotlight.test_eyebrow')}</p>
            <h2 id="help-spotlight-title">{t('spotlight.test_title')}</h2>
            <p>{t('spotlight.test_desc')}</p>
            <div>
              <Link href="/triaje-psicologico" className="senda-button senda-button--primary">
                {t('spotlight.test_btn')} <ArrowRight />
              </Link>
              <span>{t('spotlight.test_assurances')}</span>
            </div>
          </div>
          <div className="senda-help-spotlight__universal">
            <p className="senda-eyebrow">{t('spotlight.uni_eyebrow')}</p>
            <h3>{t('spotlight.uni_title')}</h3>
            <p>{t('spotlight.uni_desc')}</p>
            <Link href="/senda-universal">
              {t('spotlight.uni_btn')} <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* #necesidades (Necesito ayuda) */}
      <section id="necesidades" className="senda-section">
        <div className="senda-shell">
          <SectionHead
            eyebrow={t('needs.eyebrow')}
            title={t('needs.title')}
            text={t('needs.desc')}
          />
          <div className="senda-needs">
            {needs.map(([Icon, title, text, href]) => (
              <Link key={title} href={href} className="senda-need-card">
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="senda-need-card__action">
                  {t('needs.choose')} <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* #acompanamos */}
      <section id="acompanamos" className="senda-model">
        <div className="senda-shell">
          <SectionHead
            eyebrow={t('model.eyebrow')}
            title={t('model.title')}
            text={t('model.desc')}
          />
          <ol>
            {[
              ['01', t('model.step1_title'), t('model.step1_desc')],
              ['02', t('model.step2_title'), t('model.step2_desc')],
              ['03', t('model.step3_title'), t('model.step3_desc')],
              ['04', t('model.step4_title'), t('model.step4_desc')],
            ].map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* #senda-caribe */}
      <section id="senda-caribe" className="senda-section">
        <div className="senda-shell senda-caribe">
          <div>
            <p className="senda-eyebrow">{t('caribe.eyebrow')}</p>
            <h2>{t('caribe.title')}</h2>
            <p>{t('caribe.desc')}</p>
            <Link href="/caribe-seguro" className="senda-button senda-button--sand">
              {t('caribe.btn')} <ArrowRight />
            </Link>
          </div>
          <aside>
            <div className="senda-caribe__identity">
              <b>SC</b>
              <p>
                <strong>{t('caribe.badge_title')}</strong>
                <small>{t('caribe.badge_sub')}</small>
              </p>
            </div>
            {[
              [t('caribe.link1'), '/caribe-seguro/rutas'],
              [t('caribe.link2'), '/caribe-seguro/proteccion'],
              [t('caribe.link3'), '/caribe-seguro/red'],
            ].map(([label, href]) => (
              <Link href={href} key={href}>
                <span>{label}</span>
                <ArrowRight />
              </Link>
            ))}
          </aside>
        </div>
      </section>

      {/* #ruta */}
      <section id="ruta" className="senda-digital">
        <div className="senda-shell senda-digital__grid">
          <div>
            <p className="senda-eyebrow">{t('rights.eyebrow')}</p>
            <h2>{t('rights.title')}</h2>
            <p>{t('rights.desc')}</p>
            <Link href="/senda-universal" className="senda-button senda-button--primary">
              {t('rights.btn')} <ArrowRight />
            </Link>
          </div>
          <div className="senda-digital__panel">
            <header>
              <span>{t('rights.panel_header')}</span>
              <b>{t('rights.step')}</b>
            </header>
            <i><span /></i>
            <h3>{t('rights.question')}</h3>
            <p><b>01</b> {t('rights.opt1')}</p>
            <p className="muted"><b>02</b> {t('rights.opt2')}</p>
          </div>
        </div>
      </section>

      {/* #programas (Cómo ayudamos) */}
      <section id="programas" className="senda-section">
        <div className="senda-shell">
          <SectionHead
            eyebrow={t('programs.eyebrow')}
            title={t('programs.title')}
            link="/programas"
            linkText={t('programs.all')}
          />
          <div className="senda-programs">
            {programs.map(({ title, desc }, index) => (
              <Link href="/programas" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* #historias */}
      <section id="historias" className="senda-stories">
        <div className="senda-shell">
          <SectionHead
            eyebrow={t('stories.eyebrow')}
            title={t('stories.title')}
            link="/galeria"
            linkText={t('stories.all')}
          />
          <div className="senda-story-grid">
            <Story
              src={images.home_story_1?.imageUrl || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85"}
              alt={images.home_story_1?.altText || "Jornada de salud en Cartagena"}
              main
              label={images.home_story_1?.caption || "Arroz Barato · Cartagena"}
              title={t('stories.s1_title')}
              readText={t('stories.read')}
            />
            <Story
              src={images.home_story_2?.imageUrl || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85"}
              alt={images.home_story_2?.altText || "Círculo de apoyo"}
              label={images.home_story_2?.caption || t('stories.s2_label')}
              title={t('stories.s2_title')}
            />
            <Story
              src={images.home_story_3?.imageUrl || "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85"}
              alt={images.home_story_3?.altText || "Mujeres en formación"}
              label={images.home_story_3?.caption || t('stories.s3_label')}
              title={t('stories.s3_title')}
            />
          </div>
        </div>
      </section>

      {/* #impacto */}
      <section id="impacto" className="senda-impact">
        <div className="senda-shell">
          <div>
            <p className="senda-eyebrow">{t('impact.eyebrow')}</p>
            <h2>
              {stats.site_impact_title.includes('\n')
                ? stats.site_impact_title.split('\n').map((line: string, idx: number) => (
                    <span key={idx}>{line}<br /></span>
                  ))
                : stats.site_impact_title}
            </h2>
            <p>{stats.site_impact_subtitle}</p>
            <Link href="/galeria" className="senda-text-link">
              {t('impact.link')} <ArrowRight />
            </Link>
          </div>
          <dl>
            {[
              [stats.site_mujeres_orientadas || '1,450+', t('impact.m1')],
              [stats.site_rutas_activadas || '620+', t('impact.m2')],
              [stats.site_acciones_apoyo || '2,890+', t('impact.m3')],
              [stats.site_procesos_autonomia || '340+', t('impact.m4')],
            ].map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* #apoyar */}
      <section id="apoyar" className="senda-section">
        <div className="senda-shell senda-donate">
          <div>
            <p className="senda-eyebrow">{t('donate.eyebrow')}</p>
            <h2>{t('donate.title')}</h2>
            <p>{t('donate.desc')}</p>
          </div>
          <Link href="/donar" className="senda-button senda-button--primary">
            <HeartHandshake /> {t('donate.btn')}
          </Link>
        </div>
      </section>

      {/* #aliados */}
      <section id="aliados" className="senda-allies">
        <div className="senda-shell">
          <SectionHead
            eyebrow={t('allies.eyebrow')}
            title={t('allies.title')}
            text={t('allies.desc')}
          />
          <div className="senda-allies__grid">
            {[
              [t('allies.art1_title'), t('allies.art1_text'), t('allies.art1_type')],
              [t('allies.art2_title'), t('allies.art2_text'), t('allies.art2_type')],
              [t('allies.art3_title'), t('allies.art3_text'), t('allies.art3_type')],
            ].map(([title, text, type], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <div className="senda-allies__mark">{index === 0 ? '✚' : index === 1 ? '◌' : '↗'}</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <small>{type}</small>
              </article>
            ))}
          </div>
          <Link href="/caribe-seguro/aliados" className="senda-text-link senda-allies__link">
            {t('allies.link')} <ArrowRight />
          </Link>
        </div>
      </section>

      <SendaAlliesLogos
        eyebrow={t('allies.eyebrow')}
        title={t('allies.title')}
        intro={t('allies.desc')}
      />
    </div>
  );
}

function SectionHead({ eyebrow, title, text, link, linkText }: { eyebrow: string; title: string; text?: string; link?: string; linkText?: string }) {
  return (
    <div className="senda-section-head">
      <div>
        <p className="senda-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link ? (
        <Link href={link} className="senda-text-link">
          {linkText} <ArrowRight />
        </Link>
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
}

function Story({ src, alt, title, label, main = false, readText = 'Leer historia' }: { src: string; alt: string; title: string; label?: string; main?: boolean; readText?: string }) {
  return (
    <Link href="/galeria" className={`senda-story ${main ? 'senda-story--main' : ''}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 800px) 100vw, 60vw" />
      <div>
        {label && <span>{label}</span>}
        <h3>{title}</h3>
        {main && <p>{readText} <ArrowRight /></p>}
      </div>
    </Link>
  );
}
