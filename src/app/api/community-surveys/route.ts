import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CommunitySurvey from '@/lib/models/CommunitySurvey';

const ALLOWED_NEEDS = new Set(['salud', 'afiliacion', 'materna', 'vacunacion', 'cronica', 'acceso_salud', 'educacion', 'documentacion', 'familia', 'violencia', 'vivienda', 'tramites', 'subsidios', 'empleo']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const householdSize = Number(body.householdSize);
    const minorCount = Number(body.minorCount);
    const needs = Array.isArray(body.needs) ? body.needs.filter((need: unknown) => typeof need === 'string' && ALLOWED_NEEDS.has(need)) : [];
    const collectorCode = typeof body.collectorCode === 'string' ? body.collectorCode.trim().slice(0, 30) : '';
    const fieldZone = typeof body.fieldZone === 'string' ? body.fieldZone.trim().slice(0, 50) : '';
    if (!body.consentGranted || !Number.isInteger(householdSize) || householdSize < 1 || householdSize > 30 || !Number.isInteger(minorCount) || minorCount < 0 || minorCount > householdSize) return NextResponse.json({ success: false, message: 'Revisa los datos obligatorios y el consentimiento.' }, { status: 400 });
    const priority = body.immediateRisk === true ? 'INMEDIATA' : needs.includes('violencia') || needs.includes('cronica') ? 'PRIORITARIA' : 'NORMAL';
    const surveyCode = `AB-2026-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    try {
      const database = await connectToDatabase();
      if (database.connection.readyState !== 1) throw new Error('MongoDB no está disponible');
      await CommunitySurvey.create({ surveyCode, collectorCode, fieldZone, householdSize, minorCount, needs, priority, consentGranted: true });
    } catch (error) {
      console.error('No se pudo guardar la caracterización en MongoDB:', error);
      return NextResponse.json({ success: false, message: 'No hay conexión con la base de datos. No se guardó la ficha; verifica la red e inténtalo de nuevo.' }, { status: 503 });
    }
    return NextResponse.json({ success: true, surveyCode, priority });
  } catch { return NextResponse.json({ success: false, message: 'No fue posible procesar la encuesta. Intenta nuevamente.' }, { status: 400 }); }
}
