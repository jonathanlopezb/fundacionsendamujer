import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AcademiaLiveSession from '@/lib/models/AcademiaLiveSession';

const INITIAL_LIVE_SESSION = {
  title: 'Marketing Digital en Vivo: Estrategias de Cierre de Ventas',
  subtitle: 'Aprende a transformar interacciones en pedidos reales utilizando WhatsApp Business y reels.',
  instructor: 'Mg. Laura Gómez Rodríguez',
  instructorRole: 'Docente Especialista Fundación Senda Mujer',
  category: 'Habilidades Digitales',
  scheduledDate: 'Hoy - 5:00 p.m.',
  scheduledTime: '5:00 p.m. - 6:30 p.m.',
  durationMinutes: 90,
  status: 'LIVE',
  viewersCount: 1240,
  registeredCount: 480,
  streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  chatMessages: [
    {
      id: 'm-1',
      senderName: 'Carolina M.',
      message: '¡Excelente clase! Las herramientas de WhatsApp me han servido mucho.',
      timestamp: new Date(Date.now() - 180000),
      isHost: false,
    },
    {
      id: 'm-2',
      senderName: 'Valentina P.',
      message: '¿Dónde puedo descargar el material de trabajo de la sesión de hoy?',
      timestamp: new Date(Date.now() - 120000),
      isHost: false,
    },
    {
      id: 'm-3',
      senderName: 'Dra. Sorelvis Murillo',
      message: '¡Bienvenidas a todas! En la pestaña de Materiales tienen la plantilla Excel.',
      timestamp: new Date(Date.now() - 90000),
      isHost: true,
    },
    {
      id: 'm-4',
      senderName: 'Sofía R.',
      message: '¿Habrá más clases de este tema la próxima semana?',
      timestamp: new Date(Date.now() - 45000),
      isHost: false,
    },
    {
      id: 'm-5',
      senderName: 'Daniela G.',
      message: '¡Me encanta esta plataforma! Saludos desde El Pozón.',
      timestamp: new Date(Date.now() - 10000),
      isHost: false,
    },
  ],
};

const UPCOMING_SESSIONS = [
  {
    id: 'up-1',
    title: 'Finanzas para Emprendedoras: Fijación de Precios',
    instructor: 'Mg. Carlos Mendoza',
    date: 'Viernes',
    time: '6:00 p.m.',
    category: 'Finanzas',
    registered: 184,
  },
  {
    id: 'up-2',
    title: 'Derechos y Rutas de Atención Ley 1257',
    instructor: 'Abg. Carlos Mendoza',
    date: 'Lunes',
    time: '5:00 p.m.',
    category: 'Desarrollo Personal',
    registered: 210,
  },
  {
    id: 'up-3',
    title: 'Salud Integral y Autocuidado Emocional',
    instructor: 'Dra. María Patricia Gómez',
    date: 'Miércoles',
    time: '4:00 p.m.',
    category: 'Bienestar',
    registered: 156,
  },
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    let session = await AcademiaLiveSession.findOne({ status: 'LIVE' }).lean();

    if (!session) {
      session = INITIAL_LIVE_SESSION as any;
    }

    return NextResponse.json({
      success: true,
      liveSession: session,
      upcomingSessions: UPCOMING_SESSIONS,
    });
  } catch (error) {
    console.warn('Academia live fetch fallback', error);
    return NextResponse.json({
      success: true,
      liveSession: INITIAL_LIVE_SESSION,
      upcomingSessions: UPCOMING_SESSIONS,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, message } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: 'Mensaje requerido' }, { status: 400 });
    }

    const newChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: senderName || 'Usuario Senda #4821',
      message: message.trim(),
      timestamp: new Date(),
      isHost: false,
    };

    try {
      await connectToDatabase();
      await AcademiaLiveSession.updateOne(
        { status: 'LIVE' },
        { $push: { chatMessages: newChatMessage } }
      );
    } catch (e) {
      // Fallback handled in client state
    }

    return NextResponse.json({ success: true, chatMessage: newChatMessage });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error al enviar mensaje' }, { status: 500 });
  }
}
