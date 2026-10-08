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

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search    = searchParams.get('q') ?? '';
    const specialty = searchParams.get('specialty') ?? '';
    const status    = searchParams.get('status') ?? '';
    const modality  = searchParams.get('modality') ?? '';
    const limit     = Math.min(200, parseInt(searchParams.get('limit') ?? '100'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (specialty) filter.specialty = specialty;
    if (modality)  filter.modality  = { $regex: modality, $options: 'i' };
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

    // Live counts by reviewStatus
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

    // ── CREATE ────────────────────────────────────────────────────────
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
        requestSource: 'ADMINISTRATIVA',
        reviewStatus: 'CONFIRMADA',
        status: 'CONFIRMADA',
      });
      await CrmAuditLog.create({
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_CREATED_CRM', entity: 'Appointment',
        entityId: newAppointment._id.toString(),
        details: { fullName, specialty, phone },
      });
      return NextResponse.json({ success: true, appointment: newAppointment });
    }

    // ── STATUS UPDATE (confirm / cancel / attend) ─────────────────────
    if (action === 'STATUS_UPDATE') {
      if (!appointmentId) return NextResponse.json({ error: 'appointmentId requerido' }, { status: 400 });
      const { newStatus, note } = body;
      const updated = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          $set: {
            reviewStatus: newStatus,
            ...(note && { notes: note }),
          },
        },
        { new: true }
      );
      if (!updated) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
      await CrmAuditLog.create({
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_STATUS_UPDATED', entity: 'Appointment',
        entityId: appointmentId, details: { newStatus },
      });
      return NextResponse.json({ success: true, appointment: updated });
    }

    // ── RESCHEDULE (reprogramar fecha/hora/modalidad/lugar) ───────────
    if (action === 'RESCHEDULE') {
      if (!appointmentId) return NextResponse.json({ error: 'appointmentId requerido' }, { status: 400 });
      const { preferredDate, preferredTime, modality, location, notes } = body;
      if (!preferredDate || !preferredTime) {
        return NextResponse.json({ error: 'Fecha y hora son requeridas para reprogramar' }, { status: 400 });
      }
      const updated = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          $set: {
            preferredDate,
            preferredTime,
            ...(modality  && { modality }),
            ...(location  && { location }),
            ...(notes     && { notes }),
            reviewStatus: 'CONFIRMADA',
          },
        },
        { new: true }
      );
      if (!updated) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
      await CrmAuditLog.create({
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_RESCHEDULED', entity: 'Appointment',
        entityId: appointmentId,
        details: { preferredDate, preferredTime, modality, location },
      });
      return NextResponse.json({ success: true, appointment: updated });
    }

    // ── EDIT (editar datos básicos: modalidad, lugar, notas) ──────────
    if (action === 'EDIT') {
      if (!appointmentId) return NextResponse.json({ error: 'appointmentId requerido' }, { status: 400 });
      const { modality, location, notes, preferredDate, preferredTime, specialty } = body;
      const updated = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          $set: {
            ...(modality     !== undefined && { modality }),
            ...(location     !== undefined && { location }),
            ...(notes        !== undefined && { notes }),
            ...(preferredDate !== undefined && { preferredDate }),
            ...(preferredTime !== undefined && { preferredTime }),
            ...(specialty    !== undefined && { specialty }),
          },
        },
        { new: true }
      );
      if (!updated) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
      await CrmAuditLog.create({
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_EDITED', entity: 'Appointment',
        entityId: appointmentId,
        details: { modality, location, preferredDate, preferredTime },
      });
      return NextResponse.json({ success: true, appointment: updated });
    }

    // ── DELETE (solo si reviewStatus === 'CANCELADA') ─────────────────
    if (action === 'DELETE') {
      if (!appointmentId) return NextResponse.json({ error: 'appointmentId requerido' }, { status: 400 });
      const appt = await Appointment.findById(appointmentId);
      if (!appt) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
      if (appt.reviewStatus !== 'CANCELADA') {
        return NextResponse.json(
          { error: 'Solo se pueden eliminar citas con estado CANCELADA' },
          { status: 403 }
        );
      }
      await Appointment.findByIdAndDelete(appointmentId);
      await CrmAuditLog.create({
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_DELETED', entity: 'Appointment',
        entityId: appointmentId,
        details: { fullName: appt.fullName },
      });
      return NextResponse.json({ success: true });
    }

    // ── CONVERT TO CASE ───────────────────────────────────────────────
    if (action === 'CONVERT_TO_CASE') {
      const appt = await Appointment.findById(appointmentId);
      if (!appt) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });

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
        userId: user.userId, userName: user.name, userRole: user.role,
        action: 'APPOINTMENT_CONVERTED_TO_CASE', entity: 'CrmCase',
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
