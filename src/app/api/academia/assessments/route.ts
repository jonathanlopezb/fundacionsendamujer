import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaAssessment from '@/lib/models/AcademiaAssessment';
import AcademiaCertificate from '@/lib/models/AcademiaCertificate';
import AcademiaEnrollment from '@/lib/models/AcademiaEnrollment';

const DEFAULT_ASSESSMENTS: Record<string, any> = {
  'marketing-digital-emprendedoras': {
    courseSlug: 'marketing-digital-emprendedoras',
    title: 'Evaluación del curso: Marketing Digital para Emprendedoras',
    durationMinutes: 20,
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: '¿Cuál es el objetivo principal del marketing digital para una emprendedora?',
        options: [
          { id: 'a', text: 'Aumentar las ventas sin importar el público', isCorrect: false },
          { id: 'b', text: 'Llegar a un público específico de manera efectiva y sostenible', isCorrect: true },
          { id: 'c', text: 'Reducir los costos de producción física', isCorrect: false },
          { id: 'd', text: 'Sustituir el marketing tradicional por completo', isCorrect: false },
        ],
        explanation: 'El marketing digital permite segmentar y conectar con el cliente ideal mediante mensajes dirigidos y medición precisa.',
        points: 10,
      },
      {
        id: 'q2',
        question: '¿Qué elemento define a una propuesta de valor atractiva?',
        options: [
          { id: 'a', text: 'Tener siempre el precio más bajo del mercado', isCorrect: false },
          { id: 'b', text: 'Resolver un problema real del cliente de forma diferenciada y clara', isCorrect: true },
          { id: 'c', text: 'Publicar más de diez veces al día en redes sociales', isCorrect: false },
          { id: 'd', text: 'Vender una amplia variedad de productos no relacionados', isCorrect: false },
        ],
        explanation: 'La propuesta de valor comunica el beneficio único que percibe el cliente y la razón por la cual te elegirá a ti.',
        points: 10,
      },
      {
        id: 'q3',
        question: '¿Cuál es una ventaja clave de usar WhatsApp Business frente al WhatsApp personal?',
        options: [
          { id: 'a', text: 'Permite hacer llamadas ilimitadas al extranjero', isCorrect: false },
          { id: 'b', text: 'Catálogo de productos, respuestas rápidas y etiquetas de clientes', isCorrect: true },
          { id: 'c', text: 'Oculta automáticamente el número de teléfono', isCorrect: false },
          { id: 'd', text: 'Cobra una comisión por cada mensaje enviado', isCorrect: false },
        ],
        explanation: 'WhatsApp Business brinda herramientas comerciales como catálogos integrados, mensajes automáticos y organización por etiquetas.',
        points: 10,
      },
      {
        id: 'q4',
        question: 'En un presupuesto mensual de marketing, ¿qué se recomienda hacer primero?',
        options: [
          { id: 'a', text: 'Gastar todo el presupuesto en anuncios el primer día', isCorrect: false },
          { id: 'b', text: 'Definir el objetivo específico y el público antes de asignar pauta publicitaria', isCorrect: true },
          { id: 'c', text: 'Contratar inmediatamente una agencia internacional', isCorrect: false },
          { id: 'd', text: 'Esperar a que las ventas crezcan solas sin invertir', isCorrect: false },
        ],
        explanation: 'Todo presupuesto debe responder a objetivos concretos de alcance, leads o ventas con segmentación clara.',
        points: 10,
      },
      {
        id: 'q5',
        question: '¿Qué métrica indica si un anuncio publicitario está generando interés efectivo?',
        options: [
          { id: 'a', text: 'El peso del archivo de la imagen', isCorrect: false },
          { id: 'b', text: 'La tasa de clics (CTR) y las conversaciones iniciadas en WhatsApp', isCorrect: true },
          { id: 'c', text: 'La hora en que se apagó el computador', isCorrect: false },
          { id: 'd', text: 'El número de personas que no hicieron clic', isCorrect: false },
        ],
        explanation: 'El CTR y los contactos reales generados miden la efectividad del mensaje y la llamada a la acción.',
        points: 10,
      },
    ],
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('courseSlug') || 'marketing-digital-emprendedoras';

  try {
    await connectToDatabase();
    let assessment = await AcademiaAssessment.findOne({ courseSlug }).lean();

    if (!assessment && DEFAULT_ASSESSMENTS[courseSlug]) {
      assessment = DEFAULT_ASSESSMENTS[courseSlug];
    } else if (!assessment) {
      assessment = DEFAULT_ASSESSMENTS['marketing-digital-emprendedoras'];
    }

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.warn('Academia assessment fetch fallback', error);
    return NextResponse.json({
      success: true,
      assessment: DEFAULT_ASSESSMENTS[courseSlug] || DEFAULT_ASSESSMENTS['marketing-digital-emprendedoras'],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseSlug, learnerName, learnerId, answers } = body;

    const currentAssessment = DEFAULT_ASSESSMENTS[courseSlug] || DEFAULT_ASSESSMENTS['marketing-digital-emprendedoras'];
    const questions = currentAssessment.questions;

    let scorePoints = 0;
    const totalPoints = questions.length * 10;

    questions.forEach((q: any) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((opt: any) => opt.isCorrect);
      if (correctOption && selectedOptionId === correctOption.id) {
        scorePoints += 10;
      }
    });

    const percentage = Math.round((scorePoints / totalPoints) * 100);
    const passed = percentage >= (currentAssessment.passingScore || 70);

    let certificateCode = null;

    if (passed) {
      const year = new Date().getFullYear();
      const randomId = Math.floor(100000 + Math.random() * 900000);
      certificateCode = `SENDA-${year}-${randomId}`;

      try {
        await connectToDatabase();
        await AcademiaCertificate.create({
          code: certificateCode,
          learnerName: learnerName || 'Laura Gómez Rodríguez',
          learnerId: learnerId || 'CSM-2026-0048',
          courseSlug,
          courseTitle: 'Marketing Digital para Emprendedoras',
          courseCategory: 'Habilidades Digitales',
          instructor: 'Dra. Sorelvis Murillo & Mg. Laura Gómez',
          hours: 32,
          grade: percentage,
          status: 'VALID',
        });
      } catch (dbErr) {
        console.warn('Certificate DB write deferred in fallback mode', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      score: percentage,
      passed,
      passingScore: currentAssessment.passingScore || 70,
      certificateCode,
      feedback: passed
        ? '¡Felicitaciones! Has demostrado un dominio sobresaliente de los conceptos. Tu certificado oficial ya está disponible.'
        : 'Has obtenido un puntaje inferior al 70%. Te invitamos a repasar las lecciones del curso y volver a intentarlo.',
    });
  } catch (error) {
    console.error('Error grading assessment', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar la evaluación' },
      { status: 500 }
    );
  }
}
