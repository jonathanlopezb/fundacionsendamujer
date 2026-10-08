import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmProgram,
  CrmProject,
  CrmProgramEnrollment,
  CrmPerson,
  getNextSequence,
} from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'programs.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'programs'; // 'programs' | 'projects' | 'enrollments'

    if (view === 'projects') {
      const projects = await CrmProject.find({}).sort({ startDate: -1 }).lean();
      return NextResponse.json({ projects });
    }

    if (view === 'enrollments') {
      const enrollments = await CrmProgramEnrollment.find({}).sort({ enrolledAt: -1 }).lean();
      const personIds = Array.from(new Set(enrollments.map((e) => e.personId)));
      const people = await CrmPerson.find({ _id: { $in: personIds } })
        .select('firstName lastName code phone documentNumber')
        .lean();
      const peopleMap = new Map(people.map((p) => [p._id.toString(), p]));

      const enriched = enrollments.map((e) => ({
        ...e,
        personName: peopleMap.get(e.personId)
          ? `${peopleMap.get(e.personId)?.firstName} ${peopleMap.get(e.personId)?.lastName}`
          : 'Persona',
        personCode: peopleMap.get(e.personId)?.code || '',
        personPhone: peopleMap.get(e.personId)?.phone || '',
      }));

      return NextResponse.json({ enrollments: enriched });
    }

    // Default: Programas
    const programs = await CrmProgram.find({}).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ programs });
  } catch (error: any) {
    console.error('Error al consultar programas CRM:', error);
    return NextResponse.json({ error: 'Error al consultar programas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'programs.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const type = body.actionType || 'enrollment'; // 'program' | 'project' | 'enrollment'

    if (type === 'enrollment') {
      const { personId, programId, cohortId, productiveLine, notes } = body;
      if (!personId || !programId) {
        return NextResponse.json({ error: 'Persona y Programa son obligatorios' }, { status: 400 });
      }

      const newEnrollment = await CrmProgramEnrollment.create({
        personId,
        programId,
        cohortId: cohortId?.trim(),
        productiveLine: productiveLine?.trim() || 'Costura y Confección',
        status: 'ENROLLED',
        enrolledAt: new Date(),
        notes: notes?.trim(),
      });

      await logCrmAudit(
        { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
        'ENROLL_PERSON_PROGRAM',
        'CrmProgramEnrollment',
        newEnrollment._id.toString(),
        { personId, programId, productiveLine },
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      );

      return NextResponse.json({
        success: true,
        message: 'Inscripción a programa registrada exitosamente',
        enrollment: newEnrollment,
      });
    }

    if (type === 'project') {
      const { name, description, programId, startDate, endDate, location, allocatedBudget, currency } = body;
      if (!name || !startDate) {
        return NextResponse.json({ error: 'Nombre y fecha de inicio son requeridos' }, { status: 400 });
      }

      const projectCode = await getNextSequence('project', 'PRJ');
      const newProject = await CrmProject.create({
        projectCode,
        name: name.trim(),
        description: description?.trim() || '',
        programId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        location: location?.trim() || 'Cartagena',
        allocatedBudget: Number(allocatedBudget) || 0,
        currency: currency || 'COP',
        responsibleUserId: auth.user.userId,
        status: 'ACTIVE',
      });

      return NextResponse.json({
        success: true,
        message: 'Proyecto creado exitosamente',
        project: newProject,
      });
    }

    if (type === 'program') {
      const { code, name, description, objectives, targetPopulation } = body;
      if (!code || !name || !description) {
        return NextResponse.json({ error: 'Código, nombre y descripción son requeridos' }, { status: 400 });
      }

      const newProgram = await CrmProgram.create({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        objectives: Array.isArray(objectives) ? objectives : [objectives],
        targetPopulation: targetPopulation?.trim(),
        responsibleUserId: auth.user.userId,
        status: 'ACTIVE',
      });

      return NextResponse.json({
        success: true,
        message: 'Programa registrado exitosamente',
        program: newProgram,
      });
    }

    return NextResponse.json({ error: 'Tipo de acción no reconocido' }, { status: 400 });
  } catch (error: any) {
    console.error('Error al crear registro en programas CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar solicitud' }, { status: 500 });
  }
}
