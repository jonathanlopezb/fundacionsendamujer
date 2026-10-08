import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmPerson,
  CrmCase,
  CrmDonation,
  CrmOperation,
  CrmExpense,
  CrmTask,
  CrmProgramEnrollment,
  CrmAidDelivery,
} from '@/lib/crm/models';
import { requireCrmAuth } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const user = auth.user;

    // Conteo de personas
    const totalPeople = await CrmPerson.countDocuments({ status: 'ACTIVE' });

    // Conteo de casos
    let caseQuery: Record<string, any> = {};
    if (['TRABAJADOR_SOCIAL', 'PSICOLOGO', 'ABOGADO'].includes(user.role)) {
      caseQuery.responsibleUserId = user.userId;
    }

    const [activeCases, closedCases, criticalCases] = await Promise.all([
      CrmCase.countDocuments({ ...caseQuery, status: { $ne: 'CLOSED' } }),
      CrmCase.countDocuments({ ...caseQuery, status: 'CLOSED' }),
      CrmCase.countDocuments({ ...caseQuery, priority: { $in: ['HIGH', 'CRITICAL'] }, status: { $ne: 'CLOSED' } }),
    ]);

    // Métricas de Donaciones (solo si tiene permiso de finanzas/donaciones o es directiva/superadmin)
    let totalDonationsAmount = 0;
    let totalDonationsCount = 0;
    if (['SUPER_ADMIN', 'DIRECTORA', 'GESTOR_DONANTES', 'GESTOR_FINANCIERO', 'COORDINADOR'].includes(user.role)) {
      const donationStats = await CrmDonation.aggregate([
        { $match: { status: 'CONFIRMED' } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]);
      if (donationStats.length > 0) {
        totalDonationsAmount = donationStats[0].total;
        totalDonationsCount = donationStats[0].count;
      }
    }

    // Métricas Financieras (Gastos aprobados/ejecutados)
    let totalExpensesAmount = 0;
    if (['SUPER_ADMIN', 'DIRECTORA', 'GESTOR_FINANCIERO', 'COORDINADOR'].includes(user.role)) {
      const expenseStats = await CrmExpense.aggregate([
        { $match: { status: { $in: ['APPROVED', 'PAID'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      if (expenseStats.length > 0) {
        totalExpensesAmount = expenseStats[0].total;
      }
    }

    // Operaciones y Programas
    const [scheduledOperations, completedOperations, activeEnrollments, totalAidsDelivered] = await Promise.all([
      CrmOperation.countDocuments({ status: 'SCHEDULED' }),
      CrmOperation.countDocuments({ status: 'COMPLETED' }),
      CrmProgramEnrollment.countDocuments({ status: { $in: ['ENROLLED', 'IN_PROGRESS'] } }),
      CrmAidDelivery.countDocuments({ status: 'DELIVERED' }),
    ]);

    // Tareas pendientes del usuario
    const pendingTasks = await CrmTask.find({
      assignedToUserId: user.userId,
      status: { $in: ['TODO', 'IN_PROGRESS'] },
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();

    // Casos recientes
    const recentCases = await CrmCase.find(caseQuery)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Donaciones recientes (si aplica)
    let recentDonations: any[] = [];
    if (['SUPER_ADMIN', 'DIRECTORA', 'GESTOR_DONANTES', 'GESTOR_FINANCIERO'].includes(user.role)) {
      recentDonations = await CrmDonation.find({ status: 'CONFIRMED' })
        .sort({ receivedAt: -1 })
        .limit(5)
        .lean();
    }

    // Tendencia mensual — últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const MONTH_LABELS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

    const [casesByMonth, personasByMonth, donationsByMonth] = await Promise.all([
      CrmCase.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.y': 1, '_id.m': 1 } },
      ]),
      CrmPerson.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.y': 1, '_id.m': 1 } },
      ]),
      (['SUPER_ADMIN', 'DIRECTORA', 'GESTOR_DONANTES', 'GESTOR_FINANCIERO', 'COORDINADOR'].includes(user.role)
        ? CrmDonation.aggregate([
            { $match: { receivedAt: { $gte: sixMonthsAgo }, status: 'CONFIRMED' } },
            { $group: { _id: { y: { $year: '$receivedAt' }, m: { $month: '$receivedAt' } }, total: { $sum: '$amount' } } },
            { $sort: { '_id.y': 1, '_id.m': 1 } },
          ])
        : Promise.resolve([])),
    ]);

    // Construir array de 6 meses
    const monthlyTrend: any[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const mes = MONTH_LABELS[m - 1];
      const casos = casesByMonth.find((x: any) => x._id.y === y && x._id.m === m)?.count || 0;
      const personas = personasByMonth.find((x: any) => x._id.y === y && x._id.m === m)?.count || 0;
      const donaciones = donationsByMonth.find((x: any) => x._id.y === y && x._id.m === m)?.total || 0;
      monthlyTrend.push({ mes, casos, personas, donaciones });
    }

    // Casos por tipo
    const caseTypeAgg = await CrmCase.aggregate([
      { $group: { _id: '$type', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    const casesByType = caseTypeAgg.map((x: any) => ({ name: x._id || 'Sin tipo', value: x.value }));

    return NextResponse.json({
      metrics: {
        totalPeople,
        activeCases,
        closedCases,
        criticalCases,
        totalDonationsAmount,
        totalDonationsCount,
        totalExpensesAmount,
        scheduledOperations,
        completedOperations,
        activeEnrollments,
        totalAidsDelivered,
      },
      pendingTasks,
      recentCases,
      recentDonations,
      monthlyTrend,
      casesByType,
    });
  } catch (error: any) {
    console.error('Error al generar métricas del dashboard CRM:', error);
    return NextResponse.json({ error: 'Error al consultar métricas del dashboard' }, { status: 500 });
  }
}

