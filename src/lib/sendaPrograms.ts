/**
 * Definición oficial de los 7 Programas de la Fundación Senda Mujer
 * y lógica de auto-clasificación / derivación de hogares a partir del censo comunitario.
 */

export interface SendaProgramDef {
  id: string;
  code: string;
  number: string;
  title: string;
  badge: string;
  color: string;
  bgBadge: string;
  textBadge: string;
  summary: string;
  targetCriteria: string;
  coordinator: string;
}

export const SENDA_PROGRAMS: SendaProgramDef[] = [
  {
    id: 'programa-1',
    code: 'P01',
    number: '01',
    title: 'Mujer Acompañada',
    badge: 'Atención Social Inicial',
    color: '#EC4899',
    bgBadge: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
    textBadge: 'text-pink-300',
    summary: 'Atención social inicial, valoración de vulnerabilidad multidimensional y mapa de redes de contención familiar.',
    targetCriteria: 'Hacinamiento crítico (>3 pers/cuarto), indocumentación, deserción escolar de NNA, sin acueducto continuo o discapacidad en el hogar.',
    coordinator: 'Trabajo Social & Bienestar Comunitario'
  },
  {
    id: 'programa-2',
    code: 'P02',
    number: '02',
    title: 'Víctimas de Violencia Sexual',
    badge: 'Acompañamiento de Caso',
    color: '#A855F7',
    bgBadge: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    textBadge: 'text-purple-300',
    summary: 'Acompañamiento humano integral ante instituciones de salud y justicia (Fiscalía, ICBF, Medicina Legal) sin revictimización.',
    targetCriteria: 'Antecedente o sospecha de violencia sexual, solicitud de profilaxis post-exposición (PEP/ITS) o ruta de urgencia vital activada.',
    coordinator: 'Equipo Especializado de Caso & Fiscalía'
  },
  {
    id: 'programa-3',
    code: 'P03',
    number: '03',
    title: 'Contención Psicosocial',
    badge: 'Salud Mental & Emocional',
    color: '#38BDF8',
    bgBadge: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
    textBadge: 'text-sky-300',
    summary: 'Espacios seguros de psicoterapia clínica individual, círculos de la palabra, manejo del duelo, trauma y reconstrucción de la autoestima.',
    targetCriteria: 'Solicitud expresa de apoyo psicológico en la encuesta, síndrome de agotamiento del cuidador o mujeres afectadas por violencia intrafamiliar.',
    coordinator: 'Psicología Clínica & Círculos de Sanación'
  },
  {
    id: 'programa-4',
    code: 'P04',
    number: '04',
    title: 'Ruta de Salud y Derechos',
    badge: 'Salud Sexual & C-055',
    color: '#10B981',
    bgBadge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    textBadge: 'text-emerald-300',
    summary: 'Orientación ginecológica oportuna, citologías cérvico-uterinas, detección y tratamiento sindrómico de ITS, y anticoncepción informada.',
    targetCriteria: 'Citología vencida (+3 años o nunca), síntomas/sospecha de ITS, deseo de anticoncepción (implantes), infecciones recurrentes o sin EPS.',
    coordinator: 'Brigada Médica, Ginecología & DADIS'
  },
  {
    id: 'programa-5',
    code: 'P05',
    number: '05',
    title: 'Embarazo con Apoyo',
    badge: 'Maternidad Elegida',
    color: '#F59E0B',
    bgBadge: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    textBadge: 'text-amber-300',
    summary: 'Acompañamiento a mujeres que deciden continuar su embarazo: controles prenatales, paquetes nutricionales, lactancia y pediatría de primer año.',
    targetCriteria: 'Gestante o lactante en el hogar, controles prenatales rezagados, gestación adolescente o desnutrición infantil.',
    coordinator: 'Salud Materno-Perinatal & Nutrición'
  },
  {
    id: 'programa-6',
    code: 'P06',
    number: '06',
    title: 'Mujer y Justicia',
    badge: 'Asesoría Jurídica VBG',
    color: '#8B5CF6',
    bgBadge: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
    textBadge: 'text-violet-300',
    summary: 'Representación legal en comisarías de familia, demandas de alimentos, custodia, medidas de protección efectivas y titulación de predios.',
    targetCriteria: 'Víctima de violencia intrafamiliar (VIF/VBG), inasistencia alimentaria de menores, vivienda sin título formal o embargos.',
    coordinator: 'Defensoría de Derechos & Consultorio Jurídico'
  },
  {
    id: 'programa-7',
    code: 'P07',
    number: '07',
    title: 'Proyecto de Vida & Autonomía',
    badge: 'Autonomía Económica',
    color: '#E12880',
    bgBadge: 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
    textBadge: 'text-fuchsia-300',
    summary: 'Talleres en confección textil, emprendimiento, habilidades digitales, bolsa de empleo y capital semilla para romper la dependencia económica.',
    targetCriteria: 'Buscadores de empleo activo, jóvenes bachilleres desocupados, sustento de rebusque informal o mujeres en riesgo que necesitan ingresos propios.',
    coordinator: 'Talleres Productivos & Alianzas Empresariales'
  }
];

