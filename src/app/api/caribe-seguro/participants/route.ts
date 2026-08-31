import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Participant from '@/lib/models/Participant';
import ProtectionPlan from '@/lib/models/ProtectionPlan';
import { seedCaribeSeguroData } from '@/lib/seedCaribeSeguro';

export async function GET() {
  try {
    await connectToDatabase();
    await seedCaribeSeguroData();
    const participants = await Participant.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, count: participants.length, data: participants });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const count = await Participant.countDocuments();
    const participantId = `CSM-2026-${String(count + 1).padStart(6, '0')}`;
    const anonymizedCode = `SM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newParticipant = await Participant.create({
      participantId,
      anonymizedCode,
      participationLevel: body.participationLevel || 'PARTICIPANTE',
      registrationChannel: body.registrationChannel || 'web_caribe_seguro',
      needsCategory: body.needsCategory || [],
      consentGranted: true,
      status: 'ACTIVO',
    });

    // Crear plan de protección inicial
    await ProtectionPlan.create({
      participantId,
      anonymizedCode,
      objectives: [
        { id: 'obj-init-1', title: 'Evaluación voluntaria del IPSC', category: 'Diagnóstico', status: 'EN_PROGRESO' },
      ],
      actions: [
        { id: 'act-init-1', title: 'Orientación inicial en plataforma', status: 'COMPLETADA' },
      ],
      assignedProfessional: 'Equipo Psicosocial Senda Mujer',
      protectionIndexCurrent: 5.0,
      protectionIndexBaseline: 5.0,
    });

    return NextResponse.json({ success: true, participantId, anonymizedCode, data: newParticipant });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
