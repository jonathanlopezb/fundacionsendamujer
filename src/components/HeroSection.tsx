'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState({
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85',
    altText: 'Acompañamiento humano y profesional de Fundación Senda Mujer',
    caption: 'Cartagena · Bolívar',
  });

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const res = await fetch('/api/cms/images?key=home_hero');
        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl) {
            setHeroImage(data);
          }
        }
      } catch (err) {
        // use fallback silent
      }
    }
    loadHeroImage();
  }, []);

  return (
    <section className="senda-hero">
      <div className="senda-shell senda-hero__grid">
        <div className="senda-hero__content">
          <p className="senda-eyebrow">{t('hero.eyebrow')}</p>
          <h1>
            {t('hero.h1_pre')}
            <em>{t('hero.h1_em')}</em>
            {t('hero.h1_post')}
          </h1>
          <p className="senda-hero__lead">{t('hero.lead')}</p>
          <div className="senda-hero__actions">
            <Link href="#necesidades" className="senda-button senda-button--primary">
              {t('hero.cta_primary')} <span aria-hidden="true">→</span>
            </Link>
            <Link href="/triaje-psicologico" className="senda-button senda-button--secondary">
              {t('hero.cta_secondary')}
            </Link>
          </div>
          <p className="senda-assurances">
            <span>{t('hero.free')}</span>
            <span>{t('hero.confidential')}</span>
            <span>{t('hero.no_judgment')}</span>
          </p>
        </div>
        <div className="senda-hero__image-wrap">
          <div className="senda-hero__image">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.altText || 'Acompañamiento humano y profesional de Fundación Senda Mujer'}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 43vw"
            />
            <div className="senda-hero__image-gradient" />
            {heroImage.caption && (
              <div className="senda-hero__caption">
                <strong>{heroImage.caption.split('·')[0]?.trim() || heroImage.caption}</strong>
                {heroImage.caption.includes('·') && (
                  <span>{heroImage.caption.split('·').slice(1).join('·').trim()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
