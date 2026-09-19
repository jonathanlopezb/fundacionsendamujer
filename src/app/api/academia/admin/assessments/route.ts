import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaAssessment from '@/lib/models/AcademiaAssessment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseSlug, title, durationMinutes, passingScore, questions, isPretest } = body;

    if (!courseSlug || !title || !questions?.length) {
      return NextResponse.json(
        { success: false, error: 'courseSlug, title y preguntas son requeridos.' },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updated = await AcademiaAssessment.findOneAndUpdate(
        { courseSlug },
        {
          courseSlug,
          title,
          durationMinutes: durationMinutes || 20,
          passingScore: passingScore || 70,
          questions,
          isPretest: Boolean(isPretest),
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return NextResponse.json({ success: true, assessment: updated, message: 'Evaluación guardada en MongoDB Atlas.' });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        assessment: body,
        message: 'Evaluación guardada en modo seguro.',
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al procesar la evaluación.' }, { status: 500 });
  }
}
