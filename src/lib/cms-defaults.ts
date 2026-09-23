export interface CmsImageItem {
  sectionKey: string;
  page: 'Inicio' | 'Nosotros' | 'Programas' | 'Donaciones' | 'Galería' | 'Caribe Seguro' | 'Aliados';
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  recommendedSize: string;
  aspectRatio: '16:9' | '3:2' | '4:3' | '1:1' | 'banner';
}

export const CMS_DEFAULT_SECTIONS: CmsImageItem[] = [
  // ── PÁGINA DE INICIO (/) ──────────────────────────────────────────────────
  {
    sectionKey: 'home_hero',
    page: 'Inicio',
    title: 'Foto Principal del Banner (Hero)',
    description: 'Imagen principal destacada en la cabecera de la página de inicio junto al llamado a la acción.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=85',
    altText: 'Acompañamiento humano y profesional de Fundación Senda Mujer en Cartagena',
    caption: 'Sorelvis Murillo Arreola · Trabajadora Social',
    recommendedSize: '1100x750px (Horizontal 3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'home_story_1',
    page: 'Inicio',
    title: 'Historia de Impacto 1 (Principal)',
    description: 'Tarjeta principal de la sección de historias de impacto en el territorio.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85',
    altText: 'Jornada cívica y médica de salud en Arroz Barato, Cartagena',
    caption: 'Arroz Barato · Cartagena',
    recommendedSize: '1200x800px (Horizontal 3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'home_story_2',
    page: 'Inicio',
    title: 'Historia de Impacto 2 (Círculo de Apoyo)',
    description: 'Segunda tarjeta en la cuadrícula de historias de impacto de la página de inicio.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85',
    altText: 'Círculo de apoyo emocional y contención psicosocial para mujeres',
    caption: 'Círculos de apoyo y autocuidado',
    recommendedSize: '800x600px (4:3)',
    aspectRatio: '4:3',
  },
  {
    sectionKey: 'home_story_3',
    page: 'Inicio',
    title: 'Historia de Impacto 3 (Autonomía y Formación)',
    description: 'Tercera tarjeta de impacto enfocada en capacitación y empoderamiento.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=85',
    altText: 'Mujeres en talleres comunitarios de formación y proyectos de vida',
    caption: 'Volver a imaginar un proyecto de vida',
    recommendedSize: '800x600px (4:3)',
    aspectRatio: '4:3',
  },

  // ── PÁGINA QUIÉNES SOMOS (/nosotros) ──────────────────────────────────────
  {
    sectionKey: 'nosotros_hero',
    page: 'Nosotros',
    title: 'Fotografía de Cabecera (Quiénes Somos)',
    description: 'Imagen principal del equipo y presencia territorial en la página Nosotros.',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85',
    altText: 'Equipo interdisciplinario de acompañamiento de Fundación Senda Mujer en Cartagena',
    caption: 'Cartagena · Bolívar',
    recommendedSize: '1200x800px (Horizontal 3:2)',
    aspectRatio: '3:2',
  },

  // ── ALIADOS INSTITUCIONALES ───────────────────────────────────────────────
  {
    sectionKey: 'ally_logo_defensoria',
    page: 'Aliados',
    title: 'Logo Oficial - Defensoría del Pueblo',
    description: 'Logo institucional de la Defensoría del Pueblo en las secciones de alianzas.',
    imageUrl: '/defensoria.png',
    altText: 'Logo oficial Defensoría del Pueblo Regional Bolívar',
    caption: 'Defensoría del Pueblo',
    recommendedSize: '360x240px (PNG transparente)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'ally_logo_profamilia',
    page: 'Aliados',
    title: 'Logo Oficial - Profamilia',
    description: 'Logo institucional de Profamilia para salud sexual y reproductiva.',
    imageUrl: '/profamilia.jpg',
    altText: 'Logo oficial Profamilia Colombia',
    caption: 'Profamilia',
    recommendedSize: '360x240px (PNG o JPG)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'ally_logo_sena',
    page: 'Aliados',
    title: 'Logo Oficial - SENA',
    description: 'Logo institucional del Servicio Nacional de Aprendizaje (SENA).',
    imageUrl: '/sena.png',
    altText: 'Logo oficial SENA Servicio Nacional de Aprendizaje',
    caption: 'SENA',
    recommendedSize: '360x240px (PNG transparente)',
    aspectRatio: '3:2',
  },

  // ── PÁGINA DE DONACIONES (/donar) ─────────────────────────────────────────
  {
    sectionKey: 'donar_banner',
    page: 'Donaciones',
    title: 'Imagen de Cabecera / Apoyo (Donar)',
    description: 'Imagen inspiradora que acompaña el calculador y opciones de donación.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=85',
    altText: 'Impacto directo de las donaciones en comunidades vulnerables de Cartagena',
    caption: 'Tu aporte se convierte en acciones reales de protección y salud',
    recommendedSize: '1200x600px (Panorámico 16:9)',
    aspectRatio: '16:9',
  },

  // ── PÁGINA DE GALERÍA (/galeria) ──────────────────────────────────────────
  {
    sectionKey: 'galeria_banner',
    page: 'Galería',
    title: 'Portada de la Galería Territorial',
    description: 'Imagen destacada en la cabecera de la galería fotográfica de jornadas.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    altText: 'Registro fotográfico de jornadas comunitarias y brigadas en Cartagena',
    caption: 'Memoria viva de nuestro trabajo en territorio',
    recommendedSize: '1200x600px (16:9)',
    aspectRatio: '16:9',
  },

  // ── CARIBE SEGURO (/caribe-seguro) ────────────────────────────────────────
  {
    sectionKey: 'caribe_seguro_hero',
    page: 'Caribe Seguro',
    title: 'Banner de Caribe Seguro para Mujeres',
    description: 'Imagen principal del sistema operativo social y observatorio Caribe Seguro.',
    imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1200&q=85',
    altText: 'Ecosistema de protección, georreferenciación y rutas de Caribe Seguro',
    caption: 'Caribe Seguro · Red de respuesta y prevención',
    recommendedSize: '1200x600px (16:9)',
    aspectRatio: '16:9',
  },

  // ── PROGRAMAS (01 AL 07) ──────────────────────────────────────────────────
  {
    sectionKey: 'programa_01_acompaniada',
    page: 'Programas',
    title: 'Programa 01 · Mujer Acompañada',
    description: 'Primera escucha y orientación social.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
    altText: 'Orientadora social brindando primera escucha a una mujer',
    caption: 'Orientación inicial y acompañamiento continuo',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_02_violencia_sexual',
    page: 'Programas',
    title: 'Programa 02 · Violencia Sexual',
    description: 'Atención integral, activación de Código Fucsia y salud.',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=85',
    altText: 'Atención integral en salud y acompañamiento para sobrevivientes',
    caption: 'Atención médica y psicológica confidencial',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_03_contencion',
    page: 'Programas',
    title: 'Programa 03 · Contención Psicosocial',
    description: 'Salud mental, manejo del trauma y círculos de apoyo.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
    altText: 'Círculo de apoyo psicosocial y autocuidado emocional',
    caption: 'Salud mental individual y comunitaria',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_04_salud_derechos',
    page: 'Programas',
    title: 'Programa 04 · Salud y Derechos',
    description: 'Salud sexual, reproductiva y acceso a servicios médicos.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1000&q=85',
    altText: 'Profesional de la salud atendiendo consulta médica femenina',
    caption: 'Atención digna y oportuna en salud reproductiva',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_05_embarazo',
    page: 'Programas',
    title: 'Programa 05 · Embarazo con Apoyo',
    description: 'Acompañamiento en gestación, maternidad y lactancia.',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85',
    altText: 'Madre gestante recibiendo acompañamiento y orientación prenatal',
    caption: 'Controles prenatales y bienestar materno-infantil',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_06_justicia',
    page: 'Programas',
    title: 'Programa 06 · Mujer y Justicia',
    description: 'Asesoría legal, medidas de protección y exigibilidad de derechos.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=85',
    altText: 'Abogada brindando asesoría jurídica y trámite de tutelas',
    caption: 'Rutas de denuncia, protección y tutela efectiva',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
  {
    sectionKey: 'programa_07_proyecto_vida',
    page: 'Programas',
    title: 'Programa 07 · Proyecto de Vida',
    description: 'Formación para el empleo, habilidades productivas y autonomía.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85',
    altText: 'Mujeres cartageneras en taller de emprendimiento y autonomía económica',
    caption: 'Emprendimiento, formación técnica y autonomía',
    recommendedSize: '1000x700px (3:2)',
    aspectRatio: '3:2',
  },
];
