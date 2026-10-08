import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmUser, CrmAuditLog } from './models';
import { CrmRole, Permission, hasPermission } from './permissions';

export const CRM_COOKIE_NAME = 'senda_crm_session';
export const CRM_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 horas

export interface CrmSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: CrmRole;
  scopes: {
    programIds: string[];
    projectIds: string[];
  };
  exp: number;
}

function getSecretKey(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.GROQ_API_KEY || 'senda-mujer-crm-super-secret-key-2026';
}

function signToken(value: string): string {
  return createHmac('sha256', getSecretKey()).update(value).digest('base64url');
}

export function createCrmSessionToken(payload: Omit<CrmSessionPayload, 'exp'>): string {
  const fullPayload: CrmSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + CRM_SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = signToken(encoded);
  return `${encoded}.${signature}`;
}

export function verifyCrmSessionToken(token: string): CrmSessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  const expected = signToken(encoded);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as CrmSessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getCrmServerSession(): CrmSessionPayload | null {
  const token = cookies().get(CRM_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCrmSessionToken(token);
}

export function getCrmRequestSession(req: NextRequest): CrmSessionPayload | null {
  const token = req.cookies.get(CRM_COOKIE_NAME)?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyCrmSessionToken(token);
}

export async function isFirstRun(): Promise<boolean> {
  await connectToDatabase();
  const userCount = await CrmUser.countDocuments();
  return userCount === 0;
}

export async function logCrmAudit(
  user: { userId?: string; name?: string; role?: string } | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>,
  ip?: string
) {
  try {
    await connectToDatabase();
    await CrmAuditLog.create({
      userId: user?.userId,
      userName: user?.name || 'Invitado / Sistema',
      userRole: user?.role || 'SYSTEM',
      action,
      entity,
      entityId,
      details,
      ip: ip || '127.0.0.1',
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('⚠️ Error al registrar log de auditoría CRM:', err);
  }
}

export async function requireCrmAuth(
  req: NextRequest,
  requiredPermission?: Permission
): Promise<{ user: CrmSessionPayload; errorResponse?: never } | { user?: never; errorResponse: NextResponse }> {
  const session = getCrmRequestSession(req);

  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { error: 'No autenticado en el CRM', code: 'UNAUTHORIZED' },
        { status: 401 }
      ),
    };
  }

  if (requiredPermission && !hasPermission(session.role, requiredPermission)) {
    return {
      errorResponse: NextResponse.json(
        {
          error: `Acceso denegado: El rol '${session.role}' no cuenta con el permiso requerido '${requiredPermission}'`,
          code: 'FORBIDDEN',
        },
        { status: 403 }
      ),
    };
  }

  return { user: session };
}
