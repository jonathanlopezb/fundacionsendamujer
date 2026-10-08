import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmPerson,
  CrmCase,
  CrmProgramEnrollment,
  CrmAidDelivery,
  CrmAttendance,
} from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireCrmAuth(req, 'people.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const person = await CrmPerson.findById(params.id).lean();

    if (!person) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 });
    }

    // Consultar casos vinculados
    const cases = await CrmCase.find({ personId: person._id.toString() })
      .sort({ createdAt: -1 })
      .lean();

    // Consultar inscripciones a programas (CAM/THEMIS)
    const enrollments = await CrmProgramEnrollment.find({ personId: person._id.toString() })
      .sort({ enrolledAt: -1 })
      .lean();

    // Consultar entregas de ayuda
    const aidDeliveries = await CrmAidDelivery.find({ personId: person._id.toString() })
      .sort({ deliveryDate: -1 })
      .lean();

    // Consultar asistencias a operaciones
    const attendances = await CrmAttendance.find({ personId: person._id.toString() })
      .sort({ checkInAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      person,
      cases,
      enrollments,
      aidDeliveries,
      attendances,
    });
  } catch (error: any) {
    console.error('Error al consultar ficha 360 de persona CRM:', error);
    return NextResponse.json({ error: 'Error al consultar persona' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireCrmAuth(req, 'people.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();

    const person = await CrmPerson.findById(params.id);
    if (!person) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 });
    }

    if (body.firstName) person.firstName = body.firstName.trim();
    if (body.lastName) person.lastName = body.lastName.trim();
    if (body.phone !== undefined) person.phone = body.phone?.trim();
    if (body.email !== undefined) person.email = body.email?.trim()?.toLowerCase();
    if (body.address) person.address = { ...person.address, ...body.address };
    if (body.occupation !== undefined) person.occupation = body.occupation?.trim();
    if (body.educationLevel !== undefined) person.educationLevel = body.educationLevel?.trim();
    if (body.roles) person.roles = body.roles;
    if (body.protectedIdentity !== undefined) {
      person.protectedIdentity = Boolean(body.protectedIdentity);
      person.classification = person.protectedIdentity ? 'RESTRICTED' : 'CONFIDENTIAL';
    }
    if (body.pseudonym !== undefined) person.pseudonym = body.pseudonym?.trim();
    if (body.status) person.status = body.status;

    await person.save();

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'UPDATE_PERSON',
      'CrmPerson',
      person._id.toString(),
      { code: person.code, name: `${person.firstName} ${person.lastName}` },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Ficha de persona actualizada exitosamente',
      person,
    });
  } catch (error: any) {
    console.error('Error al actualizar persona CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar persona' }, { status: 500 });
  }
}
