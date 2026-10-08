import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmDonation,
  CrmDonor,
  CrmCampaign,
  getNextSequence,
} from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'donations.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'donations'; // 'donations' | 'donors' | 'campaigns'

    if (view === 'donors') {
      const donors = await CrmDonor.find({}).sort({ totalDonated: -1 }).lean();
      return NextResponse.json({ donors });
    }

    if (view === 'campaigns') {
      const campaigns = await CrmCampaign.find({}).sort({ startDate: -1 }).lean();
      return NextResponse.json({ campaigns });
    }

    const donations = await CrmDonation.find({}).sort({ receivedAt: -1 }).lean();
    return NextResponse.json({ donations });
  } catch (error: any) {
    console.error('Error al consultar donaciones CRM:', error);
    return NextResponse.json({ error: 'Error al consultar donaciones' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'donations.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const actionType = body.actionType || 'donation';

    if (actionType === 'campaign') {
      const { name, description, goalAmount, startDate, endDate } = body;
      if (!name || !goalAmount) {
        return NextResponse.json({ error: 'Nombre y meta de recaudación son requeridos' }, { status: 400 });
      }

      const campaign = await CrmCampaign.create({
        name: name.trim(),
        description: description?.trim() || '',
        goalAmount: Number(goalAmount),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : undefined,
        status: 'ACTIVE',
      });

      return NextResponse.json({ success: true, message: 'Campaña creada exitosamente', campaign });
    }

    // Default: Registrar Donación
    const { donorName, donorEmail, donorPhone, donorType = 'INDIVIDUAL', type = 'MONEY', amount, currency = 'COP', paymentMethod, campaignId, projectId, notes } = body;

    if (!donorName || !donorEmail || !amount) {
      return NextResponse.json({ error: 'Nombre de donante, correo y monto son obligatorios' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      return NextResponse.json({ error: 'El monto de la donación debe ser mayor a 0' }, { status: 400 });
    }

    const receiptNumber = await getNextSequence('receipt', 'REC');

    // Buscar o registrar donor
    let donor = await CrmDonor.findOne({ contactEmail: donorEmail.trim().toLowerCase() });
    if (!donor) {
      donor = await CrmDonor.create({
        donorType,
        companyName: donorType !== 'INDIVIDUAL' ? donorName : undefined,
        contactEmail: donorEmail.trim().toLowerCase(),
        contactPhone: donorPhone?.trim(),
        totalDonated: numericAmount,
        donationsCount: 1,
        lastDonationAt: new Date(),
        status: 'ACTIVE',
      });
    } else {
      donor.totalDonated += numericAmount;
      donor.donationsCount += 1;
      donor.lastDonationAt = new Date();
      await donor.save();
    }

    const donation = await CrmDonation.create({
      receiptNumber,
      donorId: donor._id.toString(),
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim().toLowerCase(),
      type,
      amount: numericAmount,
      currency,
      paymentMethod: paymentMethod || 'Transferencia Bancaria',
      campaignId,
      projectId,
      status: 'CONFIRMED',
      receivedAt: new Date(),
      certificateGenerated: true,
      notes: notes?.trim(),
    });

    // Actualizar recaudado de campaña si aplica
    if (campaignId) {
      await CrmCampaign.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: numericAmount } });
    }

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'RECORD_DONATION',
      'CrmDonation',
      donation._id.toString(),
      { receiptNumber: donation.receiptNumber, amount: numericAmount, currency, donorName },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Donación confirmada y recibo generado exitosamente',
      donation,
      receiptNumber,
    });
  } catch (error: any) {
    console.error('Error al registrar donación CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al registrar donación' }, { status: 500 });
  }
}
