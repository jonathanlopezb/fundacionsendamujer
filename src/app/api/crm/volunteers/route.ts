import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmVolunteer, CrmVolunteerShift, CrmPerson } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'volunteers.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'volunteers'; // 'volunteers' | 'shifts'

    if (view === 'shifts') {
      const shifts = await CrmVolunteerShift.find({}).sort({ date: -1 }).lean();
      return NextResponse.json({ shifts });
    }

    const volunteers = await CrmVolunteer.find({}).sort({ hoursTotal: -1 }).lean();
    const personIds = volunteers.map((v) => v.personId);
    const people = await CrmPerson.find({ _id: { $in: personIds } }).select('firstName lastName code phone email').lean();
    const peopleMap = new Map(people.map((p) => [p._id.toString(), p]));

    const enriched = volunteers.map((v) => ({
      ...v,
      personName: peopleMap.get(v.personId) ? `${peopleMap.get(v.personId)?.firstName} ${peopleMap.get(v.personId)?.lastName}` : 'Voluntaria',
      personCode: peopleMap.get(v.personId)?.code || '',
      personPhone: peopleMap.get(v.personId)?.phone || '',
      personEmail: peopleMap.get(v.personId)?.email || '',
    }));

    return NextResponse.json({ volunteers: enriched });
  } catch (error: any) {
    console.error('Error al consultar voluntariado CRM:', error);
    return NextResponse.json({ error: 'Error al consultar voluntariado' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'volunteers.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const actionType = body.actionType || 'volunteer';

    if (actionType === 'shift') {
      const { volunteerId, volunteerName, operationId, hours, activity, evaluation } = body;
      if (!volunteerId || !hours || !activity) {
        return NextResponse.json({ error: 'Voluntario, horas y actividad son obligatorios' }, { status: 400 });
      }

      const numericHours = Number(hours);
      const shift = await CrmVolunteerShift.create({
        volunteerId,
        volunteerName: volunteerName?.trim(),
        operationId,
        date: new Date(),
        hours: numericHours,
        activity: activity.trim(),
        evaluation: evaluation?.trim(),
      });

      // Incrementar horas acumuladas del voluntario
      await CrmVolunteer.findByIdAndUpdate(volunteerId, { $inc: { hoursTotal: numericHours } });

      return NextResponse.json({ success: true, message: 'Turno de voluntariado registrado exitosamente', shift });
    }

    // Default: Registrar Voluntario
    const { personId, profession, skills = [], availability = 'Fines de semana' } = body;
    if (!personId || !profession) {
      return NextResponse.json({ error: 'Persona y profesión son requeridos' }, { status: 400 });
    }

    const volunteer = await CrmVolunteer.create({
      personId,
      profession: profession.trim(),
      skills: Array.isArray(skills) ? skills : [skills],
      availability: availability.trim(),
      hoursTotal: 0,
      status: 'ACTIVE',
    });

    return NextResponse.json({ success: true, message: 'Voluntario registrado exitosamente', volunteer });
  } catch (error: any) {
    console.error('Error al registrar voluntario CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar voluntariado' }, { status: 500 });
  }
}
