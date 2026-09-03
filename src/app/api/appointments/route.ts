import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';
import PatientEHR from '@/lib/models/PatientEHR';
import { isSuperAdminSession } from '@/lib/admin-auth';
import mongoose from 'mongoose';

export async function GET() {
  if (!isSuperAdminSession()) return NextResponse.json({ success: false, error: 'Solo el SuperAdministrador puede consultar el calendario administrativo.' }, { status: 403 });
  try {
    await connectToDatabase();
    const appointments = await Appointment.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error('Appointment list error:', error);
    return NextResponse.json({ success: false, error: 'No fue posible consultar las citas en MongoDB.' }, { status: 500 });
  }
}

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
      patientCode,
      phone,
      email,
      specialty,
      preferredDate,
      preferredTime,
      location,
      modality,
      notes,
      requestSource,
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
        patientCode: patientCode || undefined,
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
        requestSource: requestSource || (body.adminAction ? 'ADMINISTRATIVA' : 'WEB_INSTITUCIONAL'),
        reviewStatus: body.adminAction ? 'GESTIONADA' : 'NUEVA',
        status: 'PENDIENTE',
      });
      if (body.adminAction === true && (patientId || beneficiaryId) && professionalId && professionalName) {
        await PatientEHR.findOneAndUpdate(
          { id: patientId || beneficiaryId },
          { $addToSet: { assignedProfessionalIds: professionalId, assignedProfessionalNames: professionalName } },
          { new: true }
        );
      }
      return NextResponse.json({ success: true, appointment: newAppointment });
    } catch (dbErr) {
      console.error('DB Save error for appointments:', dbErr);
      const message = dbErr instanceof Error ? dbErr.message : 'Error desconocido de MongoDB';
      return NextResponse.json({ success: false, error: `No fue posible guardar la cita: ${message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Appointment API error:', error);
    return NextResponse.json({ error: 'Error agendando la cita' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isSuperAdminSession()) return NextResponse.json({ success: false, error: 'Solo el SuperAdministrador puede eliminar solicitudes.' }, { status: 403 });
  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Solicitud requerida.' }, { status: 400 });
    await connectToDatabase();
    const filter = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ id }, { _id: id }] } : { id };
    const result = await Appointment.deleteOne(filter);
    if (!result.deletedCount) return NextResponse.json({ success: false, error: 'Solicitud no encontrada.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Appointment delete error:', error);
    return NextResponse.json({ success: false, error: 'No fue posible eliminar la solicitud.' }, { status: 500 });
  }
}
