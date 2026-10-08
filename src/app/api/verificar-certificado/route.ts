import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Schema, model, models } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim();
    const hash = searchParams.get('hash')?.trim();

    if (!code && !hash) {
      return NextResponse.json(
        { error: 'Debe proporcionar el consecutivo o el código de verificación del certificado' },
        { status: 400 }
      );
    }

    // Consulta flexible en la colección de certificados tributarios
    const CrmTaxCertificate = models.CrmTaxCertificate || model('CrmTaxCertificate', new Schema({}, { strict: false }));

    const query: Record<string, unknown> = {};
    if (code) query.code = code.toUpperCase();
    if (hash) query.verificationCode = hash.toUpperCase();

    const certificate = await CrmTaxCertificate.findOne(query).lean() as any;

    if (!certificate) {
      return NextResponse.json(
        { valid: false, error: 'No se encontró ningún certificado tributario registrado con los datos suministrados.' },
        { status: 404 }
      );
    }

    // Retornamos únicamente los datos de verificación pública (respetando Habeas Data)
    return NextResponse.json({
      valid: certificate.status === 'EMITIDO',
      certificate: {
        code: certificate.code,
        fiscalYear: certificate.fiscalYear,
        issueDate: certificate.issueDate,
        status: certificate.status,
        voidReason: certificate.voidReason,
        voidedAt: certificate.voidedAt,
        
        // Emisor
        issuerName: certificate.issuerName || 'FUNDACIÓN SENDA MUJER',
        issuerNit: certificate.issuerNit || '901.789.456-1',
        issuerRteStatus: certificate.issuerRteStatus,
        issuerLegalRep: certificate.issuerLegalRep,
        issuerAccountant: certificate.issuerAccountant,
        issuerAccountantTp: certificate.issuerAccountantTp,

        // Donante
        donorName: certificate.donorName,
        donorDocumentType: certificate.donorDocumentType,
        donorDocumentNumber: certificate.donorDocumentNumber,
        donorCity: certificate.donorCity,

        // Donación
        donationDate: certificate.donationDate,
        donationType: certificate.donationType,
        donationMethod: certificate.donationMethod,
        amount: certificate.amount,
        currency: certificate.currency || 'COP',
        amountInWords: certificate.amountInWords,
        destinationProgram: certificate.destinationProgram,
        
        // Legal DIAN
        statuteArticles: certificate.statuteArticles,
        meritoriousActivity: certificate.meritoriousActivity,
        verificationCode: certificate.verificationCode,
      },
    });
  } catch (error: any) {
    console.error('Error en verificación de certificado:', error);
    return NextResponse.json(
      { error: 'Error al consultar la base de datos de verificación' },
      { status: 500 }
    );
  }
}
