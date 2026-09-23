import { NextResponse } from 'next/server';
import { readCmsSession } from '@/lib/cms-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = readCmsSession();

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      fullName: session.fullName,
      email: session.email,
      username: session.username,
      role: session.role,
    },
  });
}
