import { NextResponse } from 'next/server';
import { groq, SYSTEM_PROMPT_SENDA_BOT } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // If GROQ_API_KEY is configured, call Groq API
    if (groq) {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_SENDA_BOT },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 600,
      });

      const reply = response.choices[0]?.message?.content || 'Hola, estoy aquí para escucharte y ayudarte confidencialmente.';
      return NextResponse.json({ reply });
    }

    // Intelligent Fallback Handler if GROQ_API_KEY is not set yet
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = '';

    if (lastUserMessage.includes('violencia') || lastUserMessage.includes('abuso') || lastUserMessage.includes('golpe') || lastUserMessage.includes('amenaza')) {
      fallbackReply = '🕊️ **Estás en un espacio seguro y confidencial.** Si estás sufriendo violencia o peligro inmediato en Cartagena, puedes llamar a la **Línea Púrpura (155 o 317 657 5800)** o acudamos juntas a la Casa de Justicia de Chiquinquirá. En la Fundación Senda Mujer te ofrecemos acompañante de caso y asesoría jurídica gratuita.';
    } else if (lastUserMessage.includes('embarazo') || lastUserMessage.includes('ive') || lastUserMessage.includes('aborto') || lastUserMessage.includes('bebé')) {
      fallbackReply = '🌸 **En Fundación Senda Mujer te acompañamos sin juzgar.** Bajo la legislación colombiana (Sentencia C-055/2022 y C-355/2006) tienes derecho a orientación oportuna y confidencial. Apoyamos plenamente tanto la interrupción voluntaria segura como la continuación del embarazo con nuestro programa *Embarazo con Apoyo* (nutrición, kit maternal y preparación). ¿Te gustaría agendar una valoración gratuita?';
    } else if (lastUserMessage.includes('cita') || lastUserMessage.includes('medico') || lastUserMessage.includes('psicologia') || lastUserMessage.includes('odontologia') || lastUserMessage.includes('abogado')) {
      fallbackReply = '📅 Puedes agendar una cita gratuita directa con nuestros profesionales en Cartagena en las especialidades de **Psicología**, **Odontología Integral**, **Medicina General**, **Asesoría Jurídica** y **Trabajo Social**. Haz clic en el botón *Agendar Cita* en el menú principal.';
    } else if (lastUserMessage.includes('donar') || lastUserMessage.includes('ayudar') || lastUserMessage.includes('aporte')) {
      fallbackReply = '💝 ¡Muchas gracias por tu solidaridad! Puedes patrocinar directamente un *Kit de Maternidad*, una *Consulta Odontológica* o una *Sesión Psicológica* en nuestra sección de **Donar** con total transparencia 1 a 1.';
    } else {
      fallbackReply = '🌷 Hola, bienvenida a la **Fundación Senda Mujer** en Cartagena. Recuerda que nunca estarás sola. Te ofrecemos orientación social, acompañamiento psicosocial, atención en salud/odontología, apoyo en embarazo y asesoría jurídica. ¿En qué puedo ayudarte hoy?';
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Error in Chat API Route:', error);
    return NextResponse.json(
      { reply: 'Hola. En este momento estoy experimentando un ajuste de conexión, pero recuerda que nuestro canal prioritario telefónico en Cartagena está disponible 24/7. ¿Deseas solicitar una cita directa?' },
      { status: 200 }
    );
  }
}
