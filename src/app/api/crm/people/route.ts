import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmPerson, getNextSequence } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';
import { createHash } from 'crypto';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'people.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const roleFilter = searchParams.get('role');
    const status = searchParams.get('status') || 'ACTIVE';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const query: Record<string, any> = {};
    if (status !== 'ALL') {
      query.status = status;
    }
    if (roleFilter) {
      query.roles = roleFilter;
    }

    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: regex },
        { lastName: regex },
        { phone: regex },
        { email: regex },
        { code: regex },
        { 'address.neighborhood': regex },
        { documentNumber: regex },
      ];
    }

    const total = await CrmPerson.countDocuments(query);
    const people = await CrmPerson.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      people,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error al consultar personas CRM:', error);
    return NextResponse.json({ error: 'Error al consultar personas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'people.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      firstName,
      lastName,
      documentType = 'CC',
      documentNumber,
      birthDate,
      gender = 'FEMALE',
      phone,
      email,
      address,
      occupation,
      educationLevel,
      roles = ['BENEFICIARY'],
      protectedIdentity = false,
      pseudonym,
    } = body;

    if (!firstName || !lastName || !documentNumber) {
      return NextResponse.json(
        { error: 'Nombres, apellidos y número de documento son obligatorios' },
        { status: 400 }
      );
    }

    const docHash = createHash('sha256').update(documentNumber.trim().toUpperCase()).digest('hex');

    // Verificar si ya existe una persona con ese documento
    const existing = await CrmPerson.findOne({
      $or: [{ documentNumber: documentNumber.trim() }, { documentNumberHash: docHash }],
    });

    if (existing) {
      return NextResponse.json(
        { error: `Ya existe una persona registrada con el documento ${documentNumber}: ${existing.firstName} ${existing.lastName}` },
        { status: 409 }
      );
    }

    const code = await getNextSequence('person', 'PER');

    const newPerson = await CrmPerson.create({
      code,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      documentType,
      documentNumber: documentNumber.trim(),
      documentNumberHash: docHash,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender,
      phone: phone?.trim(),
      email: email?.trim().toLowerCase(),
      address: {
        street: address?.street?.trim(),
        neighborhood: address?.neighborhood?.trim(),
        city: address?.city?.trim() || 'Cartagena',
        locality: address?.locality?.trim(),
      },
      occupation: occupation?.trim(),
      educationLevel: educationLevel?.trim(),
      roles,
      protectedIdentity: Boolean(protectedIdentity),
      pseudonym: protectedIdentity ? (pseudonym?.trim() || `Identidad Protegida ${code}`) : undefined,
      habeasDataConsent: {
        granted: true,
        grantedAt: new Date(),
        evidenceText: 'Consentimiento informado Ley 1581 de 2012 registrado en CRM Senda Mujer',
      },
      classification: protectedIdentity ? 'RESTRICTED' : 'CONFIDENTIAL',
      status: 'ACTIVE',
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_PERSON',
      'CrmPerson',
      newPerson._id.toString(),
      { code: newPerson.code, name: `${newPerson.firstName} ${newPerson.lastName}`, roles: newPerson.roles },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Persona registrada exitosamente',
      person: newPerson,
    });
  } catch (error: any) {
    console.error('Error al registrar persona CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al registrar persona' }, { status: 500 });
  }
}
