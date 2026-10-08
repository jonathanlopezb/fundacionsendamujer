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
    });
  } catch (error: any) {
    console.error('Error al generar métricas del dashboard CRM:', error);
    return NextResponse.json({ error: 'Error al consultar métricas del dashboard' }, { status: 500 });
  }
}
