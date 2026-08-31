/**
 * API: /api/caribe-seguro/alerts
 * GET  — Listar alertas activas (panel profesional)
 * PATCH — Resolver/escalar una alerta (requiere humanDecision obligatoria)
 *
 * La decisión humana es OBLIGATORIA al resolver.
 * El sistema organiza y prioriza información; nunca sustituye el criterio clínico.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import DeteriorationAlert from '@/lib/models/DeteriorationAlert';

// GET /api/caribe-seguro/alerts?status=pendiente&level=roja
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'pendiente';
    const level = searchParams.get('level');

    const query: Record<string, any> = {};
    if (status !== 'all') query.status = status;
    if (level) query.alertLevel = level;

    await connectToDatabase();

    const alerts = await DeteriorationAlert.find(query)
      .sort({ alertLevel: -1, triggeredAt: -1 }) // Rojas primero, más recientes primero
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, alerts, total: alerts.length });
  } catch (err: any) {
    console.error('Alerts GET Error:', err);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}

// PATCH /api/caribe-seguro/alerts — Resolver o escalar una alerta
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { alertId, action, humanDecision, assignedTo, assignedToRole } = body;

    if (!alertId) {
      return NextResponse.json({ error: 'alertId requerido.' }, { status: 400 });
    }

    // La decisión humana es obligatoria si se va a resolver
    if (action === 'resolver' && (!humanDecision || humanDecision.trim().length < 10)) {
      return NextResponse.json(
        { error: 'La decisión profesional es obligatoria y debe tener al menos 10 caracteres para resolver una alerta.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: Record<string, any> = {};

    if (action === 'asignar') {
      updateData.assignedTo = assignedTo;
      updateData.assignedToRole = assignedToRole;
      updateData.status = 'en_revision';
    } else if (action === 'resolver') {
      updateData.status = 'resuelta';
      updateData.humanDecision = humanDecision;
      updateData.humanDecisionAt = new Date();
      updateData.resolvedAt = new Date();
    } else if (action === 'escalar') {
      updateData.status = 'escalada';
      updateData.escalatedToDirection = true;
      updateData.humanDecision = humanDecision || 'Escalada a Coordinación del Espacio Seguro.';
      updateData.humanDecisionAt = new Date();
    }

    const updated = await DeteriorationAlert.findByIdAndUpdate(alertId, updateData, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Alerta no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, alert: updated });
  } catch (err: any) {
    console.error('Alerts PATCH Error:', err);
    return NextResponse.json({ error: 'Error interno.' }, { status: 500 });
  }
}
