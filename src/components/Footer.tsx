'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="senda-footer">
      <div className="senda-footer__top">
        <div className="senda-footer__brand">
          <div className="!w-[220px] !h-[68px] relative">
            <Image src="/logo-white.jpg" alt="Fundación Senda Mujer" fill className="object-contain" sizes="220px"/>
          </div>
          <p>{t('footer.desc')}</p>
          <strong>{t('footer.quote')}</strong>
        </div>

        <div>
          <h3>{t('footer.col1_title')}</h3>
          <Link href="/triaje-psicologico">{t('footer.test')}</Link>
          <Link href="/agendar-cita">{t('footer.schedule')}</Link>
          <Link href="/senda-universal">SENDA Universal</Link>
          <Link href="/caribe-seguro">Senda Caribe</Link>
        </div>

        <div>
          <h3>{t('footer.col2_title')}</h3>
          <p>
            <b>Sede principal</b><br/>
            Barrio Arroz Barato<br/>
            Cartagena de Indias, Bolívar
          </p>
          <a href="tel:+573014692095">+57 301 469 2095</a>
          <a href="tel:155">Línea Púrpura Nacional 155</a>
        </div>

        <div>
          <h3>{t('footer.col3_title')}</h3>
          <Link href="/nosotros">{t('footer.who')}</Link>
          <Link href="/modelos">{t('footer.models')}</Link>
          <Link href="/caribe-seguro/aliados">{t('footer.allies')}</Link>
          <Link href="/galeria">{t('footer.gallery')}</Link>
          <Link href="/donar">{t('footer.donations')}</Link>
        </div>
      </div>

      <div className="senda-footer__bottom">
        <span>© {new Date().getFullYear()} Fundación Senda Mujer · Cartagena, Colombia</span>
        <span>{t('footer.rights')}</span>
      </div>
    </footer>
  );
}
