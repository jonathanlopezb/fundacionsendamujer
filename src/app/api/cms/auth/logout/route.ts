import { NextResponse } from 'next/server';
import { CMS_COOKIE_NAME } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente.' });
  response.cookies.delete(CMS_COOKIE_NAME);
  return response;
}
