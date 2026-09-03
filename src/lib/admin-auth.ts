import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'senda_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = { professionalId: string; role: string; exp: number };

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.GROQ_API_KEY || 'change-this-admin-session-secret';
}

function sign(value: string) {
  return createHmac('sha256', getSecret()).update(value).digest('base64url');
}

export function createAdminSession(payload: Omit<SessionPayload, 'exp'>) {
  const encoded = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function readAdminSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

export function isSuperAdminSession() {
  return readAdminSession()?.role === 'ADMIN_SISTEMA';
}

export { COOKIE_NAME, SESSION_TTL_SECONDS };
