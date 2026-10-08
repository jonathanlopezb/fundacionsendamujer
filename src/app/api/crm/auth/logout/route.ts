import { NextResponse } from 'next/server';
import { CRM_COOKIE_NAME } from '@/lib/crm/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });
  response.cookies.set(CRM_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
