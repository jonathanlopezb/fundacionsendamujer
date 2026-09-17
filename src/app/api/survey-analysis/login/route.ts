import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, createSurveyAnalysisSession, SESSION_TTL_SECONDS } from '@/lib/survey-analysis-auth';

function matchesAccessKey(value: string, expected: string) {
  const supplied = Buffer.from(value);
  const configured = Buffer.from(expected);
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

export async function POST(request: NextRequest) {
  const accessKey = process.env.SURVEY_ANALYSIS_ACCESS_KEY;
  if (!accessKey || !process.env.SURVEY_ANALYSIS_SESSION_SECRET) {
    return NextResponse.json({ success: false, message: 'El acceso privado no está configurado.' }, { status: 503 });
  }
  try {
    const body = await request.json();
    if (typeof body.accessKey !== 'string' || !matchesAccessKey(body.accessKey, accessKey)) {
      return NextResponse.json({ success: false, message: 'Llave de acceso inválida.' }, { status: 401 });
    }
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, createSurveyAnalysisSession(), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: SESSION_TTL_SECONDS, path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'No fue posible procesar el acceso.' }, { status: 400 });
  }
}
