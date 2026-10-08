import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmHousehold, getNextSequence } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'people.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';

    const query: Record<string, any> = {};
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ code: regex }, { neighborhood: regex }, { address: regex }, { observations: regex }];
    }

    const households = await CrmHousehold.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ households });
  } catch (error: any) {
    console.error('Error al consultar hogares CRM:', error);
    return NextResponse.json({ error: 'Error al consultar hogares' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'people.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      address,
      neighborhood,
      locality,
      city = 'Cartagena',
      housingType = 'Propia',
      stratum = 1,
      membersCount = 1,
      childrenCount = 0,
      services = [],
      socioeconomicRisks = [],
      vulnerabilities = [],
      observations,
      headPersonId,
    } = body;

    if (!address || !neighborhood) {
      return NextResponse.json({ error: 'Dirección y barrio son obligatorios' }, { status: 400 });
    }

    const code = await getNextSequence('household', 'HOG');

    const newHousehold = await CrmHousehold.create({
      code,
      headPersonId,
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      locality: locality?.trim(),
      city: city.trim(),
      housingType,
      stratum: Number(stratum) || 1,
      membersCount: Number(membersCount) || 1,
      childrenCount: Number(childrenCount) || 0,
      services,
      socioeconomicRisks,
      vulnerabilities,
      observations: observations?.trim(),
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_HOUSEHOLD',
      'CrmHousehold',
      newHousehold._id.toString(),
      { code: newHousehold.code, neighborhood: newHousehold.neighborhood },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Hogar caracterizado exitosamente',
      household: newHousehold,
    });
  } catch (error: any) {
    console.error('Error al registrar hogar CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al registrar hogar' }, { status: 500 });
  }
}
