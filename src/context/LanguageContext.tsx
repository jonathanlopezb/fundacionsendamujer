'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const dictionary: Record<Language, Record<string, string>> = {
  es: {
    // Topbar & Nav
    'nav.top_emergency': 'Línea Púrpura Nacional:',
    'nav.top_incognito': 'Modo Incógnito',
    'nav.top_academia': 'SendaAcademia ↗',
    'nav.top_user_portal': 'Portal Usuarias ↗',
    'nav.top_pro_portal': 'Portal Profesional ↗',
    'nav.help': 'Necesito ayuda',
    'nav.how_we_help': 'Cómo ayudamos',
    'nav.models': 'Modelos',
    'nav.senda_caribe': 'Senda Caribe',
    'nav.impact': 'Impacto',
    'nav.stories': 'Historias',
    'nav.about': 'Nosotros',
    'nav.donate': 'Donar',
    'nav.sos': 'SOS',
    'nav.appointment': 'Agendar Cita Médica',
    'nav.sos_action': 'ACTIVAR CAMUFLAJE SOS [ESC]',
    'nav.esc_hint': 'Presiona Esc o el botón cerrar para volver al sitio.',

    // Hero
    'hero.eyebrow': 'Cartagena · Bolívar · Colombia',
    'hero.h1_pre': 'Ninguna mujer debería enfrentar ',
    'hero.h1_em': 'sola',
    'hero.h1_post': ' su camino.',
    'hero.lead': 'Acompañamiento gratuito, confidencial e integral para mujeres y niñas que necesitan apoyo psicológico, médico, jurídico o social.',
    'hero.cta_primary': 'Necesito ayuda',
    'hero.cta_secondary': 'Hacer test psicológico',
    'hero.free': '● Gratuito',
    'hero.confidential': '● Confidencial',
    'hero.no_judgment': '● Sin juzgamiento',

    // Test & Universal Spotlight
    'spotlight.test_eyebrow': '¿No sabes por dónde empezar?',
    'spotlight.test_title': 'Empieza con el Test Psicológico.',
    'spotlight.test_desc': 'Una guía privada para reconocer cómo te sientes y encontrar el siguiente paso de acompañamiento.',
    'spotlight.test_btn': 'Hacer el test ahora',
    'spotlight.test_assurances': 'Gratuito · Confidencial · A tu ritmo',
    'spotlight.uni_eyebrow': 'SENDA Universal',
    'spotlight.uni_title': 'Conoce tus derechos. Encuentra tu ruta.',
    'spotlight.uni_desc': 'Orientación práctica sobre salud, protección y servicios disponibles.',
    'spotlight.uni_btn': 'Explorar SENDA Universal',

    // Section Necesidades
    'needs.eyebrow': 'Empieza por aquí',
    'needs.title': '¿Qué necesitas hoy?',
    'needs.desc': 'No tienes que conocer las instituciones ni las palabras correctas. Elige una opción y te mostramos el siguiente paso.',
    'needs.card1_title': 'Estoy viviendo violencia',
    'needs.card1_text': 'Orientación, protección y rutas.',
    'needs.card2_title': 'Necesito hablar con alguien',
    'needs.card2_text': 'Escucha y contención emocional.',
    'needs.card3_title': 'Necesito orientación jurídica',
    'needs.card3_text': 'Derechos y acompañamiento legal.',
    'needs.card4_title': 'Necesito atención en salud',
    'needs.card4_text': 'Orientación médica y social.',
    'needs.choose': 'Elegir esta opción',

    // Section Nuestro Modelo
    'model.eyebrow': 'Nuestro modelo',
    'model.title': 'Tu camino con Senda',
    'model.desc': 'Un acompañamiento claro, humano y continuo.',
    'model.step1_title': 'Escuchamos',
    'model.step1_desc': 'Entendemos tu situación sin juzgar.',
    'model.step2_title': 'Orientamos',
    'model.step2_desc': 'Identificamos necesidades y prioridades.',
    'model.step3_title': 'Activamos tu ruta',
    'model.step3_desc': 'Conectamos la ayuda profesional.',
    'model.step4_title': 'Acompañamos',
    'model.step4_desc': 'Damos continuidad y fortalecemos autonomía.',

    // Section Senda Caribe
    'caribe.eyebrow': 'Senda Caribe',
    'caribe.title': 'Protección cercana para un Caribe más seguro.',
    'caribe.desc': 'Prevención, rutas de atención, acompañamiento profesional y evidencia territorial en un solo ecosistema.',
    'caribe.btn': 'Conocer Senda Caribe',
    'caribe.badge_title': 'Centro de acompañamiento',
    'caribe.badge_sub': 'Tu ruta, en un solo lugar',
    'caribe.link1': 'Encontrar una ruta',
    'caribe.link2': 'Mi plan de protección',
    'caribe.link3': 'Red profesional',

    // Section Digital / Senda Universal
    'rights.eyebrow': 'Herramienta de derechos',
    'rights.title': 'Conoce tus derechos y encuentra tu ruta.',
    'rights.desc': 'SENDA Universal te orienta con preguntas claras sobre salud, protección, derechos y servicios disponibles.',
    'rights.btn': 'Comenzar orientación',
    'rights.panel_header': 'Orientación gratuita',
    'rights.step': 'Paso 1 de 5',
    'rights.question': '¿Qué necesitas hoy?',
    'rights.opt1': 'Conozcamos tu situación',
    'rights.opt2': 'Identifiquemos opciones',

    // Section Programas
    'programs.eyebrow': 'Cómo ayudamos',
    'programs.title': 'Programas para situaciones reales.',
    'programs.all': 'Ver todos los programas',
    'programs.p1_title': 'Mujer Acompañada',
    'programs.p1_desc': 'Primera escucha y orientación social.',
    'programs.p2_title': 'Violencia Sexual',
    'programs.p2_desc': 'Protección, salud y acompañamiento de caso.',
    'programs.p3_title': 'Contención Psicosocial',
    'programs.p3_desc': 'Salud mental, duelo y redes de apoyo.',
    'programs.p4_title': 'Salud y Derechos',
    'programs.p4_desc': 'Atención médica, social y jurídica.',
    'programs.p5_title': 'Embarazo con Apoyo',
    'programs.p5_desc': 'Acompañamiento durante una etapa decisiva.',
    'programs.p6_title': 'Mujer y Justicia',
    'programs.p6_desc': 'Orientación legal para ejercer derechos.',
    'programs.p7_title': 'Proyecto de Vida',
    'programs.p7_desc': 'Educación, autonomía y oportunidades.',

    // Section Historias
    'stories.eyebrow': 'Historias de impacto',
    'stories.title': 'Lo que pasa cuando alguien acompaña.',
    'stories.all': 'Ver galería completa',
    'stories.s1_title': 'Una jornada de salud puede abrir una ruta de cuidado.',
    'stories.s2_label': 'Contención',
    'stories.s2_title': 'Escuchar también es proteger',
    'stories.s3_label': 'Autonomía',
    'stories.s3_title': 'Volver a imaginar un proyecto de vida',
    'stories.read': 'Leer historia',

    // Section Impacto
    'impact.eyebrow': 'Impacto verificable',
    'impact.link': 'Ver historias de impacto',
    'impact.m1': 'Mujeres orientadas',
    'impact.m2': 'Rutas activadas',
    'impact.m3': 'Acciones de apoyo',
    'impact.m4': 'Procesos de autonomía',

    // Section Apoyar / Donate
    'donate.eyebrow': 'Haz parte del cambio',
    'donate.title': 'Tu aporte puede convertirse en una acción concreta.',
    'donate.desc': 'Apoya atención, protección, salud y autonomía para mujeres y niñas en Cartagena.',
    'donate.btn': 'Quiero apoyar',

    // Section Aliados
    'allies.eyebrow': 'Red que suma',
    'allies.title': 'Aliados que hacen posible cada ruta.',
    'allies.desc': 'Trabajamos de forma articulada para que el acompañamiento llegue a donde más se necesita.',
    'allies.art1_title': 'Instituciones de salud',
    'allies.art1_text': 'Atención médica digna y oportuna',
    'allies.art1_type': 'IPS y redes de salud',
    'allies.art2_title': 'Organizaciones sociales',
    'allies.art2_text': 'Cuidado comunitario y prevención',
    'allies.art2_type': 'Colectivos territoriales',
    'allies.art3_title': 'Empresas con propósito',
    'allies.art3_text': 'Oportunidades para la autonomía',
    'allies.art3_type': 'Aliados empresariales',
    'allies.link': 'Conoce nuestra red de aliados',
    'allies.cert_bold': 'Donaciones con constancia.',
    'allies.cert_desc': 'Certificamos cada donación recibida y hacemos seguimiento transparente a su destinación.',

    // Footer
    'footer.desc': 'Acompañamiento, protección y fortalecimiento integral para mujeres y niñas en Cartagena.',
    'footer.quote': '“Ninguna mujer debería enfrentar sola su camino.”',
    'footer.col1_title': 'Encuentra tu ruta',
    'footer.col2_title': 'Contacto 24/7',
    'footer.col3_title': 'Conoce más',
    'footer.test': 'Test psicológico',
    'footer.schedule': 'Agendar una cita',
    'footer.who': 'Quiénes somos',
    'footer.models': 'Modelos CAM y THEMIS',
    'footer.allies': 'Aliados',
    'footer.gallery': 'Galería',
    'footer.donations': 'Donaciones',
    'footer.rights': 'Confidencialidad y protección de datos · Ley 1581',

    // Modelos Page
    'modelos.hero_eyebrow': 'CÓMO ACOMPAÑAMOS',
    'modelos.hero_h1_1': 'Dos modelos.',
    'modelos.hero_h1_2': 'Una ruta de acompañamiento.',
    'modelos.hero_lead': 'En Fundación Senda Mujer transformamos las necesidades de cada mujer en rutas de orientación, fortalecimiento y acceso a oportunidades.',
    'modelos.btn_cam': 'Conocer CAM',
    'modelos.btn_themis': 'Conocer THEMIS',
    'modelos.sec_title': 'Nuestros modelos',
    'modelos.sec_desc': 'Dos caminos, un mismo propósito: tu bienestar y autonomía.',
    'modelos.cam_sub': 'Capacitación · Acompañamiento · Mercadeo',
    'modelos.themis_sub': 'Acompañamiento jurídico',
    'modelos.cam_hero_desc': 'Un modelo que fortalece conocimientos, acompaña procesos y conecta capacidades con oportunidades.',
    'modelos.cam_quote': 'Mujeres que transforman comunidades ♡',
    'modelos.pilar1_title': 'Capacitación',
    'modelos.pilar1_sub': 'Aprender para crecer.',
    'modelos.pilar2_title': 'Acompañamiento',
    'modelos.pilar2_sub': 'Juntas en cada paso.',
    'modelos.pilar3_title': 'Mercadeo',
    'modelos.pilar3_sub': 'Del producto a la oportunidad.',
    'modelos.how_cam_title': '¿Cómo funciona CAM?',
    'modelos.how_cam_desc': 'Un proceso cercano, humano y estructurado.',
    'modelos.step1_t': 'Escuchamos',
    'modelos.step1_d': 'Conocemos tus necesidades, intereses y capacidades.',
    'modelos.step2_t': 'Identificamos',
    'modelos.step2_d': 'Definimos prioridades y oportunidades.',
    'modelos.step3_t': 'Acompañamos',
    'modelos.step3_d': 'Activamos redes y brindamos orientación continua.',
    'modelos.step4_t': 'Hacemos seguimiento',
    'modelos.step4_d': 'Evaluamos avances y nuevos retos.',
    'modelos.prod_title': 'Líneas productivas',
    'modelos.prod_desc': 'Capacidades que se convierten en oportunidades.',
    'modelos.prod_1': 'Confección y modistería',
    'modelos.prod_2': 'Huertas',
    'modelos.prod_3': 'Piscicultura',
    'modelos.prod_4': 'Repostería',
    'modelos.prod_5': 'Artesanías',
    'modelos.prod_6': 'Avicultura',
    'modelos.route_title': 'Del aprendizaje al mercado',
    'modelos.route_desc': 'Una ruta que transforma conocimiento en capacidad y capacidad en oportunidades.',
    'modelos.r1': 'Aprendemos',
    'modelos.r2': 'Producimos',
    'modelos.r3': 'Presentamos',
    'modelos.r4': 'Comercializamos',
    'modelos.themis_eyebrow': 'MODELO THEMIS',
    'modelos.themis_title': 'Acompañamiento jurídico con enfoque de género y derechos.',
    'modelos.themis_desc': 'Brindamos orientación jurídica, acompañamiento integral y acceso a rutas de atención, para que cada mujer conozca sus derechos y pueda tomar decisiones libres e informadas.',
    'modelos.th_p1': 'Información jurídica comprensible',
    'modelos.th_p2': 'Decisiones libres e informadas',
    'modelos.th_p3': 'Confidencialidad y no revictimización',
    'modelos.th_p4': 'Articulación con rutas competentes',
    'modelos.comp_title': 'Dos modelos que se complementan',
    'modelos.comp_desc': 'Algunas necesidades requieren fortalecer capacidades. Otras requieren orientación para ejercer derechos. En Senda Mujer, ambos caminos pueden formar parte de un acompañamiento integral.',
    'modelos.comp_cam_foot': 'Fortalecimiento de capacidades',
    'modelos.comp_themis_foot': 'Acceso a rutas',
    'modelos.cta_title': '¿Cuál es tu siguiente paso?',
    'modelos.cta_btn1': '🙋‍♀️ Necesito orientación',
    'modelos.cta_btn2': '📋 Quiero conocer los programas',
    'modelos.cta_btn3': '💚 Quiero apoyar a Senda Mujer',

    // Nosotros Page
    'nosotros.hero_eyebrow': 'Fundación Senda Mujer · Cartagena',
    'nosotros.hero_title': 'Cuidar, orientar y abrir caminos posibles.',
    'nosotros.hero_desc': 'Somos una fundación que acompaña a mujeres y niñas desde la escucha, el respeto por sus decisiones y la conexión con rutas de protección, salud, justicia y autonomía.',
    'nosotros.hero_btn': 'Hablar con Senda',
    'nosotros.intro_eyebrow': 'Quiénes somos',
    'nosotros.intro_title': 'Una red humana para momentos que no deberían vivirse a solas.',
    'nosotros.intro_desc': 'Trabajamos por el acompañamiento, protección y fortalecimiento integral de mujeres y niñas en situación de vulnerabilidad. Articulamos orientación social, apoyo psicosocial, salud, derechos y oportunidades para construir alternativas de vida digna.',
    'nosotros.misión_eyebrow': 'Nuestra misión',
    'nosotros.misión_title': 'Acompañar decisiones libres e informadas.',
    'nosotros.misión_desc': 'Brindar atención integral, gratuita y confidencial a mujeres y niñas, fortaleciendo sus derechos, su bienestar y sus redes de apoyo mediante rutas claras y atención cercana.',
    'nosotros.visión_eyebrow': 'Nuestra visión',
    'nosotros.visión_title': 'Un Caribe donde ninguna mujer camine sola.',
    'nosotros.visión_desc': 'Ser una referencia territorial de cuidado y protección, reconocida por transformar barreras en oportunidades y por impulsar comunidades más seguras, equitativas y solidarias.',
    'nosotros.princ_eyebrow': 'Cómo actuamos',
    'nosotros.princ_title': 'Principios que guían cada atención.',
    'nosotros.princ_sub': 'La persona, su seguridad y su decisión están siempre en el centro.',
    'nosotros.p1': 'Dignidad humana',
    'nosotros.p2': 'Autonomía',
    'nosotros.p3': 'Confidencialidad',
    'nosotros.p4': 'No discriminación',
    'nosotros.p5': 'Enfoque de género',
    'nosotros.p6': 'Derechos humanos',
    'nosotros.rights_eyebrow': 'Autonomía y derechos',
    'nosotros.rights_title': 'Acompañamos sin juzgar.',
    'nosotros.rights_desc': 'Ofrecemos orientación respetuosa para que cada mujer pueda conocer sus opciones y tomar decisiones informadas sobre su vida, su salud y su proyecto personal. La confidencialidad y el respeto son irrenunciables.',
    'nosotros.allies_eyebrow': 'Alianzas que protegen',
    'nosotros.allies_title': 'Una red que amplía el alcance del cuidado.',
    'nosotros.allies_intro': 'Aliados institucionales que fortalecen las rutas de derechos, salud y formación en el territorio.',
    'nosotros.cta_eyebrow': 'Haz parte',
    'nosotros.cta_title': 'El cuidado colectivo transforma vidas.',
    'nosotros.cta_desc': 'Tu aporte se convierte en atención, orientación y oportunidades concretas para mujeres y niñas de Cartagena.',
    'nosotros.cta_btn': 'Quiero apoyar',
  },
  en: {
    // Topbar & Nav
    'nav.top_emergency': 'National Purple Line:',
    'nav.top_incognito': 'Incognito Mode',
    'nav.top_academia': 'SendaAcademia ↗',
    'nav.top_user_portal': 'User Portal ↗',
    'nav.top_pro_portal': 'Professional Portal ↗',
    'nav.help': 'I need help',
    'nav.how_we_help': 'How we help',
    'nav.models': 'Models',
    'nav.senda_caribe': 'Senda Caribe',
    'nav.impact': 'Impact',
    'nav.stories': 'Stories',
    'nav.about': 'About Us',
    'nav.donate': 'Donate',
    'nav.sos': 'SOS',
    'nav.appointment': 'Book Medical Appointment',
    'nav.sos_action': 'ACTIVATE SOS CAMOUFLAGE [ESC]',
    'nav.esc_hint': 'Press Esc or the close button to return to the site.',

    // Hero
    'hero.eyebrow': 'Cartagena · Bolívar · Colombia',
    'hero.h1_pre': 'No woman should face her path ',
    'hero.h1_em': 'alone',
    'hero.h1_post': '.',
    'hero.lead': 'Free, confidential, and comprehensive support for women and girls needing psychological, medical, legal, or social guidance.',
    'hero.cta_primary': 'I need help',
    'hero.cta_secondary': 'Take psychological test',
    'hero.free': '● Free',
    'hero.confidential': '● Confidential',
    'hero.no_judgment': '● Non-judgmental',

    // Test & Universal Spotlight
    'spotlight.test_eyebrow': 'Don\'t know where to start?',
    'spotlight.test_title': 'Start with the Psychological Test.',
    'spotlight.test_desc': 'A private guide to help you recognize how you feel and find your next step of support.',
    'spotlight.test_btn': 'Take the test now',
    'spotlight.test_assurances': 'Free · Confidential · At your own pace',
    'spotlight.uni_eyebrow': 'SENDA Universal',
    'spotlight.uni_title': 'Know your rights. Find your path.',
    'spotlight.uni_desc': 'Practical guidance on health, protection, and available services.',
    'spotlight.uni_btn': 'Explore SENDA Universal',

    // Section Necesidades
    'needs.eyebrow': 'Start here',
    'needs.title': 'What do you need today?',
    'needs.desc': 'You don\'t need to know the exact institutions or words. Choose an option and we\'ll show you the next step.',
    'needs.card1_title': 'I am experiencing violence',
    'needs.card1_text': 'Guidance, protection, and response routes.',
    'needs.card2_title': 'I need to talk to someone',
    'needs.card2_text': 'Active listening and emotional support.',
    'needs.card3_title': 'I need legal guidance',
    'needs.card3_text': 'Rights and legal accompaniment.',
    'needs.card4_title': 'I need healthcare support',
    'needs.card4_text': 'Medical and social guidance.',
    'needs.choose': 'Choose this option',

    // Section Nuestro Modelo
    'model.eyebrow': 'Our model',
    'model.title': 'Your journey with Senda',
    'model.desc': 'Clear, human, and continuous support.',
    'model.step1_title': 'We listen',
    'model.step1_desc': 'We understand your situation without judgment.',
    'model.step2_title': 'We guide',
    'model.step2_desc': 'We identify needs and priorities.',
    'model.step3_title': 'We activate your path',
    'model.step3_desc': 'We connect professional care.',
    'model.step4_title': 'We accompany',
    'model.step4_desc': 'We ensure continuity and build autonomy.',

    // Section Senda Caribe
    'caribe.eyebrow': 'Senda Caribe',
    'caribe.title': 'Local protection for a safer Caribbean.',
    'caribe.desc': 'Prevention, response routes, professional support, and territorial evidence in a unified ecosystem.',
    'caribe.btn': 'Discover Senda Caribe',
    'caribe.badge_title': 'Support Center',
    'caribe.badge_sub': 'Your path, in one place',
    'caribe.link1': 'Find a route',
    'caribe.link2': 'My protection plan',
    'caribe.link3': 'Professional network',

    // Section Digital / Senda Universal
    'rights.eyebrow': 'Rights tool',
    'rights.title': 'Know your rights and find your path.',
    'rights.desc': 'SENDA Universal guides you with clear questions on health, protection, rights, and available services.',
    'rights.btn': 'Start guidance',
    'rights.panel_header': 'Free guidance',
    'rights.step': 'Step 1 of 5',
    'rights.question': 'What do you need today?',
    'rights.opt1': 'Let\'s understand your situation',
    'rights.opt2': 'Let\'s identify options',

    // Section Programas
    'programs.eyebrow': 'How we help',
    'programs.title': 'Programs for real-life situations.',
    'programs.all': 'View all programs',
    'programs.p1_title': 'Accompanied Woman',
    'programs.p1_desc': 'Initial listening and social guidance.',
    'programs.p2_title': 'Sexual Violence Response',
    'programs.p2_desc': 'Protection, healthcare, and case accompaniment.',
    'programs.p3_title': 'Psychosocial Support',
    'programs.p3_desc': 'Mental health, grief support, and network building.',
    'programs.p4_title': 'Health & Rights',
    'programs.p4_desc': 'Medical, social, and legal care.',
    'programs.p5_title': 'Supported Pregnancy',
    'programs.p5_desc': 'Accompaniment through a crucial stage.',
    'programs.p6_title': 'Women & Justice',
    'programs.p6_desc': 'Legal guidance to exercise rights.',
    'programs.p7_title': 'Life Project',
    'programs.p7_desc': 'Education, autonomy, and opportunities.',

    // Section Historias
    'stories.eyebrow': 'Impact stories',
    'stories.title': 'What happens when someone stands by your side.',
    'stories.all': 'View full gallery',
    'stories.s1_title': 'A health fair can open a path to care.',
    'stories.s2_label': 'Support',
    'stories.s2_title': 'Listening is also protecting',
    'stories.s3_label': 'Autonomy',
    'stories.s3_title': 'Reimagining a personal life project',
    'stories.read': 'Read story',

    // Section Impacto
    'impact.eyebrow': 'Verifiable impact',
    'impact.link': 'View impact stories',
    'impact.m1': 'Women guided',
    'impact.m2': 'Routes activated',
    'impact.m3': 'Support actions',
    'impact.m4': 'Autonomy processes',

    // Section Apoyar / Donate
    'donate.eyebrow': 'Be part of the change',
    'donate.title': 'Your contribution becomes concrete action.',
    'donate.desc': 'Support care, protection, health, and autonomy for women and girls in Cartagena.',
    'donate.btn': 'I want to support',

    // Section Aliados
    'allies.eyebrow': 'Network for change',
    'allies.title': 'Allies who make every route possible.',
    'allies.desc': 'We work in coordination so support reaches where it is needed most.',
    'allies.art1_title': 'Healthcare Institutions',
    'allies.art1_text': 'Dignified and timely medical care',
    'allies.art1_type': 'Health networks & IPS',
    'allies.art2_title': 'Social Organizations',
    'allies.art2_text': 'Community care & prevention',
    'allies.art2_type': 'Territorial collectives',
    'allies.art3_title': 'Purpose-driven Companies',
    'allies.art3_text': 'Opportunities for autonomy',
    'allies.art3_type': 'Corporate partners',
    'allies.link': 'Explore our allies network',
    'allies.cert_bold': 'Verified donations.',
    'allies.cert_desc': 'We issue certificates for every donation received and transparently track its application.',

    // Footer
    'footer.desc': 'Comprehensive accompaniment, protection, and empowerment for women and girls in Cartagena.',
    'footer.quote': '“No woman should face her path alone.”',
    'footer.col1_title': 'Find your route',
    'footer.col2_title': '24/7 Contact',
    'footer.col3_title': 'Learn more',
    'footer.test': 'Psychological test',
    'footer.schedule': 'Book an appointment',
    'footer.who': 'Who we are',
    'footer.models': 'CAM & THEMIS Models',
    'footer.allies': 'Allies',
    'footer.gallery': 'Gallery',
    'footer.donations': 'Donations',
    'footer.rights': 'Data privacy & protection · Law 1581',

    // Modelos Page
    'modelos.hero_eyebrow': 'HOW WE ACCOMPANY',
    'modelos.hero_h1_1': 'Two models.',
    'modelos.hero_h1_2': 'One support pathway.',
    'modelos.hero_lead': 'At Fundación Senda Mujer, we transform each woman\'s needs into pathways of guidance, empowerment, and access to opportunities.',
    'modelos.btn_cam': 'Discover CAM',
    'modelos.btn_themis': 'Discover THEMIS',
    'modelos.sec_title': 'Our models',
    'modelos.sec_desc': 'Two paths, one purpose: your well-being and autonomy.',
    'modelos.cam_sub': 'Training · Accompaniment · Marketing',
    'modelos.themis_sub': 'Legal guidance',
    'modelos.cam_hero_desc': 'A model that strengthens knowledge, accompanies processes, and connects skills with opportunities.',
    'modelos.cam_quote': 'Women transforming communities ♡',
    'modelos.pilar1_title': 'Training',
    'modelos.pilar1_sub': 'Learn to grow.',
    'modelos.pilar2_title': 'Accompaniment',
    'modelos.pilar2_sub': 'Together at every step.',
    'modelos.pilar3_title': 'Marketing',
    'modelos.pilar3_sub': 'From product to opportunity.',
    'modelos.how_cam_title': 'How does CAM work?',
    'modelos.how_cam_desc': 'A close, human, and structured process.',
    'modelos.step1_t': 'We listen',
    'modelos.step1_d': 'We learn about your needs, interests, and capabilities.',
    'modelos.step2_t': 'We identify',
    'modelos.step2_d': 'We define priorities and opportunities.',
    'modelos.step3_t': 'We accompany',
    'modelos.step3_d': 'We activate networks and provide ongoing guidance.',
    'modelos.step4_t': 'We follow up',
    'modelos.step4_d': 'We evaluate progress and new challenges.',
    'modelos.prod_title': 'Productive lines',
    'modelos.prod_desc': 'Skills turned into opportunities.',
    'modelos.prod_1': 'Sewing & tailoring',
    'modelos.prod_2': 'Urban gardens',
    'modelos.prod_3': 'Fish farming',
    'modelos.prod_4': 'Bakery & pastry',
    'modelos.prod_5': 'Handcrafts',
    'modelos.prod_6': 'Poultry farming',
    'modelos.route_title': 'From learning to market',
    'modelos.route_desc': 'A pathway transforming knowledge into skill, and skill into opportunity.',
    'modelos.r1': 'We learn',
    'modelos.r2': 'We produce',
    'modelos.r3': 'We present',
    'modelos.r4': 'We market',
    'modelos.themis_eyebrow': 'THEMIS MODEL',
    'modelos.themis_title': 'Legal accompaniment with a gender and rights perspective.',
    'modelos.themis_desc': 'We provide legal guidance, comprehensive support, and access to protection pathways so every woman knows her rights and can make free, informed decisions.',
    'modelos.th_p1': 'Understandable legal information',
    'modelos.th_p2': 'Free and informed decisions',
    'modelos.th_p3': 'Confidenciality and non-revictimization',
    'modelos.th_p4': 'Coordination with authorized pathways',
    'modelos.comp_title': 'Two complementary models',
    'modelos.comp_desc': 'Some needs require building skills. Others require guidance to exercise rights. At Senda Mujer, both paths form part of comprehensive support.',
    'modelos.comp_cam_foot': 'Skill empowerment',
    'modelos.comp_themis_foot': 'Access to pathways',
    'modelos.cta_title': 'What is your next step?',
    'modelos.cta_btn1': '🙋‍♀️ I need guidance',
    'modelos.cta_btn2': '📋 I want to learn about programs',
    'modelos.cta_btn3': '💚 I want to support Senda Mujer',

    // Nosotros Page
    'nosotros.hero_eyebrow': 'Senda Mujer Foundation · Cartagena',
    'nosotros.hero_title': 'Caring, guiding, and opening possible paths.',
    'nosotros.hero_desc': 'We are a foundation supporting women and girls through active listening, respect for their choices, and connections to protection, health, justice, and autonomy pathways.',
    'nosotros.hero_btn': 'Talk with Senda',
    'nosotros.intro_eyebrow': 'About us',
    'nosotros.intro_title': 'A human network for moments no one should face alone.',
    'nosotros.intro_desc': 'We work for the accompaniment, protection, and integral empowerment of women and girls in vulnerable situations. We coordinate social guidance, psychosocial support, health, rights, and opportunities to build dignified life options.',
    'nosotros.misión_eyebrow': 'Our mission',
    'nosotros.misión_title': 'Accompany free and informed decisions.',
    'nosotros.misión_desc': 'Provide comprehensive, free, and confidential support to women and girls, strengthening their rights, well-being, and support networks through clear pathways and close care.',
    'nosotros.visión_eyebrow': 'Our vision',
    'nosotros.visión_title': 'A Caribbean where no woman walks alone.',
    'nosotros.visión_desc': 'To be a regional benchmark of care and protection, recognized for transforming barriers into opportunities and promoting safer, more equitable, and supportive communities.',
    'nosotros.princ_eyebrow': 'How we act',
    'nosotros.princ_title': 'Principles guiding every action.',
    'nosotros.princ_sub': 'The person, her safety, and her decision are always at the center.',
    'nosotros.p1': 'Human dignity',
    'nosotros.p2': 'Autonomy',
    'nosotros.p3': 'Confidentiality',
    'nosotros.p4': 'Non-discrimination',
    'nosotros.p5': 'Gender perspective',
    'nosotros.p6': 'Human rights',
    'nosotros.rights_eyebrow': 'Autonomy and rights',
    'nosotros.rights_title': 'We accompany without judgment.',
    'nosotros.rights_desc': 'We offer respectful guidance so that every woman can know her options and make informed decisions about her life, health, and personal project. Confidentiality and respect are non-negotiable.',
    'nosotros.allies_eyebrow': 'Alliances that protect',
    'nosotros.allies_title': 'A network extending the reach of care.',
    'nosotros.allies_intro': 'Institutional partners strengthening pathways for rights, healthcare, and education in the region.',
    'nosotros.cta_eyebrow': 'Join us',
    'nosotros.cta_title': 'Collective care transforms lives.',
    'nosotros.cta_desc': 'Your contribution becomes care, guidance, and concrete opportunities for women and girls in Cartagena.',
    'nosotros.cta_btn': 'I want to support',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const saved = localStorage.getItem('senda-lang') as Language;
    if (saved === 'es' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('senda-lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
  };

  const t = (key: string): string => {
    return dictionary[language]?.[key] || dictionary['es']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback for safety if accessed outside provider
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string) => dictionary['es']?.[key] || key,
    };
  }
  return context;
}
