'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import SendaAlliesLogos from '@/components/SendaAlliesLogos';
import { useLanguage } from '@/context/LanguageContext';

export default function NosotrosPage() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState({
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85',
    altText: 'Equipo de acompañamiento de Fundación Senda Mujer',
    caption: 'Cartagena · Bolívar',
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const res = await fetch('/api/cms/images?key=nosotros_hero');
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) setHeroImage(data);
        }
      } catch (err) {
        // fallback
      }
    }
    loadHero();
  }, []);

  const principles = [
    t('nosotros.p1'),
    t('nosotros.p2'),
    t('nosotros.p3'),
    t('nosotros.p4'),
    t('nosotros.p5'),
    t('nosotros.p6'),
  ];

  return (
    <main className="prototype-home senda-about">
      {/* Hero */}
      <section className="senda-about__hero">
        <div className="senda-shell senda-about__hero-grid">
          <div>
            <p className="senda-eyebrow">{t('nosotros.hero_eyebrow')}</p>
            <h1>{t('nosotros.hero_title')}</h1>
            <p>{t('nosotros.hero_desc')}</p>
            <Link className="senda-button senda-button--primary" href="/agendar-cita">
              {t('nosotros.hero_btn')} <ArrowRight />
            </Link>
          </div>
          <div className="senda-about__photo">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.altText || "Equipo de acompañamiento de Fundación Senda Mujer"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <span>{heroImage.caption || 'Cartagena · Bolívar'}</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="senda-section">
        <div className="senda-shell senda-about__intro">
          <p className="senda-eyebrow">{t('nosotros.intro_eyebrow')}</p>
          <h2>{t('nosotros.intro_title')}</h2>
          <p>{t('nosotros.intro_desc')}</p>
        </div>
      </section>

      {/* Purpose (Mission / Vision) */}
      <section className="senda-about__purpose">
        <div className="senda-shell senda-about__purpose-grid">
          <article>
            <span><HeartHandshake /></span>
            <p className="senda-eyebrow">{t('nosotros.misión_eyebrow')}</p>
            <h2>{t('nosotros.misión_title')}</h2>
            <p>{t('nosotros.misión_desc')}</p>
          </article>
          <article>
            <span><Sparkles /></span>
            <p className="senda-eyebrow">{t('nosotros.visión_eyebrow')}</p>
            <h2>{t('nosotros.visión_title')}</h2>
            <p>{t('nosotros.visión_desc')}</p>
          </article>
        </div>
      </section>

      {/* Principles */}
      <section className="senda-section">
        <div className="senda-shell">
          <div className="senda-section-head">
            <div>
              <p className="senda-eyebrow">{t('nosotros.princ_eyebrow')}</p>
              <h2>{t('nosotros.princ_title')}</h2>
            </div>
            <p>{t('nosotros.princ_sub')}</p>
          </div>
          <div className="senda-about__principles">
            {principles.map((principle, index) => (
              <div key={principle}>
                <span>0{index + 1}</span>
                <h3>{principle}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rights & Autonomy */}
      <section className="senda-about__rights">
        <div className="senda-shell">
          <Scale />
          <div>
            <p className="senda-eyebrow">{t('nosotros.rights_eyebrow')}</p>
            <h2>{t('nosotros.rights_title')}</h2>
            <p>{t('nosotros.rights_desc')}</p>
          </div>
          <ShieldCheck />
        </div>
      </section>

      <SendaAlliesLogos
        eyebrow={t('nosotros.allies_eyebrow')}
        title={t('nosotros.allies_title')}
        intro={t('nosotros.allies_intro')}
      />

      {/* Donate CTA */}
      <section className="senda-section">
        <div className="senda-shell senda-donate">
          <div>
            <p className="senda-eyebrow">{t('nosotros.cta_eyebrow')}</p>
            <h2>{t('nosotros.cta_title')}</h2>
            <p>{t('nosotros.cta_desc')}</p>
          </div>
          <Link href="/donar" className="senda-button senda-button--primary">
            {t('nosotros.cta_btn')} <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
