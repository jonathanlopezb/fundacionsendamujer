import { NextRequest, NextResponse } from 'next/server';
import { requireCrmAuth } from '@/lib/crm/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Schema, model, models, Document } from 'mongoose';
import { createHash, randomBytes } from 'crypto';
import { getNextSequence, CrmAuditLog } from '@/lib/crm/models';

// ── Model Definition ────────────────────────────────────────────────
export interface ICrmTaxCertificate extends Document {
  code: string;                  // e.g. CERT-RTE-2026-00001
  fiscalYear: number;            // 2026
  issueDate: string;             // YYYY-MM-DD
  
  // Entidad Emisora
  issuerName: string;            // FUNDACIÓN SENDA MUJER
  issuerNit: string;             // 901.789.456-1
  issuerRteStatus: string;       // Entidad sin Ánimo de Lucro - Régimen Tributario Especial (RTE)
  issuerLegalRep: string;        // Nombre del Representante Legal
  issuerAccountant: string;      // Contador / Revisor Fiscal
  issuerAccountantTp: string;    // Tarjeta Profesional Contador
  
  // Donante
  donorId?: string;
  donorName: string;
  donorDocumentType: string;     // NIT, CC, CE, PASAPORTE
  donorDocumentNumber: string;
  donorAddress?: string;
  donorCity?: string;
  donorEmail?: string;
  donorPhone?: string;

  // Donación
  donationId?: string;
  donationType: 'DINERO' | 'ESPECIE' | 'SERVICIOS' | 'OTRO';
  donationMethod: 'TRANSFERENCIA' | 'CONSIGNACION' | 'PSE' | 'EFECTIVO' | 'BIENES';
  donationDate: string;
  amount: number;
  currency: string;
  amountInWords: string;
  destinationProgram: string;    // Destinación específica a actividad meritoria
  speciesDescription?: string;   // Descripción detallada si es en especie
  
  // Cláusulas Legales DIAN
  statuteArticles: string;       // Artículos 125-1 a 125-5 del E.T. y D.R. 2150/2017
  noConsiderationClause: boolean;// Certificación de no contraprestación
  meritoriousActivity: string;   // Actividad de interés social
  
