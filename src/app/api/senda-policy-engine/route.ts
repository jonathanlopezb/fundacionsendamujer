import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

const SYSTEM_PROMPT_POLICY_ENGINE = `
Eres el "SENDA Policy Engine", el motor analítico de Inteligencia Social de la Fundación Senda Mujer en Cartagena, Colombia.
Tu tarea es convertir la historia o situación reportada por una mujer en un diagnóstico multidimensional de derechos y rutas institucionales según el marco legal de Colombia:
- CONPES 4080 (Política Nacional de Equidad de Género)
- Resolución Intersectorial 1350 de 2026 (Política Nacional 2026–2035 de Derechos Sexuales y Reproductivos)
- Sentencias C-055 de 2022 y C-355 de 2006 (Autonomía reproductiva y Salud)
- Ley 1257 de 2008 (Vida libre de violencias) y Ley 2244 de 2022 (Parto Digno)

Debes responder ÚNICAMENTE en formato JSON válido con la siguiente estructura exacta:
{
  "profile": {
    "salud": "HIGH" | "MEDIUM" | "LOW",
    "violencia": "HIGH" | "MEDIUM" | "LOW",
    "economia": "HIGH" | "MEDIUM" | "LOW",
    "cuidado": "HIGH" | "MEDIUM" | "LOW",
    "vivienda": "HIGH" | "MEDIUM" | "LOW",
    "educacion": "HIGH" | "MEDIUM" | "LOW",
    "redApoyo": "HIGH" | "MEDIUM" | "LOW"
  },
  "rightsMap": [
    {
      "category": string,
      "title": string,
      "route": string,
      "norm": string,
      "priority": "HIGH" | "MEDIUM" | "LOW"
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    const { narrative } = await req.json();

    if (!narrative || typeof narrative !== 'string') {
      return NextResponse.json({ error: 'Narrative is required' }, { status: 400 });
    }

    if (groq) {
      const response = await groq.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_POLICY_ENGINE },
          { role: 'user', content: `Analiza esta situación de una mujer: "${narrative}"` },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const rawJson = response.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(rawJson);
      return NextResponse.json(parsed);
    }

    // Fallback if Groq API key is not present in dev
    const textLower = narrative.toLowerCase();
    const isViolencia = textLower.includes('violencia') || textLower.includes('pareja') || textLower.includes('amenaz') || textLower.includes('golpe');
    const isEmbarazo = textLower.includes('embaraz') || textLower.includes('bebe') || textLower.includes('hijo') || textLower.includes('gestan');
    const isEconomia = textLower.includes('empleo') || textLower.includes('dinero') || textLower.includes('econom') || textLower.includes('trabaj');

    const fallbackResponse = {
      profile: {
        salud: isEmbarazo ? 'HIGH' : 'MEDIUM',
        violencia: isViolencia ? 'HIGH' : 'LOW',
        economia: isEconomia ? 'HIGH' : 'MEDIUM',
        cuidado: isEmbarazo ? 'HIGH' : 'LOW',
        vivienda: textLower.includes('sola') || textLower.includes('arriendo') ? 'MEDIUM' : 'LOW',
        educacion: textLower.includes('estudi') || textLower.includes('aprender') ? 'HIGH' : 'MEDIUM',
        redApoyo: isViolencia || textLower.includes('sola') ? 'HIGH' : 'LOW',
      },
      rightsMap: [
        {
          category: 'Salud & SSR',
          title: isEmbarazo ? 'Atención Prenatal Inmediata & Control Nutricional' : 'Orientación Integral SSR',
          route: 'IPS Red Pública Cartagena + Fundación Senda Mujer',
          norm: 'Resolución Intersectorial 1350 de 2026 (Política SSR 2026-2035)',
          priority: 'HIGH',
        },
        {
          category: 'Protección Integral',
          title: isViolencia ? 'Ruta Prioritaria de Medidas de Protección' : 'Orientación Preventiva',
          route: 'Comisaría de Familia + Casa de Justicia Chiquinquirá + 155',
          norm: 'Ley 1257 de 2008 & CONPES 4080',
          priority: isViolencia ? 'HIGH' : 'MEDIUM',
        },
        {
          category: 'Autonomía Económica',
          title: isEconomia ? 'Capacitación Técnica & Programa Capital Semilla' : 'Formación en Habilidades',
          route: 'SendaAcademia + Red de Emprendimiento Femenino',
          norm: 'CONPES 4080 (Autonomía Económica)',
          priority: 'MEDIUM',
        },
      ],
    };

    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error('Error in Senda Policy Engine API:', error);
    return NextResponse.json(
      { error: 'Error procesando la política' },
      { status: 500 }
    );
  }
}
