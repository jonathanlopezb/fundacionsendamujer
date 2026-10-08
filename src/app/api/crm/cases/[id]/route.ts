import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmCase,
  CrmPerson,
  CrmCaseNote,
  CrmFollowUp,
  CrmReferral,
  CrmTask,
} from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireCrmAuth(req, 'cases.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const caseDoc = await CrmCase.findById(params.id).lean();

    if (!caseDoc) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    const person = await CrmPerson.findById(caseDoc.personId).lean();

    // Consultar notas confidenciales del caso (auditando la lectura si es dato restringido)
    const notes = await CrmCaseNote.find({ caseId: caseDoc._id.toString() })
      .sort({ createdAt: -1 })
      .lean();

    // Consultar seguimientos y remisiones
    const [followUps, referrals, tasks] = await Promise.all([
      CrmFollowUp.find({ caseId: caseDoc._id.toString() }).sort({ dueDate: 1 }).lean(),
      CrmReferral.find({ caseId: caseDoc._id.toString() }).sort({ referredAt: -1 }).lean(),
      CrmTask.find({ relatedEntityType: 'CASE', relatedEntityId: caseDoc._id.toString() }).sort({ dueDate: 1 }).lean(),
    ]);

    // Registrar auditoría de lectura de caso restringido
    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'VIEW_CASE_CONFIDENTIAL',
      'CrmCase',
      caseDoc._id.toString(),
      { caseNumber: caseDoc.caseNumber, personId: caseDoc.personId },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      case: caseDoc,
      person,
      notes,
      followUps,
      referrals,
      tasks,
    });
  } catch (error: any) {
    console.error('Error al consultar caso CRM:', error);
    return NextResponse.json({ error: 'Error al consultar caso' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireCrmAuth(req, 'cases.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const caseDoc = await CrmCase.findById(params.id);

    if (!caseDoc) {
      return NextResponse.json({ error: 'Caso no encontrado' }, { status: 404 });
    }

    const { status, priority, assessmentSummary, responsibleUserId, responsibleUserName, closureReason, outcome } = body;

    // Validación de transición a cerrado
    if (status === 'CLOSED') {
      if (!auth.user.role || !['SUPER_ADMIN', 'DIRECTORA', 'COORDINADOR', 'TRABAJADOR_SOCIAL', 'PSICOLOGO', 'ABOGADO'].includes(auth.user.role)) {
        return NextResponse.json({ error: 'No tienes permiso para cerrar casos' }, { status: 403 });
      }
      if (!closureReason || !outcome) {
        return NextResponse.json(
          { error: 'Para cerrar el caso es obligatorio especificar el motivo de cierre y el resultado/impacto alcanzado.' },
          { status: 422 }
        );
      }
      caseDoc.status = 'CLOSED';
      caseDoc.closedAt = new Date();
      caseDoc.closureReason = closureReason.trim();
      caseDoc.outcome = outcome.trim();

      // Completar tareas abiertas de este caso
      await CrmTask.updateMany(
        { relatedEntityType: 'CASE', relatedEntityId: caseDoc._id.toString(), status: { $ne: 'COMPLETED' } },
        { status: 'COMPLETED', completedAt: new Date() }
      );
    } else if (status) {
      // Si se reabre o cambia de estado
      caseDoc.status = status;
      if (caseDoc.status !== 'CLOSED') {
        caseDoc.closedAt = undefined;
      }
    }

    if (priority) caseDoc.priority = priority;
    if (assessmentSummary !== undefined) caseDoc.assessmentSummary = assessmentSummary.trim();
    if (responsibleUserId) {
      caseDoc.responsibleUserId = responsibleUserId;
      caseDoc.responsibleUserName = responsibleUserName;
    }

    await caseDoc.save();

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'UPDATE_CASE_STATUS',
      'CrmCase',
      caseDoc._id.toString(),
      { caseNumber: caseDoc.caseNumber, newStatus: caseDoc.status, closureReason: caseDoc.closureReason },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Caso actualizado exitosamente',
      case: caseDoc,
    });
  } catch (error: any) {
    console.error('Error al actualizar caso CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar caso' }, { status: 500 });
  }
}
