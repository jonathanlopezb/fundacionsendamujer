import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BeneficiaryPortalAccess from '@/lib/models/BeneficiaryPortalAccess';
import { hashPassword, normalizeDocumentNumber, verifyPassword } from '@/lib/password';

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

    const cleanDocumentNumber = normalizeDocumentNumber(documentNumber);
    const access = await BeneficiaryPortalAccess.findOne({
      $or: [{ documentNumber: cleanDocumentNumber }, { documentNumber: documentNumber.trim() }],
    }).select('+passwordHash +password');

    const validPassword = access?.passwordHash
      ? await verifyPassword(password, access.passwordHash)
      : access?.password === cleanDocumentNumber && normalizeDocumentNumber(password) === cleanDocumentNumber;

    if (!access || !validPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    if (!access.passwordHash) {
      access.passwordHash = await hashPassword(cleanDocumentNumber);
      access.documentNumber = cleanDocumentNumber;
      access.password = undefined;
      await access.save();
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
