import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAuth } from '@/lib/crm/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';
import {
  CrmPerson,
  CrmCase,
  getNextSequence,
  CrmAuditLog,
} from '@/lib/crm/models';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;
  const { user } = auth;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search    = searchParams.get('q') || '';
    const specialty = searchParams.get('specialty') || '';
    const status    = searchParams.get('status') || '';
    const limit     = Math.min(200, parseInt(searchParams.get('limit') ?? '100'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (specialty) filter.specialty = specialty;
    if (status) {
      filter.$or = [{ reviewStatus: status }, { status }];
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { fullName: regex },
        { patientName: regex },
        { phone: regex },
        { email: regex },
        { specialty: regex },
      ];
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const total = await Appointment.countDocuments(filter);

    // Count by reviewStatus
    const allForCounts = await Appointment.find({}).select('reviewStatus status').lean();
    const counts = {
      NUEVA:      allForCounts.filter((a) => (a as { reviewStatus?: string }).reviewStatus === 'NUEVA').length,
      GESTIONADA: allForCounts.filter((a) => (a as { reviewStatus?: string }).reviewStatus === 'GESTIONADA').length,
      CONFIRMADA: allForCounts.filter((a) => (a as { reviewStatus?: string }).reviewStatus === 'CONFIRMADA').length,
      CANCELADA:  allForCounts.filter((a) => (a as { reviewStatus?: string }).reviewStatus === 'CANCELADA').length,
    };

    return NextResponse.json({ appointments, total, counts });
  } catch (error) {
    console.error('Error al obtener citas en CRM:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;
  const { user } = auth;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, appointmentId } = body;

    if (action === 'CREATE') {
      const { fullName, phone, email, specialty, preferredDate, preferredTime, location, modality, notes } = body;

      if (!fullName || !phone || !specialty) {
        return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
      }

      const newAppointment = await Appointment.create({
        fullName,
        patientName: fullName,
        phone,
        email,
        specialty,
        preferredDate: preferredDate || new Date().toISOString().slice(0, 10),
        preferredTime: preferredTime || '09:00 AM',
        location: location || 'Sede Fundación Senda Mujer',
        modality: modality || 'Presencial',
        notes,
        requestSource: 'CRM_ADMINISTRATIVO',
        reviewStatus: 'CONFIRMADA',
        status: 'CONFIRMADA',
      });

      await CrmAuditLog.create({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'APPOINTMENT_CREATED_CRM',
        entity: 'Appointment',
        entityId: newAppointment._id.toString(),
        details: { fullName, specialty, phone },
      });

      return NextResponse.json({ success: true, appointment: newAppointment });
    }

    if (action === 'STATUS_UPDATE') {
      const { newStatus, note } = body;
      const updated = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          $set: {
            reviewStatus: newStatus,
            ...(note && { notes: note }),
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      await CrmAuditLog.create({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'APPOINTMENT_STATUS_UPDATED',
        entity: 'Appointment',
        entityId: appointmentId,
        details: { newStatus },
      });

      return NextResponse.json({ success: true, appointment: updated });
    }

    if (action === 'CONVERT_TO_CASE') {
      const appt = await Appointment.findById(appointmentId);
      if (!appt) {
        return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
      }

      // Buscar o crear persona
      let person = await CrmPerson.findOne({
        $or: [
          { phone: appt.phone },
          ...(appt.email ? [{ email: appt.email }] : []),
        ],
      });

      if (!person) {
        const code = await getNextSequence('PERSON', 'PER');
        const names = (appt.fullName || appt.patientName || 'Participante').split(' ');
        person = await CrmPerson.create({
          code,
          firstName: names[0] || 'Participante',
          lastName: names.slice(1).join(' ') || 'Senda',
          documentType: 'CC',
          documentNumber: 'PENDIENTE',
          documentNumberHash: `TEMP_${Date.now()}`,
          phone: appt.phone,
          email: appt.email,
          roles: ['BENEFICIARY'],
          consentHabeasData: true,
          status: 'ACTIVE',
        });
      }

      const caseNumber = await getNextSequence('CASE', 'CAS');
      const caseType =
        (appt.specialty || '').toLowerCase().includes('jurid') ? 'LEGAL' :
        (appt.specialty || '').toLowerCase().includes('psicol') ? 'PSYCHOSOCIAL' : 'SOCIAL';

      const newCase = await CrmCase.create({
        caseNumber,
        personId: person._id.toString(),
        type: caseType,
        priority: 'HIGH',
        status: 'NEW',
        openingReason: `Cita agendada: ${appt.specialty} (${appt.preferredDate} ${appt.preferredTime}). ${appt.notes || ''}`,
        responsibleUserId: user.userId,
        responsibleUserName: user.name,
        openedAt: new Date(),
      });

      appt.reviewStatus = 'GESTIONADA';
      await appt.save();

      await CrmAuditLog.create({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'APPOINTMENT_CONVERTED_TO_CASE',
        entity: 'CrmCase',
        entityId: newCase._id.toString(),
        details: { appointmentId, caseNumber, personId: person._id.toString() },
      });

      return NextResponse.json({ success: true, caseId: newCase._id, personId: person._id });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error al procesar acción de cita:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
