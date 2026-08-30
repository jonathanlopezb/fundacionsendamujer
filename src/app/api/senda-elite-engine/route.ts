import { NextResponse } from 'next/server';
import { groq } from '@/lib/groq';

const ELITE_SYSTEM_PROMPT = `Eres el SENDA Elite Rights Engine — el sistema de análisis de derechos humanos más avanzado de Colombia para mujeres en vulnerabilidad.

MARCO LEGAL QUE MANEJAS CON PRECISIÓN:
- CONPES 4080/2022: 6 ejes — Autonomía Económica, Participación, Salud Integral, Vida Libre de Violencias, Paz y Seguridad, Institucionalidad
- CONPES 4143/2025: Política Nacional de Cuidado — Sistema Nacional de Cuidado (Ley 2281/2023)
- Ley 1257/2008: Arts. 2, 8, 16, 17-19 — Tipos de violencia, derechos víctimas, medidas protección
- Ley 1959/2019: Violencia intrafamiliar agravada
- Sentencias C-055/2022 y C-355/2006: IVE autonomía reproductiva
- Ley 2244/2022: Parto Digno — Art. 3 violencia obstétrica
- Política SSR 2026-2035 (Res. 1350/2026): Salud sexual y reproductiva
- Ley 1413/2010: Economía del cuidado no remunerado
- Ley 1537/2012 + Decreto 1077/2015: Vivienda de Interés Social prioritaria
- Art. 51 Constitución: Derecho a vivienda digna
- Resolución 3280/2018: Atención en salud SSR sin barreras
- Ley 1098/2006: Código Infancia y Adolescencia (si hay menores)
- Decreto 1930/2013: Plan igualdad oportunidades

INSTITUCIONES CARTAGENA CON DATOS REALES:
- Línea Emergencias: 123
- Fiscalía (denuncia): 122
- ICBF menores: 141
- Patrulla Púrpura Policía Cartagena: activa 24/7
- Casa Violeta: Refugio Cartagena (2024) — vía Comisaría o Fiscalía
- Comisarías de Familia: Localidades 1, 2 y 3 Cartagena
- Casas de Justicia: Chiquinquirá, La Candelaria
- ESE Clínica Maternidad Rafael Calvo: salud materna
- SENA Cartagena: formación gratuita
- Defensoría del Pueblo Bolívar: orientación jurídica gratuita

Responde ÚNICAMENTE en JSON válido con exactamente esta estructura:
{
  "nivelCrisis": "CRÍTICO" | "ALTO" | "MODERADO" | "PREVENTIVO",
  "mensajePersonalizado": "mensaje cálido y empático de 2-3 oraciones dirigido directamente a la mujer",
  "scoreDimensiones": {
    "violencia": { "nivel": 0-100, "texto": "descripción breve" },
    "salud": { "nivel": 0-100, "texto": "descripción breve" },
    "economia": { "nivel": 0-100, "texto": "descripción breve" },
    "cuidado": { "nivel": 0-100, "texto": "descripción breve" },
    "vivienda": { "nivel": 0-100, "texto": "descripción breve" },
    "educacion": { "nivel": 0-100, "texto": "descripción breve" },
    "redApoyo": { "nivel": 0-100, "texto": "descripción breve" }
  },
  "accionesInmediatas": [
    {
      "prioridad": "URGENTE" | "ALTA" | "MEDIA" | "PREVENTIVA",
      "area": "nombre del área",
      "titulo": "título de la acción",
      "descripcion": "qué hacer exactamente, paso a paso",
      "institucion": "institución específica en Cartagena",
      "contacto": "teléfono o dirección real",
      "norma": "norma legal específica con artículo",
      "plazo": "Inmediato (0-24h)" | "Urgente (1-7 días)" | "Corto plazo (1-4 semanas)" | "Mediano plazo (1-3 meses)"
    }
  ],
  "rutaIntegral": {
    "semana1": ["acción 1", "acción 2"],
    "mes1": ["acción 1", "acción 2"],
    "mes3": ["acción 1", "acción 2"]
  },
  "derechosGarantizados": [
    {
      "derecho": "nombre del derecho",
      "descripcion": "qué garantiza",
      "norma": "ley o sentencia específica"
    }
  ],
  "alertaCrisis": true | false,
  "mensajeCrisis": "solo si alertaCrisis es true, mensaje de seguridad urgente"
}`;

