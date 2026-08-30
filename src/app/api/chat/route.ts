import { NextResponse } from 'next/server';
import { groq, SYSTEM_PROMPT_SENDA_BOT } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // If GROQ_API_KEY is configured, attempt Groq API call with model fallback
    if (groq) {
      try {
        // Attempt 1: Llama 3.3 70B Versatile (Primary High-Precision Model)
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_SENDA_BOT },
            ...messages,
          ],
          temperature: 0.6,
          max_tokens: 650,
        });

        const reply = response.choices[0]?.message?.content;
        if (reply && reply.trim()) {
          return NextResponse.json({ reply });
        }
      } catch (primaryError: any) {
        console.warn('Primary Groq model llama-3.3-70b-versatile failed, attempting llama-3.1-8b-instant:', primaryError?.message || primaryError);

        try {
          // Attempt 2: Llama 3.1 8B Instant (Secondary Fast Model)
          const fallbackResponse = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT_SENDA_BOT },
              ...messages,
            ],
            temperature: 0.6,
            max_tokens: 600,
          });

          const reply = fallbackResponse.choices[0]?.message?.content;
          if (reply && reply.trim()) {
            return NextResponse.json({ reply });
          }
        } catch (secondaryError: any) {
          console.error('Secondary Groq model llama-3.1-8b-instant also failed:', secondaryError?.message || secondaryError);
        }
      }
    }

    // Intelligent Contextual Fallback Handler (Guarantees immediate response if Groq API is offline/rate-limited)
    let fallbackReply = '';

    if (lastUserMessage.includes('violencia') || lastUserMessage.includes('abuso') || lastUserMessage.includes('golpe') || lastUserMessage.includes('amenaza') || lastUserMessage.includes('peligro')) {
      fallbackReply = '🕊️ **Estás en un espacio seguro y confidencial.** Si sufres violencia o estás en riesgo en Cartagena, comunícate inmediatamente a la **Línea Púrpura (155 / 301 469 2095)** o acudamos juntas a la Casa de Justicia de Chiquinquirá. En Fundación Senda Mujer te ofrecemos acompañamiento de caso y asesoría jurídica 100% gratuita.';
    } else if (lastUserMessage.includes('embarazo') || lastUserMessage.includes('ive') || lastUserMessage.includes('aborto') || lastUserMessage.includes('bebé') || lastUserMessage.includes('gestan')) {
      fallbackReply = '🌸 **En Fundación Senda Mujer te acompañamos con empatía y sin juzgar.** Bajo la legislación colombiana (Sentencias C-055/2022 y C-355/2006) tienes derecho a orientación oportuna y confidencial. Apoyamos tanto la interrupción voluntaria segura como la maternidad elegida mediante el programa *Embarazo con Apoyo* (nutrición, kit maternal y cuidado prenatal). ¿Te gustaría agendar una orientación psicosocial gratuita?';
    } else if (lastUserMessage.includes('cita') || lastUserMessage.includes('medico') || lastUserMessage.includes('psicologia') || lastUserMessage.includes('odontologia') || lastUserMessage.includes('abogado') || lastUserMessage.includes('ginecologia')) {
      fallbackReply = '📅 Puedes agendar tu cita gratuita directa con nuestras profesionales en Cartagena en las especialidades de **Psicología**, **Odontología Integral**, **Medicina General / Ginecología**, **Asesoría Jurídica** y **Trabajo Social**. Haz clic en el botón *Agendar Cita* en la barra superior o en nuestro menú principal.';
    } else if (lastUserMessage.includes('donar') || lastUserMessage.includes('ayudar') || lastUserMessage.includes('aporte') || lastUserMessage.includes('patrocinar')) {
      fallbackReply = '💝 ¡Muchas gracias por tu solidaridad! Puedes patrocinar directamente un *Kit de Maternidad*, una *Consulta Odontológica* o una *Sesión Psicológica* en nuestra sección de **Donar** con total transparencia 1 a 1.';
    } else {
      fallbackReply = '🌷 Hola, bienvenida a la **Fundación Senda Mujer** en Cartagena. Recuerda que nunca estarás sola. Te ofrecemos orientación social, acompañamiento psicosocial, atención en salud/odontología, apoyo en embarazo y asesoría jurídica sin costo. ¿En qué puedo orientarte hoy?';
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Error in Chat API Route:', error);
    return NextResponse.json({
      reply: '🌷 Hola. Estoy aquí para acompañarte de forma segura. Recuerda que nuestra línea prioritaria en Cartagena está activa 24/7 en el **301 469 2095** o Línea Púrpura **155**. ¿En qué puedo orientarte hoy?'
    });
  }
}
