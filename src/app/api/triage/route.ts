import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TriageResult from '@/lib/models/TriageResult';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, phone, email, age, neighborhood, answers } = body;

    if (!patientName || !phone || !age || !answers) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Algorithmic Scoring based on responses
    let emotionalRisk = 20;
    let violenceRisk = 10;
    let pregnancySupportNeeded = 10;
    let legalNeed = 10;

    // Check specific answers
    if (answers.q1 === 'muy_alto' || answers.q1 === 'alto') emotionalRisk += 40;
    if (answers.q2 === 'si_reciente' || answers.q2 === 'si_frecuente') violenceRisk += 50;
    if (answers.q3 === 'embarazo_no_planeado' || answers.q3 === 'embarazo_violencia') pregnancySupportNeeded += 50;
    if (answers.q4 === 'denuncia_vbg' || answers.q4 === 'medidas_proteccion') legalNeed += 45;

    // Cap at 100
    emotionalRisk = Math.min(100, emotionalRisk);
    violenceRisk = Math.min(100, violenceRisk);
    pregnancySupportNeeded = Math.min(100, pregnancySupportNeeded);
    legalNeed = Math.min(100, legalNeed);

    // Determine overall risk
    let overallRiskLevel: 'BAJO' | 'MEDIO' | 'ALTO' | 'EMERGENCIA_CRÍTICA' = 'MEDIO';
    if (violenceRisk >= 60 || emotionalRisk >= 80) {
      overallRiskLevel = 'EMERGENCIA_CRÍTICA';
    } else if (violenceRisk >= 40 || emotionalRisk >= 60 || pregnancySupportNeeded >= 60) {
      overallRiskLevel = 'ALTO';
    } else if (emotionalRisk <= 30 && violenceRisk <= 20) {
      overallRiskLevel = 'BAJO';
    }

    // Determine primary recommended department
    let primaryDepartment: 'Psicología' | 'Medicina General' | 'Odontología' | 'Asesoría Jurídica' | 'Trabajo Social' = 'Psicología';
    let recommendedProgram = 'Programa 3 — Contención y Acompañamiento Psicosocial';

    if (violenceRisk >= 50 || legalNeed >= 50) {
      primaryDepartment = 'Asesoría Jurídica';
      recommendedProgram = 'Programa 2 — Mujeres Víctimas de Violencia Sexual y Programa 6 — Mujer y Justicia';
    } else if (pregnancySupportNeeded >= 50) {
      primaryDepartment = 'Medicina General';
      recommendedProgram = 'Programa 4 — Ruta de Salud y Derechos Reproductivos y Programa 5 — Embarazo con Apoyo';
    }

    // Attempt DB save
    try {
      await connectToDatabase();
      await TriageResult.create({
        patientName,
        phone,
        email,
        age: Number(age),
        neighborhood: neighborhood || 'Cartagena',
        scores: {
          emotionalRisk,
          violenceRisk,
          pregnancySupportNeeded,
          legalNeed,
        },
        overallRiskLevel,
        primaryDepartment,
        recommendedProgram,
        answers,
      });
    } catch (dbError) {
      console.warn('DB Save skipped in fallback mode:', dbError);
    }

    return NextResponse.json({
      success: true,
      result: {
        patientName,
        overallRiskLevel,
        primaryDepartment,
        recommendedProgram,
        scores: {
          emotionalRisk,
          violenceRisk,
          pregnancySupportNeeded,
          legalNeed,
        },
        contactHotline: '301 469 2095 - Dra. Sorelvis / Fundación Senda Mujer Cartagena',
      },
    });
  } catch (error: any) {
    console.error('Triage POST error:', error);
    return NextResponse.json({ error: 'Error procesando el test de triaje' }, { status: 500 });
  }
}
