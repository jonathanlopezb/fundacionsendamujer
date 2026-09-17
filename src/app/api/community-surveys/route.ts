/**
 * API Route: /api/community-surveys
 * Recibe, valida y persiste la caracterización familiar completa.
 * Cumple Ley 1581/2012 (Habeas Data) — solo persiste con consentimiento previo y explícito.
 */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunitySurvey from '@/lib/models/CommunitySurvey';
import { computeAssignedPrograms } from '@/lib/sendaPrograms';
import { readSurveyAnalysisSession } from '@/lib/survey-analysis-auth';

const ALLOWED_NEEDS = new Set([
  'salud', 'afiliacion', 'materna', 'vacunacion', 'cronica', 'acceso_salud',
  'educacion', 'documentacion', 'familia', 'violencia',
  'vivienda', 'tramites', 'subsidios', 'empleo',
  'its_ginecologia', 'citologia_urgente', 'planificacion_familiar',
]);

const ALLOWED_WATER = new Set(['ACUEDUCTO', 'PILA_PUBLICA', 'CARROTANQUE', 'POZO', 'OTRO']);
const ALLOWED_HOUSING = new Set(['PROPIA', 'ARRENDADA', 'FAMILIAR', 'OTRA']);
const ALLOWED_RISK = new Set(['BAJO', 'MEDIO', 'ALTO']);
const ALLOWED_DOC_TYPES = new Set(['RC', 'TI', 'CC', 'CE', 'PA', 'OTRO', 'SIN_DOC']);
const ALLOWED_PAP = new Set(['MENOS_1_ANO', '1_A_3_ANOS', 'MAS_3_ANOS', 'NUNCA', 'NO_APLICA']);
const ALLOWED_PLANNING = new Set(['NINGUNO', 'ORAL', 'INYECTABLE', 'IMPLANTE', 'DIU', 'BARRERA', 'QUIRURGICO', 'OTRO']);

