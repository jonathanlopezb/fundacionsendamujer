import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BeneficiaryPortalAccess from '@/lib/models/BeneficiaryPortalAccess';
import { hashPassword, normalizeDocumentNumber, verifyPassword } from '@/lib/password';

export async function POST(req: NextRequest) {
  try {
    const { documentNumber, currentPassword, newPassword } = await req.json();
    const cleanDocumentNumber = normalizeDocumentNumber(documentNumber || '');
    if (!cleanDocumentNumber || !currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Cédula, contraseña actual y una nueva contraseña de mínimo 6 caracteres son requeridas.' }, { status: 400 });
    }

    await connectToDatabase();
    const access = await BeneficiaryPortalAccess.findOne({ documentNumber: cleanDocumentNumber }).select('+passwordHash +password');
    const validCurrentPassword = access?.passwordHash
      ? await verifyPassword(currentPassword, access.passwordHash)
      : access?.password === cleanDocumentNumber && normalizeDocumentNumber(currentPassword) === cleanDocumentNumber;

    if (!access || !validCurrentPassword) return NextResponse.json({ success: false, error: 'La contraseña actual es incorrecta.' }, { status: 401 });
    access.passwordHash = await hashPassword(newPassword);
    access.password = undefined;
    await access.save();
    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error: any) {
    console.error('Error al cambiar contraseña de beneficiaria:', error);
    return NextResponse.json({ success: false, error: 'No fue posible actualizar la contraseña.' }, { status: 500 });
  }
}
