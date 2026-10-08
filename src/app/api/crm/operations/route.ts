import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmOperation, CrmAttendance, CrmPerson, getNextSequence } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'operations.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const operationId = searchParams.get('operationId');

    if (operationId) {
      const attendances = await CrmAttendance.find({ operationId }).sort({ checkInAt: -1 }).lean();
      const personIds = attendances.map((a) => a.personId);
      const people = await CrmPerson.find({ _id: { $in: personIds } }).select('firstName lastName code phone documentNumber').lean();
      const peopleMap = new Map(people.map((p) => [p._id.toString(), p]));

      const enriched = attendances.map((a) => ({
        ...a,
        personName: peopleMap.get(a.personId)
          ? `${peopleMap.get(a.personId)?.firstName} ${peopleMap.get(a.personId)?.lastName}`
          : 'Persona',
        personCode: peopleMap.get(a.personId)?.code || '',
        personPhone: peopleMap.get(a.personId)?.phone || '',
      }));

      return NextResponse.json({ attendances: enriched });
    }

    const operations = await CrmOperation.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({ operations });
  } catch (error: any) {
    console.error('Error al consultar operaciones CRM:', error);
    return NextResponse.json({ error: 'Error al consultar operaciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'operations.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();

    // Check if registering attendance
    if (body.actionType === 'attendance') {
      const { operationId, personId, method = 'MANUAL' } = body;
      if (!operationId || !personId) {
        return NextResponse.json({ error: 'Operación y persona requeridos' }, { status: 400 });
      }

      const existing = await CrmAttendance.findOne({ operationId, personId });
      if (existing) {
        return NextResponse.json({ error: 'La persona ya tiene asistencia registrada en esta jornada' }, { status: 409 });
      }

      const attendance = await CrmAttendance.create({
        operationId,
        personId,
        status: 'ATTENDED',
        checkInAt: new Date(),
        method,
        recordedBy: auth.user.name,
      });

      // Incrementar contador de asistentes reales
      await CrmOperation.findByIdAndUpdate(operationId, { $inc: { actualParticipants: 1 } });

      return NextResponse.json({
        success: true,
        message: 'Asistencia registrada exitosamente',
        attendance,
      });
    }

    // Creating a new operation
    const { name, type, projectId, programId, date, location, expectedParticipants, plannedBudget } = body;

    if (!name || !type || !date || !location) {
      return NextResponse.json({ error: 'Nombre, tipo, fecha y ubicación son requeridos' }, { status: 400 });
    }

    const operationNumber = await getNextSequence('operation', 'OP');

    const operation = await CrmOperation.create({
      operationNumber,
      name: name.trim(),
      type,
      projectId,
      programId,
      responsibleUserId: auth.user.userId,
      date: new Date(date),
      location: location.trim(),
      expectedParticipants: Number(expectedParticipants) || 0,
      actualParticipants: 0,
      plannedBudget: Number(plannedBudget) || 0,
      status: 'SCHEDULED',
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_OPERATION',
      'CrmOperation',
      operation._id.toString(),
      { operationNumber: operation.operationNumber, name: operation.name, type: operation.type },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Operación programada exitosamente',
      operation,
    });
  } catch (error: any) {
    console.error('Error al registrar operación CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar operación' }, { status: 500 });
  }
}
