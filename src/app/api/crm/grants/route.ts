import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmGrantApplication } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'grants.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const grants = await CrmGrantApplication.find({}).sort({ deadline: 1 }).lean();
    return NextResponse.json({ grants });
  } catch (error: any) {
    console.error('Error al consultar subvenciones CRM:', error);
    return NextResponse.json({ error: 'Error al consultar subvenciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'grants.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, funderName, country = 'Colombia', deadline, requestedAmount, approvedAmount, currency = 'COP', status = 'IDENTIFIED', projectId } = body;

    if (!title || !funderName || !deadline || !requestedAmount) {
      return NextResponse.json({ error: 'Título, financiador, fecha límite y monto solicitado son requeridos' }, { status: 400 });
    }

    const grant = await CrmGrantApplication.create({
      title: title.trim(),
      funderName: funderName.trim(),
      country: country.trim(),
      deadline: new Date(deadline),
      requestedAmount: Number(requestedAmount),
      approvedAmount: approvedAmount ? Number(approvedAmount) : undefined,
      currency,
      status,
      responsibleUserId: auth.user.userId,
      projectId,
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_GRANT_APPLICATION',
      'CrmGrantApplication',
      grant._id.toString(),
      { title: grant.title, funder: grant.funderName, requestedAmount: grant.requestedAmount },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({ success: true, message: 'Propuesta de subvención registrada', grant });
  } catch (error: any) {
    console.error('Error al registrar subvención CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar subvención' }, { status: 500 });
  }
}
