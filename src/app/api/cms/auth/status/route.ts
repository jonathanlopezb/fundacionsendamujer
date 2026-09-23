import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CmsUser from '@/lib/models/CmsUser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const count = await CmsUser.countDocuments();
    return NextResponse.json({
      hasSuperAdmin: count > 0,
      totalUsers: count,
    });
  } catch (error: any) {
    console.warn('⚠️ Error al consultar estado de CMS users:', error.message);
    // Fallback seguro: Si no conecta a mongo o es primer arranque
    return NextResponse.json({
      hasSuperAdmin: false,
      totalUsers: 0,
    });
  }
}
