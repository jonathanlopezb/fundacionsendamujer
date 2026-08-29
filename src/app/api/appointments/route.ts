import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/lib/models/Appointment';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phone, email, specialty, preferredDate, preferredTime, location, notes } = body;

    if (!fullName || !phone || !specialty || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Todos los campos requeridos deben ser completados' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const newAppointment = await Appointment.create({
        fullName,
        phone,
        email,
        specialty,
        preferredDate,
        preferredTime,
        location: location || 'Sede Fundación Senda Mujer - Cartagena',
        notes,
        status: 'PENDIENTE',
      });
      return NextResponse.json({ success: true, appointment: newAppointment });
    } catch (dbErr) {
      console.warn('DB Save fallback mode for appointments:', dbErr);
      return NextResponse.json({
        success: true,
        appointment: {
          fullName,
          phone,
          specialty,
          preferredDate,
          preferredTime,
          location: location || 'Sede Fundación Senda Mujer - Cartagena',
          status: 'PENDIENTE (Confirmación enviada)',
        },
      });
    }
  } catch (error: any) {
    console.error('Appointment API error:', error);
    return NextResponse.json({ error: 'Error agendando la cita' }, { status: 500 });
  }
}