/**
 * Función de Inteligencia Territorial para derivar automáticamente
 * cada hogar a los programas de la Fundación Senda Mujer que le corresponden.
 */
export function computeAssignedPrograms(s: any): string[] {
  const assigned = new Set<string>();

  // Si el hogar expresó interés directo en ciertos programas (Sección F), agregarlos
  if (Array.isArray(s.interestedPrograms) && s.interestedPrograms.length > 0) {
    s.interestedPrograms.forEach((p: string) => assigned.add(p));
  }

  // Si ya tiene programas asignados explícitamente y no está vacío, respetarlos
  if (Array.isArray(s.assignedPrograms) && s.assignedPrograms.length > 0) {
    s.assignedPrograms.forEach((p: string) => assigned.add(p));
  }

  /* ── P01: Mujer Acompañada ── */
  const roomsCount = Math.max(Number(s.rooms) || 1, 1);
  const sizeCount = Number(s.householdSize) || 1;
  const isOvercrowded = (sizeCount / roomsCount) > 3;
  if (
    !s.allDocumentsValid ||
    !s.allNNASchooled ||
    isOvercrowded ||
    (s.waterSource && s.waterSource !== 'ACUEDUCTO') ||
    s.hasDisabledMember ||
    s.hasChildMalnutrition ||
    (Array.isArray(s.needs) && (s.needs.includes('documentacion') || s.needs.includes('educacion') || s.needs.includes('vivienda')))
  ) {
    assigned.add('programa-1');
  }

  /* ── P02: Víctimas de Violencia Sexual ── */
  if (
    s.hasSexualViolenceIndicator ||
    s.activateImmediateRoute ||
    (typeof s.immediateRouteType === 'string' && s.immediateRouteType.toLowerCase().includes('violencia')) ||
    (typeof s.observedRiskIndicators === 'string' && s.observedRiskIndicators.toLowerCase().includes('sexual')) ||
    (typeof s.collectorObservations === 'string' && s.collectorObservations.toLowerCase().includes('sexual'))
  ) {
    assigned.add('programa-2');
  }

  /* ── P03: Contención Psicosocial ── */
  if (
    s.psychologicalSupportNeeded ||
    s.hasCaregiverBurnout ||
    s.hasVIFVBG ||
    (Array.isArray(s.needs) && s.needs.includes('psicosocial')) ||
    (typeof s.urgentCaseDescription === 'string' && s.urgentCaseDescription.toLowerCase().includes('amenaza'))
  ) {
    assigned.add('programa-3');
  }

  /* ── P04: Ruta de Salud y Derechos ── */
  const papCritica = s.lastPapSmear === 'MAS_3_ANOS' || s.lastPapSmear === 'NUNCA';
  if (
    papCritica ||
    s.hasSTIHistoryOrSymptoms ||
    s.vaginalInfectionSymptoms ||
    s.desiresFamilyPlanningCounseling ||
    s.hasMammographyOrUltrasoundNeeded ||
    s.hasTeenPregnancy ||
    !s.allEPSAffiliated ||
    s.dentalCarePending ||
    (Array.isArray(s.needs) && (
      s.needs.includes('salud') ||
      s.needs.includes('its_ginecologia') ||
      s.needs.includes('citologia_urgente') ||
      s.needs.includes('planificacion_familiar') ||
      s.needs.includes('acceso_salud')
    ))
  ) {
    assigned.add('programa-4');
  }

  /* ── P05: Embarazo con Apoyo ── */
  if (
    s.hasPregnantOrLactating ||
    s.hasTeenPregnancy ||
    s.hasChildMalnutrition ||
    (Array.isArray(s.needs) && s.needs.includes('materna')) ||
    s.hasEDAParasites ||
    !s.vaccinesUpToDate
  ) {
    assigned.add('programa-5');
  }

  /* ── P06: Mujer y Justicia ── */
  if (
    s.hasVIFVBG ||
    s.hasMedidaProteccion ||
    s.hasFamilyProcess ||
    !s.hasHousingDocument ||
    s.hasDebtOrProcess ||
    (s.knowsRightsAndRoutes === false && (s.hasVIFVBG || s.hasFamilyProcess)) ||
    (Array.isArray(s.needs) && (s.needs.includes('violencia') || s.needs.includes('familia') || s.needs.includes('tramites')))
  ) {
    assigned.add('programa-6');
  }

  /* ── P07: Proyecto de Vida & Autonomía ── */
  const incomeStr = typeof s.incomeSource === 'string' ? s.incomeSource.toLowerCase() : '';
  const isInformal = incomeStr.includes('rebusque') || incomeStr.includes('fritos') || incomeStr.includes('ambulante') || incomeStr.includes('reciclaje');
  if (
    s.interestInTraining ||
    s.hasJobSeeker ||
    s.hasRecentGraduate ||
    isInformal ||
    (Array.isArray(s.needs) && (s.needs.includes('empleo') || s.needs.includes('subsidios')))
  ) {
    assigned.add('programa-7');
  }

  // Fallback: al menos programa 1 (Atención Social y Acompañamiento)
  if (assigned.size === 0) {
    assigned.add('programa-1');
  }

  return Array.from(assigned);
}