function str(v: unknown, max = 400): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function bool(v: unknown): boolean {
  return v === true;
}
function num(v: unknown, min = 0, max = 50): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(Math.round(n), min), max);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barrio = searchParams.get('barrio');
    const view = searchParams.get('view');

    // Rechaza la vista identificable antes de abrir una consulta a la base de datos.
    if (view === 'private' && !readSurveyAnalysisSession()) {
      return NextResponse.json(
        { success: false, message: 'El acceso a las fichas protegidas no esta autorizado.', surveys: [] },
        { status: 403 }
      );
    }

    const db = await connectToDatabase();
    if (db.connection.readyState !== 1) throw new Error('MongoDB no disponible');

    const query: Record<string, unknown> = {};
    if (barrio && barrio !== 'TODOS') {
      query.barrio = new RegExp(`^${barrio.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    const surveys = await CommunitySurvey.find(query).sort({ createdAt: -1 }).lean();

    if (view === 'private') {
      return NextResponse.json({ success: true, surveys });
    }

    if (view !== 'analysis') {
      return NextResponse.json(
        { success: false, message: 'Esta consulta requiere una vista analítica autorizada.', surveys: [] },
        { status: 403 }
      );
    }

    // La vista territorial no necesita identidades ni datos de contacto.
    const analysisSurveys = surveys.map(({ householdMembers, contactPhone, landmark, collectorName, collectorCode, manzana, ...survey }) => ({
      ...survey,
      householdMembers: householdMembers.map((member: { age: number; relationship: string; documentType: string }) => ({
        age: member.age,
        relationship: member.relationship,
        documentType: member.documentType,
      })),
    }));

    return NextResponse.json({ success: true, surveys: analysisSurveys });
  } catch (err) {
    console.error('[community-surveys GET] Error al consultar:', err);
    return NextResponse.json(
      { success: false, message: 'Error al obtener encuestas registradas', surveys: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /* ── Consentimiento obligatorio ──────────────────────────────────── */
    if (!body.consentGranted) {
      return NextResponse.json(
        { success: false, message: 'El consentimiento informado es obligatorio para registrar la ficha.' },
        { status: 400 }
      );
    }

    const householdSize = num(body.householdSize, 1, 50);
    const minorCount = num(body.minorCount, 0, householdSize);

    if (householdSize < 1) {
      return NextResponse.json(
        { success: false, message: 'El tamaño del hogar debe ser al menos 1 persona.' },
        { status: 400 }
      );
    }

    /* ── Miembros del hogar ──────────────────────────────────────────── */
    const householdMembers = Array.isArray(body.householdMembers)
      ? body.householdMembers
          .filter((m: unknown) => m && typeof m === 'object')
          .map((m: Record<string, unknown>) => ({
            fullName: str(m.fullName, 120),
            age: num(m.age, 0, 120),
            relationship: str(m.relationship, 60),
            documentType: ALLOWED_DOC_TYPES.has(String(m.documentType))
              ? String(m.documentType)
              : 'CC',
            documentNumber: str(m.documentNumber, 30),
          }))
          .filter((m: { fullName: string }) => m.fullName.length > 0)
      : [];

    /* ── Necesidades priorizadas ─────────────────────────────────────── */
    const needs = Array.isArray(body.needs)
      ? body.needs.filter((n: unknown) => typeof n === 'string' && ALLOWED_NEEDS.has(n))
      : [];

    /* ── Prioridad calculada ─────────────────────────────────────────── */
    const riskLevel = ALLOWED_RISK.has(str(body.riskLevel, 10))
      ? (str(body.riskLevel, 10) as 'BAJO' | 'MEDIO' | 'ALTO')
      : 'BAJO';

    const priority =
      bool(body.activateImmediateRoute) || bool(body.hasUrgentCase) || riskLevel === 'ALTO' || bool(body.hasSexualViolenceIndicator)
        ? 'INMEDIATA'
        : needs.includes('violencia') || needs.includes('cronica') || bool(body.hasVIFVBG) || riskLevel === 'MEDIO' || bool(body.hasSTIHistoryOrSymptoms)
        ? 'PRIORITARIA'
        : 'NORMAL';

    const surveyCode = `CS-${str(body.barrio, 20).toUpperCase().replace(/\s+/g, '-').slice(0, 12)}-${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const payload = {
      surveyCode,
      barrio: str(body.barrio, 100) || 'SIN_BARRIO',
      manzana: str(body.manzana, 100),
      visitDate: body.visitDate ? new Date(body.visitDate) : new Date(),
      collectorName: str(body.collectorName, 100),
      collectorCode: str(body.collectorCode, 30),
      fieldZone: str(body.fieldZone, 80),
      contactPhone: str(body.contactPhone, 20),
      landmark: str(body.landmark, 200),

      /* A */
      householdMembers,
      householdSize,
      minorCount,
      allDocumentsValid: bool(body.allDocumentsValid),
      documentsIssue: str(body.documentsIssue),
      allNNASchooled: bool(body.allNNASchooled),
      schoolDropoutReason: str(body.schoolDropoutReason),
      hasDisabledMember: bool(body.hasDisabledMember),
      disabledDetails: str(body.disabledDetails),
      hasElderlyMember: bool(body.hasElderlyMember),
      elderlyCount: num(body.elderlyCount, 0, 20),
      rooms: num(body.rooms, 1, 30),
      overcrowdingNotes: str(body.overcrowdingNotes, 300),

      /* B - Salud General */
      allEPSAffiliated: bool(body.allEPSAffiliated),
      epsRegime: str(body.epsRegime, 100),
      nonAffiliatedReason: str(body.nonAffiliatedReason),
      hasPregnantOrLactating: bool(body.hasPregnantOrLactating),
      prenatalCareStatus: str(body.prenatalCareStatus, 300),
      vaccinesUpToDate: bool(body.vaccinesUpToDate),
      vaccineCardAvailable: bool(body.vaccineCardAvailable),
      hasChronicDisease: bool(body.hasChronicDisease),
      chronicDiseaseDetails: str(body.chronicDiseaseDetails),
      hasEDAParasites: bool(body.hasEDAParasites),
      edaDetails: str(body.edaDetails, 300),
      dentalCarePending: bool(body.dentalCarePending),
      healthcareAccessDifficulty: bool(body.healthcareAccessDifficulty),
      healthcareAccessDetails: str(body.healthcareAccessDetails),
      waterSource: ALLOWED_WATER.has(str(body.waterSource, 20))
        ? str(body.waterSource, 20)
        : 'ACUEDUCTO',
      psychologicalSupportNeeded: bool(body.psychologicalSupportNeeded),
      psychologicalSupportWho: str(body.psychologicalSupportWho, 300),
      hasCaregiverBurnout: bool(body.hasCaregiverBurnout),

      /* B.1 - Citas Médicas por Especialidad & Salud de la Mujer */
      needsGynecology: bool(body.needsGynecology),
      gynecologySymptoms: str(body.gynecologySymptoms, 500),
      needsGeneralMedicine: bool(body.needsGeneralMedicine),
      generalMedicineReason: str(body.generalMedicineReason, 500),
      needsPediatrics: bool(body.needsPediatrics),
      pediatricsReason: str(body.pediatricsReason, 500),
      needsDental: bool(body.needsDental),
      dentalReason: str(body.dentalReason, 500),
      needsPsychology: bool(body.needsPsychology),
      psychologyReason: str(body.psychologyReason, 500),
      needsNutrition: bool(body.needsNutrition),
      nutritionReason: str(body.nutritionReason, 500),

      lastPapSmear: ALLOWED_PAP.has(str(body.lastPapSmear, 30))
        ? str(body.lastPapSmear, 30)
        : 'NO_APLICA',
      familyPlanningMethod: ALLOWED_PLANNING.has(str(body.familyPlanningMethod, 30))
        ? str(body.familyPlanningMethod, 30)
        : 'NINGUNO',
      desiresFamilyPlanningCounseling: bool(body.desiresFamilyPlanningCounseling),
      breastSelfExamTrained: bool(body.breastSelfExamTrained),
      hasMammographyOrUltrasoundNeeded: bool(body.hasMammographyOrUltrasoundNeeded),
      hasSTIHistoryOrSymptoms: bool(body.hasSTIHistoryOrSymptoms),
      stiSymptomsDetails: str(body.stiSymptomsDetails, 400),
      vaginalInfectionSymptoms: bool(body.vaginalInfectionSymptoms),
      hasSexualViolenceIndicator: bool(body.hasSexualViolenceIndicator),
      hasTeenPregnancy: bool(body.hasTeenPregnancy),
      hasChildMalnutrition: bool(body.hasChildMalnutrition),

      /* C */
      hasFamilyProcess: bool(body.hasFamilyProcess),
      familyProcessDetails: str(body.familyProcessDetails),
      hasVIFVBG: bool(body.hasVIFVBG),
      vifComplaintFiled: bool(body.vifComplaintFiled),
      vifProcessStatus: str(body.vifProcessStatus),
      knowsRightsAndRoutes: bool(body.knowsRightsAndRoutes),
      hasMedidaProteccion: bool(body.hasMedidaProteccion),
      housingType: ALLOWED_HOUSING.has(str(body.housingType, 20))
        ? str(body.housingType, 20)
        : 'ARRENDADA',
      hasHousingDocument: bool(body.hasHousingDocument),
      hasDebtOrProcess: bool(body.hasDebtOrProcess),
      debtDetails: str(body.debtDetails),
      needsPensionOrSubsidy: bool(body.needsPensionOrSubsidy),
      pensionDetails: str(body.pensionDetails),
      hasUrgentCase: bool(body.hasUrgentCase),
      urgentCaseDescription: str(body.urgentCaseDescription, 600),
      needsLegalCounseling: bool(body.needsLegalCounseling),
      legalCounselingReason: str(body.legalCounselingReason, 500),
      needsCivicRegistration: bool(body.needsCivicRegistration),
      civicRegistrationReason: str(body.civicRegistrationReason, 500),

      /* D */
      incomeSource: str(body.incomeSource, 300),
      receivesSubsidies: bool(body.receivesSubsidies),
      subsidiesDetails: str(body.subsidiesDetails),
      hasJobSeeker: bool(body.hasJobSeeker),
      jobSearchDifficulty: str(body.jobSearchDifficulty),
      hasRecentGraduate: bool(body.hasRecentGraduate),
      graduateStatus: str(body.graduateStatus, 300),
      interestInTraining: bool(body.interestInTraining),
      hasSmartphoneAccess: bool(body.hasSmartphoneAccess),

      /* E */
      riskLevel,
      observedRiskIndicators: str(body.observedRiskIndicators, 600),
      authorizedRecontact: bool(body.authorizedRecontact),
      collectorObservations: str(body.collectorObservations, 800),
      activateImmediateRoute: bool(body.activateImmediateRoute),
      immediateRouteType: str(body.immediateRouteType, 200),

      needs,
      interestedPrograms: Array.isArray(body.interestedPrograms)
        ? body.interestedPrograms.filter((p: unknown) => typeof p === 'string')
        : [],
      assignedPrograms: Array.isArray(body.assignedPrograms) && body.assignedPrograms.length > 0
        ? body.assignedPrograms
        : computeAssignedPrograms({
            ...body,
            needs,
            hasCaregiverBurnout: bool(body.hasCaregiverBurnout),
            hasSexualViolenceIndicator: bool(body.hasSexualViolenceIndicator),
            hasTeenPregnancy: bool(body.hasTeenPregnancy),
            hasChildMalnutrition: bool(body.hasChildMalnutrition),
            knowsRightsAndRoutes: bool(body.knowsRightsAndRoutes),
            hasMedidaProteccion: bool(body.hasMedidaProteccion),
            interestInTraining: bool(body.interestInTraining),
            interestedPrograms: Array.isArray(body.interestedPrograms) ? body.interestedPrograms : []
          }),
      consentGranted: true,
      minorImageConsent: bool(body.minorImageConsent),
      priority,
    };

    try {
      const db = await connectToDatabase();
      if (db.connection.readyState !== 1) throw new Error('MongoDB no disponible');
      await CommunitySurvey.create(payload);
    } catch (err) {
      console.error('[community-surveys] Error al guardar:', err);
      return NextResponse.json(
        { success: false, message: 'No hay conexión con la base de datos. Verifica la red e inténtalo de nuevo.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, surveyCode, priority });
  } catch {
    return NextResponse.json(
      { success: false, message: 'No fue posible procesar la caracterización. Intenta nuevamente.' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!readSurveyAnalysisSession()) {
      return NextResponse.json({ success: false, message: 'Acción no autorizada.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const surveyCode = searchParams.get('surveyCode');

    if (!id && !surveyCode) {
      return NextResponse.json(
        { success: false, message: 'Se requiere el ID o código de la ficha a eliminar.' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (db.connection.readyState !== 1) throw new Error('MongoDB no disponible');

    let result = null;
    if (id && id.length === 24) {
      result = await CommunitySurvey.findByIdAndDelete(id);
    } else if (surveyCode) {
      result = await CommunitySurvey.findOneAndDelete({ surveyCode });
    } else if (id) {
      result = await CommunitySurvey.findOneAndDelete({ _id: id });
    }

    return NextResponse.json({
      success: true,
      message: 'Ficha censal eliminada correctamente.',
      deleted: Boolean(result),
    });
  } catch (err) {
    console.error('[community-surveys DELETE] Error al eliminar:', err);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar la ficha del sistema.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!readSurveyAnalysisSession()) {
      return NextResponse.json({ success: false, message: 'Accion no autorizada.' }, { status: 403 });
    }

    const body = await request.json();
    const id = str(body.id, 30);
    const input = body.updates && typeof body.updates === 'object' ? body.updates as Record<string, unknown> : null;
    if (!id || !input) {
      return NextResponse.json({ success: false, message: 'Se requiere una ficha y datos para actualizar.' }, { status: 400 });
    }

    const householdSize = num(input.householdSize, 1, 50);
    const members = Array.isArray(input.householdMembers)
      ? input.householdMembers.filter((member: unknown) => member && typeof member === 'object').map((member: Record<string, unknown>) => ({
          fullName: str(member.fullName, 120), age: num(member.age, 0, 120), relationship: str(member.relationship, 60),
          documentType: ALLOWED_DOC_TYPES.has(String(member.documentType)) ? String(member.documentType) : 'CC', documentNumber: str(member.documentNumber, 30),
        })).filter((member: { fullName: string }) => member.fullName.length > 0)
      : [];
    const updates = {
      barrio: str(input.barrio, 100) || 'SIN_BARRIO', fieldZone: str(input.fieldZone, 80), contactPhone: str(input.contactPhone, 20),
      householdSize, minorCount: num(input.minorCount, 0, householdSize), householdMembers: members,
      priority: ['NORMAL', 'PRIORITARIA', 'INMEDIATA'].includes(str(input.priority, 20)) ? str(input.priority, 20) : 'NORMAL',
      authorizedRecontact: bool(input.authorizedRecontact),
      needs: Array.isArray(input.needs) ? input.needs.filter((need: unknown) => typeof need === 'string' && ALLOWED_NEEDS.has(need)) : [],
    };

    const db = await connectToDatabase();
    if (db.connection.readyState !== 1) throw new Error('MongoDB unavailable');
    const survey = await CommunitySurvey.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
    if (!survey) return NextResponse.json({ success: false, message: 'La ficha ya no existe.' }, { status: 404 });
    return NextResponse.json({ success: true, survey });
  } catch (err) {
    console.error('[community-surveys PATCH] Error:', err);
    return NextResponse.json({ success: false, message: 'No fue posible actualizar la ficha.' }, { status: 500 });
  }
}
