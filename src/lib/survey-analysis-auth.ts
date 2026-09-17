import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'senda_survey_analysis_session';
const SESSION_TTL_SECONDS = 60 * 60 * 2;

type AnalysisSession = { scope: 'SURVEY_ANALYSIS'; exp: number };

function secret() {
  return process.env.SURVEY_ANALYSIS_SESSION_SECRET || '';
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

export function createSurveyAnalysisSession() {
  const encoded = Buffer.from(JSON.stringify({ scope: 'SURVEY_ANALYSIS', exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function readSurveyAnalysisSession(): AnalysisSession | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!secret() || !token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as AnalysisSession;
    return payload.scope === 'SURVEY_ANALYSIS' && payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, SESSION_TTL_SECONDS };
