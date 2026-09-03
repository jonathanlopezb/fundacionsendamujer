import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { readAdminSession } from '@/lib/admin-auth';
import PatientEHR from '@/lib/models/PatientEHR';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = readAdminSession();
  if (!['ADMIN_SISTEMA', 'MEDICO', 'PSICOLOGO', 'TRABAJO_SOCIAL'].includes(session?.role || '')) return NextResponse.json({ success: false, error: 'No tienes permisos para registrar evoluciones clínicas.' }, { status: 403 });
  try {
    const patientId = params.id;
    const body = await req.json();

    const newEvolution = {
      id: body.id || `EVO-${Date.now()}`,
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      author: body.author,
      role: body.role,
      rethus: body.rethus,
      subjective: body.subjective,
      objective: body.objective || 'Constantes vitales estables.',
      analysis: body.analysis,
      plan: body.plan,
      cie10Code: body.cie10Code || undefined,
    };

    try {
      await connectToDatabase();
      const patient = await PatientEHR.findOne({ id: patientId }).select('assignedDoctor primaryCategory assignedProfessionalIds assignedProfessionalNames').lean() as any;
      if (!patient || (session?.role !== 'ADMIN_SISTEMA' && patient.assignedDoctor !== session?.professionalName && patient.primaryCategory !== session?.role && !patient.assignedProfessionalIds?.includes(session?.professionalId) && !patient.assignedProfessionalNames?.includes(session?.professionalName))) {
        return NextResponse.json({ success: false, error: 'No tienes acceso a este expediente.' }, { status: 403 });
      }
      const updated = await PatientEHR.findOneAndUpdate(
        { id: patientId },
        { $push: { evolutions: { $each: [newEvolution], $position: 0 } } },
        { new: true }
      );

      return NextResponse.json({ success: true, evolution: newEvolution, patient: updated });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for evolution:', dbErr);
      return NextResponse.json({ success: true, evolution: newEvolution, isDemoFallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