export async function POST(req: Request) {
  try {
    const { answers, code } = await req.json();

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers object required' }, { status: 400 });
    }

    const narrativeForAI = `
Mujer que completó el diagnóstico SENDA. Código: ${code}

PERFIL COMPLETO:
- Edad: ${answers.edad || 'No indicada'}
- Situación urgente: ${answers.urgencia || 'No indicada'}
- Hijos/dependientes: ${answers.cuidado || 'No indicado'}
- Situación económica: ${answers.economia || 'No indicada'}
- Vivienda: ${answers.vivienda || 'No indicada'}
- Violencia sufrida: ${answers.violencia || 'No indicada'}
- Acceso a salud: ${answers.salud || 'No indicado'}
- Nivel educativo: ${answers.educacion || 'No indicado'}
- Red de apoyo: ${answers.redApoyo || 'No indicada'}
- Relación con instituciones: ${answers.institucional || 'No indicada'}
- Meta en 3 meses: ${answers.meta || 'No indicada'}
- Ubicación: ${answers.ubicacion || 'No indicada'}

Analiza esta situación completa y genera el informe élite de derechos y ruta de acción integral.`;

    if (groq) {
      try {
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: ELITE_SYSTEM_PROMPT },
            { role: 'user', content: narrativeForAI },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        });

        const raw = response.choices[0]?.message?.content || '{}';
        try {
          const parsed = JSON.parse(raw);
          return NextResponse.json(parsed);
        } catch {
          console.warn('JSON parse error from primary Groq response, falling back');
        }
      } catch (groqErr: any) {
        console.warn('Primary Groq model failed in senda-elite-engine, attempting fallback:', groqErr?.message || groqErr);
        try {
          const fallbackResp = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: ELITE_SYSTEM_PROMPT },
              { role: 'user', content: narrativeForAI },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          });
          const rawFallback = fallbackResp.choices[0]?.message?.content || '{}';
          const parsedFallback = JSON.parse(rawFallback);
          return NextResponse.json(parsedFallback);
        } catch (secondaryGroqErr: any) {
          console.error('Secondary Groq model failed in senda-elite-engine:', secondaryGroqErr?.message || secondaryGroqErr);
        }
      }
    }

    // Fallback if Groq is unavailable or returns an invalid payload
    return NextResponse.json(buildFallback(answers));
  } catch (err: any) {
    console.error('Elite engine error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function buildFallback(a: Record<string, string>) {
  const hasViolence = a.violencia && a.violencia !== 'No';
  const hasPregnancy = a.salud === 'Estoy en control prenatal' || a.urgencia === 'Embarazo sin apoyo';
  const noIncome = a.economia === 'Sin ningún ingreso';
  return {
    nivelCrisis: hasViolence ? 'ALTO' : noIncome ? 'MODERADO' : 'PREVENTIVO',
    mensajePersonalizado: 'Gracias por confiar en la Fundación Senda Mujer. Hemos analizado tu situación y hemos preparado un plan personalizado de acción. No estás sola en este camino.',
    scoreDimensiones: {
      violencia: { nivel: hasViolence ? 80 : 20, texto: hasViolence ? 'Situación de riesgo identificada' : 'Sin indicadores de violencia activa' },
      salud: { nivel: hasPregnancy ? 85 : 50, texto: hasPregnancy ? 'Atención prenatal prioritaria requerida' : 'Revisión preventiva recomendada' },
      economia: { nivel: noIncome ? 90 : 40, texto: noIncome ? 'Vulnerabilidad económica crítica' : 'Estabilidad económica moderada' },
      cuidado: { nivel: 60, texto: 'Red de cuidado en construcción' },
      vivienda: { nivel: 50, texto: 'Situación habitacional a evaluar' },
      educacion: { nivel: 55, texto: 'Oportunidades de formación disponibles' },
      redApoyo: { nivel: 45, texto: 'Red de apoyo en fortalecimiento' },
    },
    accionesInmediatas: [
      {
        prioridad: hasViolence ? 'URGENTE' : 'ALTA',
        area: hasViolence ? 'Protección y Seguridad' : 'Salud Integral',
        titulo: hasViolence ? 'Activar Medida de Protección Inmediata' : 'Vinculación al Sistema de Salud',
        descripcion: hasViolence
          ? 'Acude a la Comisaría de Familia más cercana o llama al 123. Puedes solicitar medida de protección sin costo y el Estado está obligado a atenderte (Art. 16 Ley 1257/2008).'
          : 'Verifica tu afiliación al sistema de salud. Si no tienes EPS activa, acude al hospital más cercano para vinculación al régimen subsidiado.',
        institucion: hasViolence ? 'Comisaría de Familia Cartagena / Casa Violeta' : 'ESE Hospital Local Cartagena',
        contacto: hasViolence ? '123 (Emergencias) / 122 (Fiscalía)' : 'Secretaría de Salud Cartagena',
        norma: hasViolence ? 'Ley 1257/2008 Arts. 16-19 — Medidas de Protección' : 'Política SSR 2026-2035 Res. 1350/2026',
        plazo: hasViolence ? 'Inmediato (0-24h)' : 'Urgente (1-7 días)',
      },
    ],
    rutaIntegral: {
      semana1: ['Verificar situación de seguridad personal', 'Acceder a orientación jurídica gratuita en Fundación Senda Mujer'],
      mes1: ['Regularizar acceso a sistema de salud', 'Inscribirse en programa de formación SendaAcademia'],
      mes3: ['Iniciar proceso de autonomía económica', 'Fortalecer red de apoyo social'],
    },
    derechosGarantizados: [
      { derecho: 'Vida libre de violencias', descripcion: 'El Estado debe protegerte de toda forma de violencia', norma: 'Ley 1257/2008' },
      { derecho: 'Salud Sexual y Reproductiva', descripcion: 'Atención en salud SSR sin barreras ni discriminación', norma: 'Política SSR 2026-2035' },
      { derecho: 'Autonomía Económica', descripcion: 'Acceso a formación, empleo y recursos productivos', norma: 'CONPES 4080 Eje 1' },
    ],
    alertaCrisis: hasViolence,
    mensajeCrisis: hasViolence ? 'Si estás en peligro inmediato, llama al 123 ahora. La Casa Violeta de Cartagena es un refugio seguro disponible.' : '',
  };
}