  // Trazabilidad y Verificación
  verificationCode: string;      // Hash único de verificación
  qrPayload: string;
  status: 'EMITIDO' | 'ANULADO' | 'BORRADOR';
  voidReason?: string;
  voidedAt?: Date;
  voidedBy?: string;
  
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const CrmTaxCertificateSchema = new Schema<ICrmTaxCertificate>({
  code:                  { type: String, unique: true, required: true },
  fiscalYear:            { type: Number, required: true },
  issueDate:             { type: String, required: true },
  issuerName:            { type: String, default: 'FUNDACIÓN SENDA MUJER' },
  issuerNit:             { type: String, default: '901.789.456-1' },
  issuerRteStatus:       { type: String, default: 'Entidad sin Ánimo de Lucro - Régimen Tributario Especial (RTE) E.T. Art. 356-2 y D.R. 2150/2017' },
  issuerLegalRep:        { type: String, default: 'Dirección Ejecutiva Fundación Senda Mujer' },
  issuerAccountant:      { type: String, default: 'Contaduría Pública & Revisoría Fiscal' },
  issuerAccountantTp:    { type: String, default: 'T.P. 182492-T' },
  
  donorId:               { type: String },
  donorName:             { type: String, required: true },
  donorDocumentType:     { type: String, required: true, default: 'NIT' },
  donorDocumentNumber:   { type: String, required: true },
  donorAddress:          { type: String },
  donorCity:             { type: String, default: 'Cartagena de Indias, Bolívar' },
  donorEmail:            { type: String },
  donorPhone:            { type: String },

  donationId:            { type: String },
  donationType:          { type: String, enum: ['DINERO', 'ESPECIE', 'SERVICIOS', 'OTRO'], default: 'DINERO' },
  donationMethod:        { type: String, default: 'TRANSFERENCIA' },
  donationDate:          { type: String, required: true },
  amount:                { type: Number, required: true },
  currency:              { type: String, default: 'COP' },
  amountInWords:         { type: String, required: true },
  destinationProgram:    { type: String, required: true },
  speciesDescription:    { type: String },

  statuteArticles:       { type: String, default: 'Estatuto Tributario Nacional Artículos 125-1, 125-2, 125-3, 125-4, 125-5 y Decreto Reglamentario 2150 de 2017' },
  noConsiderationClause: { type: Boolean, default: true },
  meritoriousActivity:   { type: String, default: 'Atención integral, protección de derechos humanos, empoderamiento socioeconómico y asistencia a mujeres en situación de vulnerabilidad.' },

  verificationCode:      { type: String, unique: true, required: true },
  qrPayload:             { type: String, required: true },
  status:                { type: String, enum: ['EMITIDO', 'ANULADO', 'BORRADOR'], default: 'EMITIDO' },
  voidReason:            { type: String },
  voidedAt:              { type: Date },
  voidedBy:              { type: String },

  createdBy:             { type: String, required: true },
  createdByName:         { type: String, required: true },
}, { timestamps: true });

const CrmTaxCertificate = models.CrmTaxCertificate ?? model<ICrmTaxCertificate>('CrmTaxCertificate', CrmTaxCertificateSchema);

// Helper para convertir números a letras en español
function numberToWordsCOP(num: number): string {
  const units = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const teens = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const tens = ['', '', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const hundreds = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  if (num === 0) return 'CERO PESOS M/CTE';
  if (num === 100) return 'CIEN PESOS M/CTE';

  function convertGroup(n: number): string {
    let output = '';
    if (n === 100) return 'CIEN';
    if (n > 99) {
      output += hundreds[Math.floor(n / 100)] + ' ';
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      output += teens[n - 10] + ' ';
      return output.trim();
    }
    if (n >= 20 && n <= 29) {
      if (n === 20) output += 'VEINTE ';
      else output += 'VEINTI' + units[n % 10] + ' ';
      return output.trim();
    }
    if (n > 29) {
      output += tens[Math.floor(n / 10)];
      if (n % 10 > 0) output += ' Y ' + units[n % 10];
      output += ' ';
      return output.trim();
    }
    if (n > 0) {
      output += units[n] + ' ';
    }
    return output.trim();
  }

  let integerPart = Math.floor(Math.abs(num));
  let result = '';

  // Millones
  const millions = Math.floor(integerPart / 1000000);
  integerPart %= 1000000;
  if (millions === 1) {
    result += 'UN MILLÓN ';
  } else if (millions > 1) {
    result += convertGroup(millions) + ' MILLONES ';
  }

  // Miles
  const thousands = Math.floor(integerPart / 1000);
  integerPart %= 1000;
  if (thousands === 1) {
    result += 'MIL ';
  } else if (thousands > 1) {
    result += convertGroup(thousands) + ' MIL ';
  }

  // Centenas
  if (integerPart > 0) {
    result += convertGroup(integerPart) + ' ';
  }

  return (result.trim() + ' PESOS M/CTE.').replace(/\s+/g, ' ');
}

// ── GET ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search     = searchParams.get('q') || '';
    const status     = searchParams.get('status');
    const fiscalYear = searchParams.get('fiscalYear');
    const page       = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit      = Math.min(100, parseInt(searchParams.get('limit') ?? '25'));

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (fiscalYear) filter.fiscalYear = parseInt(fiscalYear);
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { donorName: { $regex: search, $options: 'i' } },
        { donorDocumentNumber: { $regex: search, $options: 'i' } },
        { verificationCode: { $regex: search, $options: 'i' } },
        { destinationProgram: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await CrmTaxCertificate.countDocuments(filter);
    const certificates = await CrmTaxCertificate.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Estadísticas
    const statsAgg = await CrmTaxCertificate.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const activeTotal = statsAgg.find(s => s._id === 'EMITIDO')?.totalAmount || 0;
    const activeCount = statsAgg.find(s => s._id === 'EMITIDO')?.count || 0;
    const voidedCount = statsAgg.find(s => s._id === 'ANULADO')?.count || 0;

    return NextResponse.json({
      certificates,
      total,
      page,
      limit,
      stats: {
        activeTotal,
        activeCount,
        voidedCount,
        allCount: total,
      },
    });
  } catch (error: any) {
    console.error('[certificados GET]', error);
    return NextResponse.json({ error: error?.message || 'Error al consultar certificados' }, { status: 500 });
  }
}

// ── POST ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;
  const { user } = auth;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { action } = body;

