/**
 * INITIAL_COURSES — Datos estáticos de cursos para Academia SendaMujer.
 *
 * Este archivo es puro TypeScript sin ninguna importación de Mongoose,
 * connectToDatabase ni módulo de servidor. Puede ser importado de manera
 * segura desde componentes "use client" y desde rutas API de servidor.
 */

export const INITIAL_COURSES = [
  {
    slug: "marketing-digital-emprendedoras",
    title: "Marketing Digital para Emprendedoras",
    subtitle: "Aprende a posicionar tu marca, crear contenido y multiplicar tus ventas en redes sociales",
    instructor: "Mg. Laura Gómez Rodríguez",
    instructorRole: "Especialista en Growth y Marketing Social",
    category: "Habilidades Digitales",
    level: "Básico",
    durationWeeks: "8 semanas",
    totalDuration: "4h 15min",
    rating: 4.9,
    reviewsCount: 2150,
    studentsCount: 3840,
    badge: "Popular",
    thumbnailUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Identificar tu cliente ideal y propuesta de valor única",
      "Crear publicaciones de alto impacto en Instagram y Facebook",
      "Configurar campañas de publicidad digital y WhatsApp Business",
      "Medir resultados e interpretar métricas de conversión",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Fundamentos del Marketing Digital",
        description: "Bases esenciales del marketing moderno para emprendimientos liderados por mujeres.",
        lessons: [
          {
            id: "m1-l1",
            title: "Clase 1: Introducción al Marketing Digital",
            duration: "14 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            description: "En esta clase aprenderás los conceptos básicos del marketing digital y cómo aplicarlos en tu negocio o emprendimiento.",
            isPreview: true,
            resources: [
              { title: "Guía de Fundamentos del Marketing.pdf", url: "#", type: "pdf", size: "2.4 MB" },
              { title: "Plantilla de Buyer Persona Senda.xlsx", url: "#", type: "excel", size: "1.2 MB" },
            ],
          },
          {
            id: "m1-l2",
            title: "Clase 2: Público Objetivo y Propuesta de Valor",
            duration: "18 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            description: "Define con precisión a quién le vendes y por qué elegirán tu producto o servicio.",
            resources: [
              { title: "Workbook: Mapa de Empatía.pdf", url: "#", type: "pdf", size: "1.8 MB" },
            ],
          },
          {
            id: "m1-l3",
            title: "Clase 3: Estrategia de Contenido y Pilares de Marca",
            duration: "22 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            description: "Cómo estructurar un calendario editorial mensual sin saturarte de trabajo.",
            resources: [
              { title: "Calendario Editorial Editable 2026.xlsx", url: "#", type: "excel", size: "890 KB" },
            ],
          },
        ],
      },
      {
        title: "Módulo 2 — Redes Sociales y WhatsApp Business",
        description: "Convierte seguidores en clientes recurrentes con atención automatizada.",
        lessons: [
          {
            id: "m2-l1",
            title: "Clase 4: Configuración Profesional de WhatsApp Business",
            duration: "16 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            description: "Catálogo de productos, mensajes de bienvenida y respuestas rápidas.",
            resources: [
              { title: "Checklist WhatsApp Business Pro.pdf", url: "#", type: "pdf", size: "950 KB" },
            ],
          },
          {
            id: "m2-l2",
            title: "Clase 5: Reels y Formatos de Video que Convierten",
            duration: "25 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            description: "Guiones y técnicas de grabación sencilla desde tu teléfono móvil.",
          },
        ],
      },
      {
        title: "Módulo 3 — Publicidad Digital y Presupuesto",
        description: "Cómo invertir desde $10.000 COP al día de manera efectiva.",
        lessons: [
          {
            id: "m3-l1",
            title: "Clase 6: Creación de Anuncios en Meta Ads",
            duration: "28 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            description: "Segmentación geográfica en Cartagena y Bolívar para negocios locales.",
          },
        ],
      },
      {
        title: "Módulo 4 — Análisis de Resultados y Cierre",
        description: "Mide tu retorno y prepara tu evaluación para recibir el certificado.",
        lessons: [
          {
            id: "m4-l1",
            title: "Clase 7: Métricas Clave y Plan de Crecimiento",
            duration: "20 min",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            description: "Resumen final y preparación para la certificación oficial SendaMujer.",
          },
        ],
      },
    ],
  },
  {
    slug: "emprendimiento-femenino-idea-al-negocio",
    title: "Emprendimiento Femenino: De la Idea al Negocio",
    subtitle: "Metodología paso a paso para estructurar un emprendimiento rentable y sostenible",
    instructor: "Dra. Sorelvis Murillo",
    instructorRole: "Directora Fundación Senda Mujer",
    category: "Emprendimiento",
    level: "Básico",
    durationWeeks: "6 semanas",
    totalDuration: "3h 30min",
    rating: 4.8,
    reviewsCount: 1540,
    studentsCount: 2890,
    badge: "Popular",
    thumbnailUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Validar tu idea de negocio en el mercado real",
      "Calcular costos fijos, costos variables y punto de equilibrio",
      "Diseñar tu modelo de negocio Canvas adaptado al Caribe",
      "Postular a programas de capital semilla y fortalecimiento",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Mi Idea y Oportunidad",
        lessons: [
          { id: "emp-1", title: "1.1 Identificación de Oportunidades Locales", duration: "15 min", isPreview: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: "emp-2", title: "1.2 Validación Rápida con Clientes Reales", duration: "20 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        ],
      },
      {
        title: "Módulo 2 — Mis Números y Finanzas Clave",
        lessons: [
          { id: "emp-3", title: "2.1 Costos Fijos vs Variables", duration: "22 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
          { id: "emp-4", title: "2.2 Cómo Fijar el Precio de Venta", duration: "18 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
        ],
      },
    ],
  },
  {
    slug: "liderazgo-comunicacion-asertiva",
    title: "Liderazgo y Comunicación Asertiva",
    subtitle: "Fortalece tu voz, negocia con seguridad y lidera proyectos de impacto en tu comunidad",
    instructor: "Dra. Carmen Cecilia Pérez",
    instructorRole: "Especialista en Psicología y Liderazgo Comunitario",
    category: "Liderazgo",
    level: "Básico",
    durationWeeks: "5 semanas",
    totalDuration: "2h 50min",
    rating: 4.7,
    reviewsCount: 1210,
    studentsCount: 1940,
    badge: "Nuevo",
    thumbnailUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Técnicas de oratoria y expresión asertiva",
      "Resolución pacífica de conflictos y negociación",
      "Liderazgo empático y trabajo colaborativo",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Autoestima y Presencia",
        lessons: [
          { id: "lid-1", title: "1.1 Descubriendo tu Estilo de Liderazgo", duration: "16 min", isPreview: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: "lid-2", title: "1.2 Vencer el Miedo a Hablar en Público", duration: "19 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        ],
      },
    ],
  },
  {
    slug: "finanzas-personales-presupuesto",
    title: "Finanzas Personales y Ahorro Inteligente",
    subtitle: "Toma el control de tu dinero, elimina deudas y crea un fondo de tranquilidad económica",
    instructor: "Mg. Carlos Mendoza",
    instructorRole: "Economista & Asesor Financiero Senda",
    category: "Finanzas",
    level: "Básico",
    durationWeeks: "5 semanas",
    totalDuration: "3h 10min",
    rating: 4.7,
    reviewsCount: 1050,
    studentsCount: 1720,
    badge: "Destacado",
    thumbnailUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Presupuesto 50/30/20 adaptado a ingresos variables",
      "Estrategias comprobadas para salir de deudas",
      "Microahorro y bancarización segura",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Diagnóstico Financiero",
        lessons: [
          { id: "fin-1", title: "1.1 Dónde se va mi dinero cada mes", duration: "14 min", isPreview: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: "fin-2", title: "1.2 Creación del Presupuesto Familiar", duration: "22 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        ],
      },
    ],
  },
  {
    slug: "derechos-humanos-ley-1257",
    title: "Derechos Humanos y Ley 1257 en Colombia",
    subtitle: "Conoce tus derechos, las rutas de protección institucional y los mecanismos legales de defensa",
    instructor: "Abg. Carlos Mendoza",
    instructorRole: "Abogado Especialista en DDHH y Género",
    category: "Desarrollo Personal",
    level: "Intermedio",
    durationWeeks: "6 semanas",
    totalDuration: "4h 00min",
    rating: 4.9,
    reviewsCount: 1820,
    studentsCount: 2310,
    badge: "Destacado",
    thumbnailUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Marco legal de protección de las mujeres en Colombia",
      "Rutas de atención integral ante Comisarías, Fiscalía y Salud",
      "Cómo redactar un derecho de petición o tutela con plantillas",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Marco Normativo de la Ley 1257",
        lessons: [
          { id: "der-1", title: "1.1 Tipos de Violencia y Manifestaciones", duration: "18 min", isPreview: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: "der-2", title: "1.2 Rutas de Atención Institucional en Cartagena", duration: "24 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        ],
      },
    ],
  },
  {
    slug: "diseno-contenido-redes-canva",
    title: "Diseño de Contenido para Redes en Canva",
    subtitle: "Crea piezas gráficas profesionales, flyers y catálogos digitales desde tu celular",
    instructor: "Mg. Karen Ramos",
    instructorRole: "Diseñadora Visual & Asesora Digital",
    category: "Arte y Cultura",
    level: "Básico",
    durationWeeks: "4 semanas",
    totalDuration: "2h 45min",
    rating: 4.6,
    reviewsCount: 857,
    studentsCount: 1420,
    badge: "Nuevo",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    learningOutcomes: [
      "Paleta de color y tipografía para tu negocio",
      "Diseño de posts y stories interactivos en Canva gratuito",
      "Exportación en alta calidad para impresión y digital",
    ],
    certificateEnabled: true,
    published: true,
    modules: [
      {
        title: "Módulo 1 — Primeros Pasos con Canva",
        lessons: [
          { id: "can-1", title: "1.1 Interfaz y Herramientas Esenciales", duration: "12 min", isPreview: true, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
          { id: "can-2", title: "1.2 Creación de tu Identidad Visual", duration: "20 min", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
        ],
      },
    ],
  },
];
