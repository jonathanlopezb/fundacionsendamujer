import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { CmsUserRole } from './models/CmsUser';

const CMS_COOKIE_NAME = 'senda_cms_session';
const CMS_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas

export interface CmsSessionPayload {
  userId: string;
  fullName: string;
  email: string;
  username: string;
  role: CmsUserRole;
  exp: number;
}

function getCmsSecret(): string {
  return (
    process.env.CMS_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    process.env.GROQ_API_KEY ||
    'senda-mujer-cms-hyper-secure-secret-key-2026'
  );
}

function signValue(value: string): string {
  return createHmac('sha256', getCmsSecret()).update(value).digest('base64url');
}

export function createCmsSession(payload: Omit<CmsSessionPayload, 'exp'>): string {
  const data: CmsSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + CMS_SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = signValue(encoded);
  return `${encoded}.${signature}`;
}

export function readCmsSession(): CmsSessionPayload | null {
  try {
    const token = cookies().get(CMS_COOKIE_NAME)?.value;
    if (!token) return null;

    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) return null;

    const expectedSignature = signValue(encoded);
    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as CmsSessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isCmsSuperAdmin(): boolean {
  const session = readCmsSession();
  return session?.role === 'SUPER_ADMIN';
}

export function isCmsAuthorized(): boolean {
  const session = readCmsSession();
  return !!session && ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(session.role);
}

export { CMS_COOKIE_NAME, CMS_SESSION_TTL_SECONDS };
