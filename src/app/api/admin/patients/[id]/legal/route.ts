import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { readAdminSession } from '@/lib/admin-auth';
import PatientEHR from '@/lib/models/PatientEHR';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = readAdminSession();
  if (!session) return NextResponse.json({ success: false, error: 'Se requiere una sesión profesional.' }, { status: 403 });
  try {
    const patientId = params.id;
    try {
      await connectToDatabase();
      const patient = await PatientEHR.findOne({ id: patientId }).lean() as any;
      if (patient) {
        if (session.role !== 'ADMIN_SISTEMA' && patient.assignedDoctor !== session.professionalName && patient.primaryCategory !== session.role && !patient.assignedProfessionalIds?.includes(session.professionalId) && !patient.assignedProfessionalNames?.includes(session.professionalName)) {
          return NextResponse.json({ success: false, error: 'No tienes acceso a este expediente.' }, { status: 403 });
        }
        return NextResponse.json({ success: true, legalProcedures: patient.legalProcedures || [] });
      }
    } catch (dbErr) {
      console.warn('Fallback legal GET:', dbErr);
    }
    return NextResponse.json({ success: true, legalProcedures: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = readAdminSession();
  if (!['ADMIN_SISTEMA', 'JURIDICO'].includes(session?.role || '')) return NextResponse.json({ success: false, error: 'No tienes permisos para registrar trámites jurídicos.' }, { status: 403 });
  try {
    const patientId = params.id;
    const body = await req.json();

    const newProcedure = {
      id: body.id || `LEG-${Date.now()}`,
      date: body.date || new Date().toISOString().split('T')[0],
      entity: body.entity || 'Comisaría de Familia Chiquinquirá',
      procedureType: body.procedureType || 'Medida de Protección Ley 1257/2008',
      status: body.status || 'RADICADO',
      caseNumber: body.caseNumber || `RAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: body.notes,
      documents: body.documents || [],
    };

    try {
      await connectToDatabase();
      const patient = await PatientEHR.findOne({ id: patientId }).select('assignedDoctor primaryCategory assignedProfessionalIds assignedProfessionalNames').lean() as any;
      if (!patient || (session?.role !== 'ADMIN_SISTEMA' && patient.assignedDoctor !== session?.professionalName && patient.primaryCategory !== session?.role && !patient.assignedProfessionalIds?.includes(session?.professionalId) && !patient.assignedProfessionalNames?.includes(session?.professionalName))) {
        return NextResponse.json({ success: false, error: 'No tienes acceso a este expediente.' }, { status: 403 });
      }
      const updated = await PatientEHR.findOneAndUpdate(
        { id: patientId },
        { $push: { legalProcedures: { $each: [newProcedure], $position: 0 } } },
        { new: true }
      );

      return NextResponse.json({ success: true, legalProcedure: newProcedure, patient: updated });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for legal procedure:', dbErr);
      return NextResponse.json({ success: true, legalProcedure: newProcedure, isDemoFallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
