import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmCase, CrmPerson, CrmTask, getNextSequence } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'cases.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const user = auth.user;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const type = searchParams.get('type') || '';
    const onlyMine = searchParams.get('mine') === 'true';

    const query: Record<string, any> = {};

    // Filtro por rol / asignación (ABOGADO, PSICOLOGO, TRABAJADOR_SOCIAL solo ven sus casos asignados a menos que sean coordinadores o directiva)
    if (['TRABAJADOR_SOCIAL', 'PSICOLOGO', 'ABOGADO'].includes(user.role) || onlyMine) {
      query.responsibleUserId = user.userId;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }
    if (priority && priority !== 'ALL') {
      query.priority = priority;
    }
    if (type && type !== 'ALL') {
      query.type = type;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { caseNumber: regex },
        { openingReason: regex },
        { assessmentSummary: regex },
      ];
    }

    const cases = await CrmCase.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Enriquecer con datos de persona
    const personIds = Array.from(new Set(cases.map((c) => c.personId)));
    const people = await CrmPerson.find({ _id: { $in: personIds } })
      .select('firstName lastName code documentNumber protectedIdentity pseudonym phone')
      .lean();

    const peopleMap = new Map(people.map((p) => [p._id.toString(), p]));

    const enrichedCases = cases.map((c) => {
      const person = peopleMap.get(c.personId);
      return {
        ...c,
        personName: person
          ? person.protectedIdentity
            ? person.pseudonym || 'Identidad Protegida'
            : `${person.firstName} ${person.lastName}`
          : 'Persona no encontrada',
        personCode: person?.code || '',
        personPhone: person?.phone || '',
      };
    });

    return NextResponse.json({ cases: enrichedCases });
  } catch (error: any) {
    console.error('Error al consultar casos CRM:', error);
    return NextResponse.json({ error: 'Error al consultar casos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'cases.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      personId,
      householdId,
      programId,
      projectId,
      type,
      priority = 'MEDIUM',
      openingReason,
      assessmentSummary,
      responsibleUserId,
      responsibleUserName,
    } = body;

    if (!personId || !type || !openingReason) {
      return NextResponse.json(
        { error: 'Persona, tipo de atención y motivo de apertura son obligatorios' },
        { status: 400 }
      );
    }

    const caseNumber = await getNextSequence('case', 'CAS');

    const newCase = await CrmCase.create({
      caseNumber,
      personId,
      householdId,
      programId,
      projectId,
      type,
      priority,
      status: 'NEW',
      openingReason: openingReason.trim(),
      assessmentSummary: assessmentSummary?.trim(),
      responsibleUserId: responsibleUserId || auth.user.userId,
      responsibleUserName: responsibleUserName || auth.user.name,
      openedAt: new Date(),
      classification: 'RESTRICTED',
    });

    // Auto-generar tarea inicial de valoración para el profesional asignado
    const targetUserId = responsibleUserId || auth.user.userId;
    const targetUserName = responsibleUserName || auth.user.name;

    await CrmTask.create({
      title: `Valoración Inicial Caso ${caseNumber}`,
      description: `Realizar entrevista de valoración y plan de acompañamiento para el caso ${caseNumber} (${type}). Motivo: ${openingReason.slice(0, 100)}...`,
      assignedToUserId: targetUserId,
      assignedToName: targetUserName,
      createdByUserId: auth.user.userId,
      priority: priority === 'CRITICAL' ? 'URGENT' : priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
      relatedEntityType: 'CASE',
      relatedEntityId: newCase._id.toString(),
      status: 'TODO',
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_CASE',
      'CrmCase',
      newCase._id.toString(),
      { caseNumber: newCase.caseNumber, type: newCase.type, priority: newCase.priority, personId },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Caso aperturado exitosamente con tarea de valoración asignada',
      case: newCase,
    });
  } catch (error: any) {
    console.error('Error al registrar caso CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al registrar caso' }, { status: 500 });
  }
}
