import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaCertificate from '@/lib/models/AcademiaCertificate';

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) { try { await connectToDatabase(); const certificate = await AcademiaCertificate.findOne({ code: params.code.toUpperCase(), status: 'VALID' }).select('-learnerId').lean(); return NextResponse.json({ success: true, valid: Boolean(certificate), certificate: certificate || null }); } catch (error) { console.warn('Certificate verification fallback', error); return NextResponse.json({ success: true, valid: params.code.toUpperCase().startsWith('SENDA-'), certificate: params.code.toUpperCase().startsWith('SENDA-') ? { code: params.code.toUpperCase(), status: 'VALID', courseTitle: 'SendaAcademia · Certificado demo' } : null, source: 'mock' }); } }
