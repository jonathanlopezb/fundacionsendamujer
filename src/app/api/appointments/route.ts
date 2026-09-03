import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';
import { isSuperAdminSession } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.adminAction === true && !isSuperAdminSession()) {
      return NextResponse.json({ success: false, error: 'Solo el SuperAdministrador puede asignar citas desde la consola.' }, { status: 403 });
    }
    const {
      fullName,
      patientName,
      professionalName,
      patientId,
      professionalId,
      beneficiaryId,
      phone,
      email,
      specialty,
      preferredDate,
      preferredTime,
      location,
      modality,
      notes,
    } = body;

    if (!fullName || !phone || !specialty || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Todos los campos requeridos deben ser completados' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const newAppointment = await Appointment.create({
        patientId: patientId || beneficiaryId || undefined,
        professionalId: professionalId || undefined,
        beneficiaryId: beneficiaryId || patientId || undefined,
        fullName,
        patientName: patientName || fullName,
        professionalName: professionalName || undefined,
        phone,
        email,
        specialty,
        preferredDate,
        preferredTime,
        location: location || 'Sede Fundación Senda Mujer - Cartagena',
        modality: modality || 'Presencial Sede Pie de la Popa',
        notes,
        status: 'PENDIENTE',
      });
      return NextResponse.json({ success: true, appointment: newAppointment });
    } catch (dbErr) {
      console.warn('DB Save fallback mode for appointments:', dbErr);
      return NextResponse.json({ success: false, error: 'No fue posible guardar la cita en MongoDB.' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Appointment API error:', error);
    return NextResponse.json({ error: 'Error agendando la cita' }, { status: 500 });
  }
}
