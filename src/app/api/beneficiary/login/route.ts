import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BeneficiaryPortalAccess from '@/lib/models/BeneficiaryPortalAccess';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { documentNumber, password } = await req.json();

    if (!documentNumber || !password) {
      return NextResponse.json(
        { success: false, error: 'Cédula y contraseña requeridas' },
        { status: 400 }
      );
    }

    const access = await BeneficiaryPortalAccess.findOne({ documentNumber });

    if (!access || access.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        patientId: access.patientId,
        documentNumber: access.documentNumber,
        patientName: access.patientName,
        patientCode: access.patientCode,
      },
    });
  } catch (error: any) {
    console.error('Error en login de portal beneficiaria:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
