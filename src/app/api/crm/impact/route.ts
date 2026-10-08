import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmPerson,
  CrmCase,
  CrmProgramEnrollment,
  CrmAidDelivery,
  CrmOperation,
  CrmDonation,
  CrmVolunteer,
} from '@/lib/crm/models';
import { requireCrmAuth } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'reports.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();

    const [
      totalWomenServed,
      casesByOutcome,
      camEnrollmentsByLine,
      aidDeliveriesByType,
      totalVolunteerHours,
      donationsByMonth,
    ] = await Promise.all([
      // 1. Total mujeres atendidas
      CrmPerson.countDocuments({ status: 'ACTIVE' }),

      // 2. Casos cerrados con resolución positiva
      CrmCase.aggregate([
        { $match: { status: 'CLOSED' } },
        { $group: { _id: '$type', total: { $sum: 1 } } },
      ]),

      // 3. Inscripciones CAM por línea productiva
      CrmProgramEnrollment.aggregate([
        { $group: { _id: '$productiveLine', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // 4. Entregas de ayuda por tipo
      CrmAidDelivery.aggregate([
        { $group: { _id: '$type', totalCount: { $sum: '$quantity' }, totalValue: { $sum: '$value' } } },
        { $sort: { totalCount: -1 } },
      ]),

      // 5. Total horas voluntariado
      CrmVolunteer.aggregate([
        { $group: { _id: null, totalHours: { $sum: '$hoursTotal' }, count: { $sum: 1 } } },
      ]),

      // 6. Donaciones confirmadas acumuladas
      CrmDonation.aggregate([
        { $match: { status: 'CONFIRMED' } },
        {
          $group: {
            _id: { $month: '$receivedAt' },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return NextResponse.json({
      impact: {
        totalWomenServed,
        casesByOutcome,
        camEnrollmentsByLine,
        aidDeliveriesByType,
        volunteering: totalVolunteerHours[0] || { totalHours: 0, count: 0 },
        donationsByMonth,
        calculatedAt: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Error al generar impacto CRM:', error);
    return NextResponse.json({ error: 'Error al consultar impacto' }, { status: 500 });
  }
}
