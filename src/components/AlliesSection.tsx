'use client';

import React, { useState } from 'react';
import {
  Building2, ShieldCheck, HeartHandshake, Award, Search, ExternalLink,
  PhoneCall, CheckCircle2, FileText, Globe, GraduationCap, Scale,
  Stethoscope, Users, HelpCircle, ArrowRight, X, Sparkles, Send, MapPin, AlertCircle
} from 'lucide-react';

export interface Ally {
  id: string;
  name: string;
  acronym?: string;
  category: 'public' | 'health' | 'ngo' | 'academic' | 'private';
  categoryLabel: string;
  scope: string; // 'Cartagena / Distrital' | 'Departamental Bolívar' | 'Nacional' | 'Internacional'
  description: string;
  logoBg: string;
  logoIcon: React.ElementType;
  iconColor: string;
  services: string[];
  protocol: {
    title: string;
    description: string;
    responseTime: string;
    contactChannel: string;
    guarantees: string[];
  };
  website?: string;
  phone?: string;
  isFlagship?: boolean;
}

const ALLIES_DATA: Ally[] = [
  {
    id: 'defensoria',
    name: 'Defensoría del Pueblo — Regional Bolívar',
    acronym: 'DP-BOL',
    category: 'public',
    categoryLabel: 'Sector Público & Derechos Humanos',
    scope: 'Departamental Bolívar',
    description: 'Organismo constitucional de protección y promoción de los Derechos Humanos. Articulación directa para tutelas, recursos de amparo y acompañamiento a víctimas de VBG.',
    logoBg: 'from-blue-600 to-indigo-800',
    logoIcon: Scale,
    iconColor: 'text-blue-200',
    services: [
      'Representación judicial gratuita para violaciones de DDHH',
      'Emisión de medidas defensoriales y alertas tempranas',
      'Acompañamiento en recursos de tutelas para salud y vida'
    ],
    protocol: {
      title: 'Protocolo de Derivación Defensorial Prioritaria',
      description: 'Casos activados con triaje "Rojo/Crítico" en Fundación Senda Mujer disponen de enlace directo con el Defensor Comunitario para activación inmediata de tutela.',
      responseTime: 'Menos de 2 horas en emergencias',
      contactChannel: 'Línea Directa Regional + Despacho de Guardia',
      guarantees: [
        'Reserva absoluta de la identidad de la usuaria',
        'Asignación inmediata de defensor de oficio especializado en género',
        'Seguimiento a medidas de protección policial'
      ]
    },
    website: 'https://www.defensoria.gov.co',
    phone: '018000914814',
    isFlagship: true
  },
  {
    id: 'fiscalia-caivas',
    name: 'Fiscalía General — Centro de Atención a Víctimas de Violencia Sexual (CAIVAS)',
    acronym: 'CAIVAS / CAVIF',
    category: 'public',
    categoryLabel: 'Justicia & Investigación Penal',
    scope: 'Cartagena / Distrital',
    description: 'Unidad especializada en recepción de denuncias, valoración médico-legal prioritaria y medidas de protección urgente para víctimas de delitos sexuales y violencia intrafamiliar.',
    logoBg: 'from-slate-800 to-slate-950',
    logoIcon: ShieldCheck,
    iconColor: 'text-amber-400',
    services: [
      'Recepción de denuncia penal en espacio protegido y humanizado',
      'Activación de Kit de Emergencia Médica y Valoración Forense',
      'Solicitud de medidas de alejamiento y protección policial'
    ],
    protocol: {
      title: 'Ruta de Atención Interinstitucional CAIVAS - SENDA',
      description: 'Nuestras trabajadoras sociales y abogadas acompañan físicamente a la usuaria a la sede CAIVAS Cartagena para evitar la revictimización y garantizar la atención prioritaria.',
      responseTime: 'Inmediata (Atención 24 Horas)',
      contactChannel: 'Turno de Guardia CAIVAS Cartagena (Crespo / Manga)',
      guarantees: [
        'Toma de declaración única (evita relatos repetitivos dolorosos)',
        'Acompañamiento psicolegal permanente por abogada Senda',
        'Protección de la prueba física bajo cadena de custodia'
      ]
    },
    website: 'https://www.fiscalia.gov.co',
    phone: '122',
    isFlagship: true
  },
  {
    id: 'profamilia',
    name: 'Profamilia Colombia — Sede Cartagena',
    acronym: 'PROFAMILIA',
    category: 'health',
    categoryLabel: 'Salud Sexual & Reproductiva',
    scope: 'Nacional & Distrital',
    description: 'Entidad líder en salud sexual y reproductiva en Colombia. Aliado estratégico en servicios de anticoncepción de emergencia, asesoría IVE (Sentencia C-055) y laboratorio clínico.',
    logoBg: 'from-[#E12880] to-purple-800',
    logoIcon: Stethoscope,
    iconColor: 'text-pink-200',
    services: [
      'Atención en salud sexual y reproductiva garantizada',
      'Asesoría y atención integral IVE bajo normativa legal',
      'Métodos anticonceptivos de larga duración y consejería'
    ],
    protocol: {
      title: 'Convenio de Atención Clínica Preferencial',
      description: 'Las usuarias derivadas desde Fundación Senda Mujer acceden a tarifas subsidiadas o gratuitas mediante fondos de cooperación y convenios de la fundación.',
      responseTime: 'Menos de 24 horas laborables',
      contactChannel: 'Gestora Institucional Senda - Profamilia Cartagena',
      guarantees: [
        'Atención médica sin objeción de conciencia institucional',
        'Protocolo de privacidad y confidencialidad médica estricta',
        'Entrega prioritaria de anticoncepción de emergencia'
      ]
    },
    website: 'https://profamilia.org.co',
    phone: '3009124500',
    isFlagship: true
  },
  {
    id: 'icbf',
    name: 'Instituto Colombiano de Bienestar Familiar — Seccional Bolívar',
    acronym: 'ICBF',
    category: 'public',
    categoryLabel: 'Protección Infantil & Familiar',
    scope: 'Departamental Bolívar',
    description: 'Entidad encargada de la prevención y protección integral de la primera infancia, la niñez, la adolescencia y el bienestar de las familias en Colombia.',
    logoBg: 'from-emerald-600 to-teal-800',
    logoIcon: HeartHandshake,
    iconColor: 'text-emerald-200',
    services: [
      'Restablecimiento de Derechos de niños, niñas y adolescentes',
      'Orientación y trámites legales para procesos de Adopción',
      'Apoyo nutricional para madres gestantes y lactantes'
    ],
    protocol: {
      title: 'Articulación para Adopción y Restablecimiento de Derechos',
      description: 'Para usuarias gestantes que eligen de forma libre la opción de dar a su recién nacido en adopción, brindamos acompañamiento psicosocial conjunto con la Defensoría de Familia del ICBF.',
      responseTime: 'De 24 a 48 horas',
      contactChannel: 'Defensoría de Familia del Centro Zonal Cartagena',
      guarantees: [
        'Respeto absoluto de la decisión maternal de entregar en adopción legal',
        'Acompañamiento psicológico posparto continuo',
        'Garantía de hogar de paso o subsiguiente adopción protegida'
      ]
    },
    website: 'https://www.icbf.gov.co',
    phone: '141',
    isFlagship: true
  },
  {
    id: 'onu-mujeres',
    name: 'ONU Mujeres Colombia',
    acronym: 'UN WOMEN',
    category: 'ngo',
    categoryLabel: 'Cooperación Internacional',
    scope: 'Internacional',
    description: 'Entidad de las Naciones Unidas dedicada a promover la igualdad de género y el empoderamiento de las mujeres a nivel mundial.',
    logoBg: 'from-sky-600 to-blue-900',
    logoIcon: Globe,
    iconColor: 'text-sky-200',
    services: [
      'Transferencia de metodologías para empoderamiento económico',
      'Apoyo técnico a programas territoriales contra la VBG',
      'Financiación y veeduría de proyectos de derechos humanos'
    ],
    protocol: {
      title: 'Marco de Cooperación Técnica & Transparencia',
      description: 'Nuestra plataforma SENDA Universal aplica los estándares técnicos y de género respaldados por directrices internacionales de la ONU para el monitoreo de vulneraciones.',
      responseTime: 'Evaluación Trimestral de Proyectos',
      contactChannel: 'Coordinación Regional Caribe - ONU Mujeres',
      guarantees: [
        'Transparencia y auditoría abierta de indicadores de impacto',
        'Adopción de estándares internacionales de protección a sobrevivientes',
        'Promoción del empoderamiento económico sostenible'
      ]
    },
    website: 'https://colombia.unwomen.org',
    phone: '+57 601 580 0000',
    isFlagship: true
  },
  {
    id: 'unicartagena',
    name: 'Consultorio Jurídico & Psicología — Universidad de Cartagena',
    acronym: 'UDC',
    category: 'academic',
    categoryLabel: 'Academia & Consultorio Jurídico',
    scope: 'Cartagena / Distrital',
    description: 'Facultades de Derecho y Ciencias Sociales de la principal universidad pública del departamento. Brindan patrocinio jurídico gratuito y practicantes de apoyo psicosocial.',
    logoBg: 'from-amber-600 to-orange-800',
    logoIcon: GraduationCap,
    iconColor: 'text-amber-200',
    services: [
      'Patrocinio legal gratuito en demandas de alimentos y custodia',
      'Asesoría en querellas por violencia intrafamiliar y cuotas fijas',
      'Atención psicológica primaria en Consultorio de Apoyo Social'
    ],
    protocol: {
      title: 'Convenio de Prácticas y Patrocinio Gratuito UDC',
      description: 'Las usuarias de Senda Mujer son remitidas prioritariamente al Consultorio Jurídico con ficha técnica pre-evaluada por nuestros abogados para asignación directa de judicante.',
      responseTime: '48 a 72 horas laborables',
      contactChannel: 'Dirección Consultorio Jurídico UDC Sede Claustro San Agustín',
      guarantees: [
        'Supervisión por abogados docentes titulados',
        'Representación ante juzgados de familia de Cartagena',
        'Exención total de costos procesales de asesoría'
      ]
    },
    website: 'https://www.unicartagena.edu.co',
    phone: '+57 605 660 0970',
    isFlagship: false
  },
  {
    id: 'secretaria-mujer',
    name: 'Oficina de la Mujer — Secretaría de Participación de Cartagena',
    acronym: 'ALCALDÍA CTG',
    category: 'public',
    categoryLabel: 'Política Pública Territorial',
    scope: 'Cartagena / Distrital',
    description: 'Ente rector de la política pública de género en el Distrito Turístico y Cultural de Cartagena de Indias. Opera la Casa de la Mujer y programas de empleo femenino.',
    logoBg: 'from-purple-800 to-slate-900',
    logoIcon: Building2,
    iconColor: 'text-[#E12880]',
    services: [
      'Acceso a albergues de acogida y casas de paso distritales',
      'Inclusión en ferias de emprendimiento e incentivos económicos',
      'Ruta rosa de empoderamiento laboral del Distrito'
    ],
    protocol: {
      title: 'Articulación Casa de Acogida Distrital',
      description: 'En casos extremos donde la usuaria requiera refugio temporal urgente junto a sus hijos, coordinamos el ingreso seguro a las instalaciones distritales de protección.',
      responseTime: 'Menos de 6 horas',
      contactChannel: 'Enlace Género Distrito Cartagena',
      guarantees: [
        'Alojamiento y alimentación temporal garantizada',
        'Seguridad perimetral policial durante la estancia',
        'Vinculación prioritaria a subsidios de vivienda y capital de trabajo'
      ]
    },
    website: 'https://www.cartagena.gov.co',
    phone: '+57 605 641 1370',
    isFlagship: false
  },
  {
    id: 'ese-hospital-local',
    name: 'ESE Hospital Local Cartagena de Indias',
    acronym: 'ESE CARTAGENA',
    category: 'health',
    categoryLabel: 'Red Pública de Salud',
    scope: 'Cartagena / Distrital',
    description: 'Red de centros de salud y hospitales de primer nivel del Distrito de Cartagena. Garantiza atención médica inmediata, urgencias y profilaxis post-exposición.',
    logoBg: 'from-teal-600 to-cyan-900',
    logoIcon: Stethoscope,
    iconColor: 'text-teal-200',
    services: [
      'Atención médica de urgencias e ingreso de victimas de abuso',
      'Suministro del Kit Antirretroviral e ITS (primeras 72 horas)',
      'Valoración por psicología hospitalaria de turno'
    ],
    protocol: {
      title: 'Activación del Código Rosa Clínico',
      description: 'Ingreso directo por triaje de urgencias en los centros CAP (Pozón, Manga, Canapote, Arroz Barato) asegurando la no dilación de medicamentos antirretrovirales.',
      responseTime: 'Inmediata por Urgencias Hospitalarias',
      contactChannel: 'Jefatura de Urgencias ESE Cartagena',
      guarantees: [
        'Cero cobros por atención de urgencia para violencia de género',
        'Resguardo de la integridad física en sala de observación',
        'Notificación obligatoria a SIVIGILA y Fiscalía de turno'
      ]
    },
    website: 'https://esecartagena.gov.co',
    phone: '+57 605 651 7190',
    isFlagship: false
  },
  {
    id: 'red-nacional-mujeres',
    name: 'Red Nacional de Mujeres de Colombia — Capítulo Bolívar',
    acronym: 'RNM',
    category: 'ngo',
    categoryLabel: 'Defensoría Colectiva & Observatorio',
    scope: 'Nacional',
    description: 'Organización no gubernamental de articulación feminista nacional que impulsa la exigibilidad de derechos, observatorio de femicidios y apoyo a organizaciones de base.',
    logoBg: 'from-pink-600 to-rose-900',
    logoIcon: Users,
    iconColor: 'text-pink-200',
    services: [
      'Reporte y monitoreo a casos impunes de violencia machista',
      'Talleres de liderazgo político y derechos colectivos',
      'App Ella: Botón de pánico y redes de apoyo comunitarias'
    ],
    protocol: {
      title: 'Red de Apoyo y Respaldo Social',
      description: 'Articulación de litigio estratégico e incidencia pública en casos que requieran visibilización nacional para evitar la impunidad judicial en Bolívar.',
      responseTime: '24 horas',
      contactChannel: 'Coordinación Regional Caribe RNM',
      guarantees: [
        'Respaldo de la red comunitaria de organizaciones feministas',
        'Monitoreo a fallos judiciales con perspectiva de género',
        'Formación continua en derechos sexuales para lideresas'
      ]
    },
    website: 'https://rednacionaldemujeres.org',
    phone: '+57 601 245 6789',
    isFlagship: false
  },
  {
    id: 'utb-uninunez',
    name: 'Red Universitaria de Trabajo Social (UTB & Corporación Uninúñez)',
    acronym: 'UTB / CURN',
    category: 'academic',
    categoryLabel: 'Investigación & Desarrollo Social',
    scope: 'Cartagena / Distrital',
    description: 'Alianza con las escuelas de Trabajo Social, Desarrollo Familiar y Psicología para diagnósticos territoriales en barrios de alta vulnerabilidad en Cartagena.',
    logoBg: 'from-indigo-600 to-purple-900',
    logoIcon: GraduationCap,
    iconColor: 'text-indigo-200',
    services: [
      'Visitas domiciliarias y caracterización socieconómica integral',
      'Diagnósticos de riesgo psicosocial en comunidades vulnerables',
      'Talleres de educación vocacional y proyecto de vida'
    ],
    protocol: {
      title: 'Convenio de Intervención Psicosocial Territorial',
      description: 'Estudiantes de último año de Trabajo Social realizan su práctica profesional brindando seguimiento individualizado y tutoría a las beneficiarias de Senda Mujer.',
      responseTime: 'Semanal según agendamiento',
      contactChannel: 'Coordinación de Prácticas Facultad de Ciencias Sociales',
      guarantees: [
        'Supervisión técnica permanente por docentes especialistas',
        'Informes detallados para asignación de ayudas económicas',
        'Metodologías de diagnóstico validadas académicamente'
      ]
    },
    website: 'https://www.utb.edu.co',
    phone: '+57 605 653 5555',
    isFlagship: false
  }
];