    // ── CREAR CERTIFICADO RTE DIAN ───────────────────────────────────
    if (action === 'CREATE' || !action) {
      const {
        donorId,
        donorName,
        donorDocumentType,
        donorDocumentNumber,
        donorAddress,
        donorCity,
        donorEmail,
        donorPhone,
        donationId,
        donationType = 'DINERO',
        donationMethod = 'TRANSFERENCIA',
        donationDate,
        amount,
        currency = 'COP',
        destinationProgram,
        speciesDescription,
        issuerLegalRep,
        issuerAccountant,
        issuerAccountantTp,
        fiscalYear,
      } = body;

      if (!donorName || !donorDocumentNumber || !donationDate || !amount || !destinationProgram) {
        return NextResponse.json(
          { error: 'Faltan campos obligatorios: donante, documento, fecha, monto y programa de destinación' },
          { status: 400 }
        );
      }

      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json({ error: 'El monto donado debe ser mayor a 0' }, { status: 400 });
      }

      const year = fiscalYear ? parseInt(fiscalYear) : new Date(donationDate).getFullYear();
      const code = await getNextSequence('TAX_CERTIFICATE', 'CERT-RTE');
      const issueDate = new Date().toISOString().slice(0, 10);

      // Generación de Hash Único de Verificación
      const rawPayload = `${code}|${donorDocumentNumber}|${numAmount}|${donationDate}|${issueDate}`;
      const verificationCode = createHash('sha256').update(rawPayload + randomBytes(8).toString('hex')).digest('hex').substring(0, 24).toUpperCase();
      const qrPayload = `https://fundacionsendamujer.org/verificar-certificado?code=${code}&hash=${verificationCode}`;

      const amountInWords = body.amountInWords || numberToWordsCOP(numAmount);

      const certificate = await CrmTaxCertificate.create({
        code,
        fiscalYear: year,
        issueDate,
        issuerLegalRep: issuerLegalRep || 'Dirección Ejecutiva Fundación Senda Mujer',
        issuerAccountant: issuerAccountant || 'Contaduría Pública & Revisoría Fiscal',
        issuerAccountantTp: issuerAccountantTp || 'T.P. 182492-T',
        
        donorId,
        donorName: donorName.trim().toUpperCase(),
        donorDocumentType: donorDocumentType || 'NIT',
        donorDocumentNumber: donorDocumentNumber.trim(),
        donorAddress: donorAddress || '',
        donorCity: donorCity || 'Cartagena de Indias, Bolívar',
        donorEmail: donorEmail || '',
        donorPhone: donorPhone || '',

        donationId,
        donationType,
        donationMethod,
        donationDate,
        amount: numAmount,
        currency,
        amountInWords,
        destinationProgram,
        speciesDescription,

        verificationCode,
        qrPayload,
        status: 'EMITIDO',

        createdBy: user.userId,
        createdByName: user.name,
      });

      await CrmAuditLog.create({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'TAX_CERTIFICATE_ISSUED',
        entity: 'CrmTaxCertificate',
        entityId: certificate._id.toString(),
        details: { code, donorName, amount: numAmount, fiscalYear: year },
      });

      return NextResponse.json({ success: true, certificate });
    }

    // ── ANULAR CERTIFICADO (Cumplimiento normativo DIAN) ─────────────
    if (action === 'VOID') {
      const { certificateId, voidReason } = body;
      if (!certificateId || !voidReason) {
        return NextResponse.json({ error: 'certificateId y motivo de anulación son requeridos' }, { status: 400 });
      }

      const certificate = await CrmTaxCertificate.findById(certificateId);
      if (!certificate) {
        return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 });
      }

      if (certificate.status === 'ANULADO') {
        return NextResponse.json({ error: 'El certificado ya fue anulado previamente' }, { status: 400 });
      }

      certificate.status = 'ANULADO';
      certificate.voidReason = voidReason;
      certificate.voidedAt = new Date();
      certificate.voidedBy = `${user.name} (${user.role})`;
      await certificate.save();

      await CrmAuditLog.create({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'TAX_CERTIFICATE_VOIDED',
        entity: 'CrmTaxCertificate',
        entityId: certificateId,
        details: { code: certificate.code, voidReason },
      });

      return NextResponse.json({ success: true, certificate });
    }

    // ── GENERAR TEXTO DE VALOR EN LETRAS ──────────────────────────────
    if (action === 'CONVERT_WORDS') {
      const { amount } = body;
      const words = numberToWordsCOP(Number(amount || 0));
      return NextResponse.json({ words });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('[certificados POST]', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar certificado' }, { status: 500 });
  }
}
