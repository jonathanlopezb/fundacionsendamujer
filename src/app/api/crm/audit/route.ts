import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmAuditLog } from '@/lib/crm/models';
import { requireCrmAuth } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'audit.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const entity = searchParams.get('entity');

    const query: Record<string, any> = {};
    if (entity) {
      query.entity = entity;
    }

    const logs = await CrmAuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Error al consultar logs de auditoría CRM:', error);
    return NextResponse.json({ error: 'Error al consultar auditoría' }, { status: 500 });
  }
}