export default function AlliesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalAlly, setActiveModalAlly] = useState<Ally | null>(null);
  const [partnerFormOpen, setPartnerFormOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  
  // Partner Form State
  const [formState, setFormState] = useState({
    institutionName: '',
    contactName: '',
    email: '',
    phone: '',
    type: 'ONG / Sociedad Civil',
    message: ''
  });

  const categories = [
    { id: 'all', label: 'Todos los Aliados', count: ALLIES_DATA.length },
    { id: 'public', label: 'Sector Público & Rutas', count: ALLIES_DATA.filter(a => a.category === 'public').length },
    { id: 'health', label: 'Salud & Medicina', count: ALLIES_DATA.filter(a => a.category === 'health').length },
    { id: 'ngo', label: 'ONGs & Cooperación', count: ALLIES_DATA.filter(a => a.category === 'ngo').length },
    { id: 'academic', label: 'Universidades & Academia', count: ALLIES_DATA.filter(a => a.category === 'academic').length },
  ];

  const filteredAllies = ALLIES_DATA.filter((ally) => {
    const matchesCategory = selectedCategory === 'all' || ally.category === selectedCategory;
    const matchesSearch =
      ally.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ally.acronym && ally.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ally.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ally.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.institutionName || !formState.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setPartnerFormOpen(false);
      setFormState({
        institutionName: '',
        contactName: '',
        email: '',
        phone: '',
        type: 'ONG / Sociedad Civil',
        message: ''
      });
    }, 3000);
  };

  return (
    <section id="aliados" className="py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-[#270538] to-slate-950 text-white relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-pink-300 font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Red Interinstitucional & Alianzas Estratégicas</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Nuestros Aliados Institucionales <br className="hidden sm:inline" />
            en <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">Cartagena y Colombia</span>
          </h2>

          <p className="text-sm sm:text-base text-purple-100/80 leading-relaxed">
            Trabajamos de la mano con el sector público, autoridades judiciales, organismos internacionales, clínicas y universidades para garantizar que ninguna mujer enfrente barreras burocráticas al exigir sus derechos.
          </p>
        </div>

        {/* ── Marquee / Ticker Ribbon of Key Partners ── */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md overflow-hidden shadow-inner">
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-pink-300/80 text-center mb-3">
            ✦ Articulación Garantizada con las Principales Entidades del Estado y la Sociedad Civil ✦
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-90">
            {[
              'Defensoría del Pueblo', 'Fiscalía CAIVAS', 'Profamilia', 'ICBF Bolívar', 
              'ONU Mujeres', 'Universidad de Cartagena', 'Alcaldía de Cartagena', 
              'ESE Hospital Local', 'Red Nacional de Mujeres', 'UTB'
            ].map((name, idx) => (
              <span
                key={idx}
                className="bg-purple-950/60 border border-purple-700/40 text-purple-200 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Controls: Categories & Search Bar ── */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'text-purple-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat.id ? 'bg-slate-950 text-amber-300' : 'bg-purple-900/60 text-pink-300'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-purple-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por aliado o servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-purple-300/50 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Allies Grid ── */}
        {filteredAllies.length === 0 ? (
          <div className="bg-slate-900/60 border border-purple-800/40 rounded-3xl p-12 text-center space-y-4">
            <HelpCircle className="w-12 h-12 text-purple-400 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-white">No se encontraron aliados que coincidan</h3>
            <p className="text-xs text-purple-200/70">Prueba ajustando los términos de búsqueda o cambiando el filtro de categoría.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAllies.map((ally) => {
              const IconComponent = ally.logoIcon;
              return (
                <div
                  key={ally.id}
                  className="bg-gradient-to-b from-slate-900/90 to-purple-950/80 border border-purple-700/30 rounded-3xl p-6 hover:border-pink-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Flagship Badge */}
                  {ally.isFlagship && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 font-extrabold text-[9px] px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
                      Aliado Clave
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header with Logo Badge & Category */}
                    <div className="flex items-start gap-3 pt-1">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ally.logoBg} flex items-center justify-center shrink-0 shadow-lg border border-white/10 group-hover:scale-105 transition-transform`}>
                        <IconComponent className={`w-7 h-7 ${ally.iconColor}`} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-pink-300 bg-pink-950/80 border border-pink-700/30 px-2 py-0.5 rounded-full inline-block">
                          {ally.categoryLabel}
                        </span>
                        <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors leading-snug">
                          {ally.name}
                        </h3>
                        {ally.acronym && (
                          <span className="text-[10px] font-extrabold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-md">
                            {ally.acronym}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-purple-100/80 leading-relaxed line-clamp-3">
                      {ally.description}
                    </p>

                    {/* Scope Pill & Key Services */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-200">
                        <MapPin className="w-3.5 h-3.5 text-pink-400" />
                        <span>Cobertura: <strong className="text-white">{ally.scope}</strong></span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                          Servicios Articulados:
                        </span>
                        {ally.services.slice(0, 2).map((srv, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-purple-100/90">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-5 mt-4 border-t border-purple-800/30 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveModalAlly(ally)}
                      className="flex-1 bg-white/10 hover:bg-pink-600/30 border border-white/10 hover:border-pink-400 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer group-hover:bg-purple-600/30"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ver Ruta / Protocolo</span>
                    </button>

                    {ally.website && (
                      <a
                        href={ally.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-slate-800 p-2.5 rounded-xl border border-white/10 text-purple-200 hover:text-white transition-colors cursor-pointer"
                        title="Visitar sitio web oficial"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Call-To-Action Banner: Join as an Ally ── */}
        <div className="bg-gradient-to-r from-[#3B0852] via-[#52166F] to-pink-900 rounded-3xl p-8 sm:p-12 border border-pink-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Alianza de Impacto Social
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                ¿Perteneces a una Institución, ONG o Empresa en Cartagena?
              </h3>
              <p className="text-xs sm:text-sm text-pink-100 leading-relaxed max-w-2xl">
                Unamos fuerzas para ampliar las redes de apoyo a mujeres vulnerables en Bolívar. Firmemos acuerdos de colaboración, voluntariado profesional, patrocinio o derivación directa de casos.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => setPartnerFormOpen(true)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm px-6 py-4 rounded-2xl text-center shadow-xl transition-all cursor-pointer flex items-center justify-center space-x-2 active:scale-95"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Solicitar Alianza Institucional</span>
              </button>
              
              <a
                href="mailto:contacto@fundacionsendamujer.org?subject=Solicitud%20de%20Alianza%20Institucional"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-5 py-3 rounded-2xl text-center transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4 text-pink-300" />
                <span>Escribir al Correo de Dirección</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modal 1: Ally Protocol Details ── */}
      {activeModalAlly && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border border-purple-600/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalAlly(null)}
              className="absolute top-5 right-5 text-purple-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 pr-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeModalAlly.logoBg} flex items-center justify-center shrink-0 shadow-lg border border-white/20`}>
                {React.createElement(activeModalAlly.logoIcon, { className: `w-8 h-8 ${activeModalAlly.iconColor}` })}
              </div>
              <div className="space-y-1">
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeModalAlly.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeModalAlly.name}
                </h3>
                <p className="text-xs text-amber-300 font-bold">
                  Cobertura Territorial: {activeModalAlly.scope}
                </p>
              </div>
            </div>

            {/* Protocol Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <FileText className="w-4 h-4" />
                <h4>{activeModalAlly.protocol.title}</h4>
              </div>

              <p className="text-xs text-purple-100 leading-relaxed">
                {activeModalAlly.protocol.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-[10px] font-extrabold text-purple-300 uppercase block">Tiempo de Respuesta</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {activeModalAlly.protocol.responseTime}
                  </span>
                </div>

                <div className="bg-purple-950/70 p-3 rounded-xl border border-purple-800/40">
                  <span className="text-[10px] font-extrabold text-purple-300 uppercase block">Canal Directo de Enlace</span>
                  <span className="text-xs font-bold text-pink-300 truncate block mt-0.5">
                    {activeModalAlly.protocol.contactChannel}
                  </span>
                </div>
              </div>

              {/* Guarantees list */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">
                  Garantías de la Articulación:
                </span>
                <div className="space-y-1.5">
                  {activeModalAlly.protocol.guarantees.map((g, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-purple-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              {activeModalAlly.phone && (
                <a
                  href={`tel:${activeModalAlly.phone}`}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Llamar a Línea Directa: {activeModalAlly.phone}</span>
                </a>
              )}

              {activeModalAlly.website && (
                <a
                  href={activeModalAlly.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>Portal Oficial ↗</span>
                </a>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Modal 2: Partner Registration Form ── */}
      {partnerFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-pink-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <button
              onClick={() => setPartnerFormOpen(false)}
              className="absolute top-5 right-5 text-purple-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" /> Registro de Convenio Institucional
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                Unirse como Aliado Estratégico
              </h3>
              <p className="text-xs text-purple-200/80">
                Completa el formulario para que nuestra Coordinación de Alianzas se ponga en contacto con tu organización.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-base text-white">¡Solicitud de Alianza Recibida!</h4>
                <p className="text-xs text-emerald-200">
                  Gracias por tu interés en aliarte con Fundación Senda Mujer. Revisaremos la información y te contactaremos en un plazo máximo de 48 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-purple-200 block mb-1">Nombre de la Entidad u Organización *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Fundación Salud Viva / Universidad Cartagena"
                    value={formState.institutionName}
                    onChange={(e) => setFormState({ ...formState, institutionName: e.target.value })}
                    className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-purple-200 block mb-1">Persona de Contacto</label>
                    <input
                      type="text"
                      placeholder="Nombre del delegado"
                      value={formState.contactName}
                      onChange={(e) => setFormState({ ...formState, contactName: e.target.value })}
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-purple-200 block mb-1">Tipo de Organización</label>
                    <select
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option>ONG / Sociedad Civil</option>
                      <option>Entidad Pública / Estado</option>
                      <option>Centro Médico / IPS / Salud</option>
                      <option>Universidad / Institución Educativa</option>
                      <option>Empresa Privada / Donante</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-purple-200 block mb-1">Correo Electrónico Corporativo *</label>
                    <input
                      type="email"
                      required
                      placeholder="alianzas@entidad.org"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-purple-200 block mb-1">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-purple-200 block mb-1">Propuesta o Mensaje de Alianza</label>
                  <textarea
                    rows={3}
                    placeholder="Describe brevemente cómo visualizas la colaboración institucional (ej. derivación de usuarias, servicios gratuitos, voluntariado)..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-slate-800 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Enviar Propuesta de Alianza</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
