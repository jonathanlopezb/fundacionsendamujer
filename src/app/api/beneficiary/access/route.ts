import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BeneficiaryPortalAccess from '@/lib/models/BeneficiaryPortalAccess';
import { hashPassword, normalizeDocumentNumber } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { patientId, documentNumber, password, patientName, patientCode } = await req.json();

    if (!patientId || !documentNumber || !password || !patientName) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos para crear acceso al portal' },
        { status: 400 }
      );
    }

    // Crear o actualizar el registro de acceso al portal
    const cleanDocumentNumber = normalizeDocumentNumber(documentNumber);
    const access = await BeneficiaryPortalAccess.findOneAndUpdate(
      { patientId },
      {
        patientId,
        documentNumber: cleanDocumentNumber,
        passwordHash: await hashPassword(cleanDocumentNumber),
        patientName,
        patientCode,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Credenciales de portal asignadas para ${patientName}`,
      access: {
        patientId: access.patientId,
        documentNumber: access.documentNumber,
        patientName: access.patientName,
        patientCode: access.patientCode,
      },
    });
  } catch (error: any) {
    console.error('Error al guardar credenciales de portal:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const documentNumber = searchParams.get('documentNumber');

    if (!documentNumber) {
      return NextResponse.json(
        { success: false, error: 'Número de cédula requerido' },
        { status: 400 }
      );
    }

    const access = await BeneficiaryPortalAccess.findOne({ documentNumber: normalizeDocumentNumber(documentNumber) }).select('+passwordHash');

    if (!access) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      access: {
        patientId: access.patientId,
        documentNumber: access.documentNumber,
        patientName: access.patientName,
        patientCode: access.patientCode,
      },
    });
  } catch (error: any) {
    console.error('Error al consultar credenciales:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
