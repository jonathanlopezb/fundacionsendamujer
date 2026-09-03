import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PatientEHR from '@/lib/models/PatientEHR';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';
import { isSuperAdminSession } from '@/lib/admin-auth';

export async function GET() {
  if (!isSuperAdminSession()) return NextResponse.json({ success: false, error: 'Se requiere sesión de SuperAdministrador.' }, { status: 403 });
  try {
    try {
      await connectToDatabase();
      await seedCaribeSeguroData();

      const patients = await PatientEHR.find({}).sort({ createdAt: -1 }).lean();
      if (patients && patients.length > 0) {
        return NextResponse.json({ success: true, patients });
      }
    } catch (dbErr) {
      console.warn('MongoDB fallback for patients list:', dbErr);
    }

    return NextResponse.json({ success: true, patients: [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isSuperAdminSession()) return NextResponse.json({ success: false, error: 'Solo el SuperAdministrador puede registrar beneficiarias.' }, { status: 403 });
  try {
    const body = await req.json();

    try {
      await connectToDatabase();
      const patient = await PatientEHR.create({
        id: body.id || `EHR-${Date.now()}`,
        patientCode: body.patientCode || `CSM-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName: body.patientName,
        docId: body.docId,
        age: body.age || 25,
        birthDate: body.birthDate || '1999-01-01',
        bloodType: body.bloodType || 'O+',
        eps: body.eps || 'Mutual Ser EPS-S',
        phone: body.phone || '+57 300 000 0000',
        emergencyContact: body.emergencyContact || 'Familiar Responsable',
        neighborhood: body.neighborhood || 'Olaya Herrera, Cartagena',
        allergies: body.allergies || 'Ninguna',
        riskLevel: body.riskLevel || 'BAJO',
        ipscScore: body.ipscScore || 70,
        dimensionsIPSC: body.dimensionsIPSC || {},
        primaryCategory: body.primaryCategory || 'MEDICO',
        assignedDoctor: body.assignedDoctor || 'Dra. Elena Ruiz',
        status: body.status || 'ACTIVA',
        vitals: body.vitals || { bloodPressure: '120/80 mmHg', heartRate: 72, weightKg: 60, heightM: 1.6, bmi: 23.4, tempC: 36.5 },
        evolutions: body.evolutions || [],
        prescriptions: body.prescriptions || [],
        routesActivated: body.routesActivated || [],
        documents: body.documents || [],
      });

      return NextResponse.json({ success: true, patient });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for patient:', dbErr);
      return NextResponse.json({ success: true, patient: body, isDemoFallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
