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

    // Fallback inteligente por temas — siempre cierra con recomendación profesional
    let fallbackReply = '';

    const msg = lastUserMessage;

    if (msg.includes('peligro') || msg.includes('me va a matar') || msg.includes('amenaza') || msg.includes('suicid') || msg.includes('hacerme daño')) {
      fallbackReply = '🚨 **Si estás en peligro ahora mismo, llama al 123 (emergencias) o a la Línea Púrpura 155.** Tu seguridad es lo primero.\n\nEn la Fundación Senda Mujer te acompañamos con orientación jurídica y psicosocial gratuita. Llámanos al **301 469 2095**.';

    } else if (msg.includes('violencia') || msg.includes('abuso') || msg.includes('golpe') || msg.includes('maltrato') || msg.includes('agresion')) {
      fallbackReply = '🕊️ Lo que describes es violencia, y mereces protección. No es tu culpa. En Cartagena puedes acudir a la **Comisaría de Familia**, la **Casa de Justicia de Chiquinquirá** o llamar a la **Línea Púrpura 155**.\n\nNuestra abogada especialista en VBG puede asesorarte sin costo. ¿Quieres que te oriente sobre los pasos para interponer una medida de protección?';

    } else if (msg.includes('embarazo') || msg.includes('ive') || msg.includes('aborto') || msg.includes('gestan') || msg.includes('bebé') || msg.includes('prenatal')) {
      fallbackReply = '🌸 Entiendo que estás en un momento que puede generar muchas emociones, y estoy aquí sin juzgarte. En Colombia tienes derechos legales claros bajo la **Sentencia C-055/2022** (hasta semana 24) y la C-355/2006.\n\nNuestras ginecólogas y psicólogas te acompañan gratuitamente, tanto si decides continuar el embarazo como si no. ¿Te gustaría agendar una orientación confidencial?';

    } else if (msg.includes('ansiedad') || msg.includes('angustia') || msg.includes('nerviosa') || msg.includes('pánico') || msg.includes('no puedo dormir') || msg.includes('estrés')) {
      fallbackReply = 'Lo que sientes es válido. La ansiedad es una señal de que algo necesita atención, no una debilidad. Algunas cosas que pueden ayudarte en este momento: respirar profundo (4 segundos inhalando, 4 reteniendo, 6 exhalando), moverse un poco, y hablar con alguien de confianza.\n\nNuestras **psicólogas clínicas** de la Fundación Senda Mujer pueden acompañarte de forma gratuita. ¿Quieres agendar una sesión?';

    } else if (msg.includes('triste') || msg.includes('sola') || msg.includes('deprimida') || msg.includes('llorar') || msg.includes('sin ganas') || msg.includes('perdida')) {
      fallbackReply = 'Gracias por contarme cómo te sientes. Sentirse así es más común de lo que crees, y lo importante es que no tienes que atravesarlo sola. Permitirte sentir es el primer paso para sanar.\n\nEn la Fundación Senda Mujer tenemos psicólogas que te escuchan sin juzgarte, de forma gratuita y confidencial. Escríbenos o llama al **301 469 2095**.';

    } else if (msg.includes('autoestima') || msg.includes('me siento fea') || msg.includes('no valgo') || msg.includes('insegura') || msg.includes('no me quiero') || msg.includes('confianza')) {
      fallbackReply = 'Tu valor no depende de cómo te ves ni de lo que otros digan. Trabajar en la autoestima es un proceso, y hay herramientas concretas que funcionan: escribir 3 cosas que hiciste bien cada día, alejarte de comparaciones en redes, y rodearte de personas que te nutran.\n\nNuestras psicólogas de la Fundación pueden acompañarte en ese proceso de forma gratuita. ¿Te animas a dar ese paso?';

    } else if (msg.includes('pareja') || msg.includes('relacion') || msg.includes('novio') || msg.includes('esposo') || msg.includes('celos') || msg.includes('infidelidad') || msg.includes('ruptura') || msg.includes('separacion') || msg.includes('divorcio')) {
      fallbackReply = 'Las relaciones de pareja pueden ser fuente de mucha alegría pero también de dolor. Lo importante es identificar si lo que vives es un conflicto superable o una situación que te daña.\n\nNuestras psicólogas y, si hay situaciones de control o violencia, nuestra abogada especialista, pueden orientarte gratuitamente. Llámanos al **301 469 2095**.';

    } else if (msg.includes('hijo') || msg.includes('crianza') || msg.includes('maternidad') || msg.includes('bebe') || msg.includes('lactancia') || msg.includes('colegio') || msg.includes('adolescente')) {
      fallbackReply = 'Criar es uno de los roles más exigentes y a veces más solitarios. Es normal sentirse agotada o insegura. Lo más valioso que puedes darle a tus hijos es una mamá que también se cuida.\n\nNuestra trabajadora social y psicóloga pueden acompañarte en el proceso de crianza de forma gratuita en la Fundación Senda Mujer. ¿Quieres una orientación?';

    } else if (msg.includes('dinero') || msg.includes('deuda') || msg.includes('trabajo') || msg.includes('empleo') || msg.includes('negocio') || msg.includes('emprender') || msg.includes('economica') || msg.includes('plata')) {
      fallbackReply = 'La autonomía económica es un derecho y una herramienta de protección. Algunos primeros pasos: identificar un ingreso base, explorar habilidades vendibles, y revisar si hay créditos de bajo costo disponibles.\n\nEn la Fundación Senda Mujer tenemos el programa **Capital Semilla y SendaAcademia** donde puedes aprender a emprender o fortalecer tu negocio. ¿Te interesa más información?';

    } else if (msg.includes('cita') || msg.includes('medico') || msg.includes('psicolog') || msg.includes('odontolog') || msg.includes('abogad') || msg.includes('ginecolog') || msg.includes('diente') || msg.includes('salud')) {
      fallbackReply = '📅 Puedes agendar tu cita gratuita en: **Psicología**, **Odontología Integral**, **Medicina General / Ginecología**, **Asesoría Jurídica** y **Trabajo Social**.\n\nEscríbenos al **301 469 2095** o usa el botón "Agendar Cita" en el menú principal. Atendemos en Cartagena de forma presencial y virtual.';

    } else if (msg.includes('donar') || msg.includes('ayudar') || msg.includes('aporte') || msg.includes('voluntaria') || msg.includes('patrocinar')) {
      fallbackReply = '💝 ¡Muchas gracias por tu solidaridad! Puedes patrocinar directamente un **Kit de Maternidad**, una **Consulta Odontológica** o una **Sesión Psicológica** en nuestra sección de Donar con total transparencia 1 a 1.\n\nCada aporte transforma una vida. Gracias por ser parte de Senda Mujer.';

    } else {
      fallbackReply = '🌷 Hola, soy SendaBot. Estoy aquí para escucharte y orientarte sobre cualquier tema que te preocupe: relaciones, salud emocional, derechos, embarazo, trabajo, crianza o lo que necesites.\n\nEn la **Fundación Senda Mujer** en Cartagena tenemos profesionales especializadas que pueden acompañarte de forma gratuita y confidencial. ¿En qué puedo ayudarte hoy?';
    }


    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Error in Chat API Route:', error);
    return NextResponse.json({
      reply: '🌷 Hola. Estoy aquí para acompañarte de forma segura. Recuerda que nuestra línea prioritaria en Cartagena está activa 24/7 en el **301 469 2095** o Línea Púrpura **155**. ¿En qué puedo orientarte hoy?'
    });
  }
}
