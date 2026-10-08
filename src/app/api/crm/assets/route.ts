import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmAsset, CrmAidDelivery, getNextSequence } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'assets.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'assets'; // 'assets' | 'deliveries'

    if (view === 'deliveries') {
      const deliveries = await CrmAidDelivery.find({}).sort({ deliveryDate: -1 }).lean();
      return NextResponse.json({ deliveries });
    }

    const assets = await CrmAsset.find({}).sort({ purchaseDate: -1 }).lean();
    return NextResponse.json({ assets });
  } catch (error: any) {
    console.error('Error al consultar activos CRM:', error);
    return NextResponse.json({ error: 'Error al consultar inventario' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'assets.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const actionType = body.actionType || 'asset';

    if (actionType === 'delivery') {
      const { personId, personName, householdId, type, quantity, value, notes } = body;
      if (!personId || !personName || !type) {
        return NextResponse.json({ error: 'Persona y tipo de ayuda son obligatorios' }, { status: 400 });
      }

      const delivery = await CrmAidDelivery.create({
        personId,
        personName: personName.trim(),
        householdId,
        type,
        quantity: Number(quantity) || 1,
        value: Number(value) || 0,
        deliveryDate: new Date(),
        responsibleUserName: auth.user.name,
        status: 'DELIVERED',
        notes: notes?.trim(),
      });

      await logCrmAudit(
        { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
        'RECORD_AID_DELIVERY',
        'CrmAidDelivery',
        delivery._id.toString(),
        { personName, type, quantity: delivery.quantity },
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      );

      return NextResponse.json({ success: true, message: 'Entrega de ayuda registrada exitosamente', delivery });
    }

    // Default: Activo Fijo / Dotación
    const { name, category, value, location, assignedTo, condition = 'GOOD' } = body;
    if (!name || !category) {
      return NextResponse.json({ error: 'Nombre y categoría de activo son requeridos' }, { status: 400 });
    }

    const assetNumber = await getNextSequence('asset', 'ACT');

    const asset = await CrmAsset.create({
      assetNumber,
      name: name.trim(),
      category,
      purchaseDate: new Date(),
      value: Number(value) || 0,
      location: location?.trim() || 'Sede Principal Cartagena',
      assignedTo: assignedTo?.trim(),
      status: 'AVAILABLE',
      condition,
    });

    return NextResponse.json({ success: true, message: 'Activo inventariado exitosamente', asset });
  } catch (error: any) {
    console.error('Error al registrar activo CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al procesar activo' }, { status: 500 });
  }
}
