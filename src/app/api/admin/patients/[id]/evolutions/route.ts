import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PatientEHR from '@/lib/models/PatientEHR';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id;
    const body = await req.json();

    const newEvolution = {
      id: body.id || `EVO-${Date.now()}`,
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      author: body.author,
      role: body.role,
      rethus: body.rethus,
      subjective: body.subjective,
      objective: body.objective || 'Constantes vitales estables.',
      analysis: body.analysis,
      plan: body.plan,
      cie10Code: body.cie10Code || undefined,
    };

    try {
      await connectToDatabase();
      const updated = await PatientEHR.findOneAndUpdate(
        { id: patientId },
        { $push: { evolutions: { $each: [newEvolution], $position: 0 } } },
        { new: true }
      );

      return NextResponse.json({ success: true, evolution: newEvolution, patient: updated });
    } catch (dbErr) {
      console.warn('MongoDB fallback save for evolution:', dbErr);
      return NextResponse.json({ success: true, evolution: newEvolution, isDemoFallback: true });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
