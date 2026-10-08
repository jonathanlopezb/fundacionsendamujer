import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import {
  CrmExpense,
  CrmAccountPayable,
  CrmPayment,
  getNextSequence,
} from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

const HIGH_APPROVAL_THRESHOLD_COP = 500000; // 500.000 COP exige rol DIRECTORA

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'finance.read');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view') || 'expenses'; // 'expenses' | 'payables' | 'payments'

    if (view === 'payables') {
      const payables = await CrmAccountPayable.find({}).sort({ dueDate: 1 }).lean();
      return NextResponse.json({ payables });
    }

    if (view === 'payments') {
      const payments = await CrmPayment.find({}).sort({ date: -1 }).lean();
      return NextResponse.json({ payments });
    }

    const expenses = await CrmExpense.find({}).sort({ date: -1 }).lean();
    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error('Error al consultar finanzas CRM:', error);
    return NextResponse.json({ error: 'Error al consultar finanzas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'finance.write');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const actionType = body.actionType || 'expense';

    // 1. Aprobar / Rechazar Gasto
    if (actionType === 'approve_expense') {
      const { expenseId, decision } = body; // decision: 'APPROVED' | 'REJECTED'
      const expense = await CrmExpense.findById(expenseId);
      if (!expense) return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 });

      // Verificar segregación de funciones: Quien registra no aprueba
      if (expense.responsibleUserId === auth.user.userId && auth.user.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: 'Segregación de funciones: Quien registra un gasto no puede auto-aprobarlo.' },
          { status: 403 }
        );
      }

      // Umbral de aprobación
      if (expense.amount > HIGH_APPROVAL_THRESHOLD_COP && !['SUPER_ADMIN', 'DIRECTORA'].includes(auth.user.role)) {
        return NextResponse.json(
          { error: `Gastos superiores a $${HIGH_APPROVAL_THRESHOLD_COP.toLocaleString('es-CO')} COP requieren aprobación de la Directora Ejecutiva.` },
          { status: 403 }
        );
      }

      expense.status = decision === 'APPROVED' ? 'APPROVED' : 'REJECTED';
      expense.approvedBy = auth.user.name;
      expense.approvedAt = new Date();
      await expense.save();

      // Si es aprobado, generar automáticamente la cuenta por pagar
      if (decision === 'APPROVED') {
        await CrmAccountPayable.create({
          expenseId: expense._id.toString(),
          providerName: expense.providerName,
          concept: expense.concept,
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días plazo
          totalAmount: expense.amount,
          remainingAmount: expense.amount,
          status: 'PENDING',
        });
      }

      await logCrmAudit(
        { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
        'APPROVE_EXPENSE',
        'CrmExpense',
        expense._id.toString(),
        { expenseNumber: expense.expenseNumber, decision, amount: expense.amount },
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      );

      return NextResponse.json({ success: true, message: `Gasto ${decision === 'APPROVED' ? 'aprobado' : 'rechazado'} exitosamente`, expense });
    }

    // 2. Registrar Pago a Proveedor / Obligación
    if (actionType === 'register_payment') {
      const { accountPayableId, expenseId, providerName, amount, paymentMethod, reference } = body;
      const numericAmount = Number(amount);
      if (!providerName || numericAmount <= 0) {
        return NextResponse.json({ error: 'Proveedor y monto válido son requeridos' }, { status: 400 });
      }

      const paymentNumber = await getNextSequence('payment', 'PAG');

      const payment = await CrmPayment.create({
        paymentNumber,
        accountPayableId,
        expenseId,
        providerName: providerName.trim(),
        date: new Date(),
        amount: numericAmount,
        paymentMethod: paymentMethod || 'Transferencia Bancaria',
        reference: reference?.trim(),
        status: 'REGISTERED',
        registeredBy: auth.user.name,
      });

      // Actualizar saldo de cuenta por pagar si aplica
      if (accountPayableId) {
        const payable = await CrmAccountPayable.findById(accountPayableId);
        if (payable) {
          payable.remainingAmount = Math.max(0, payable.remainingAmount - numericAmount);
          payable.status = payable.remainingAmount === 0 ? 'PAID' : 'PARTIAL';
          await payable.save();
        }
      }

      if (expenseId) {
        await CrmExpense.findByIdAndUpdate(expenseId, { status: 'PAID' });
      }

      await logCrmAudit(
        { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
        'REGISTER_PAYMENT',
        'CrmPayment',
        payment._id.toString(),
        { paymentNumber: payment.paymentNumber, amount: numericAmount, providerName },
        req.headers.get('x-forwarded-for') || '127.0.0.1'
      );

      return NextResponse.json({ success: true, message: 'Pago registrado exitosamente', payment });
    }

    // 3. Crear Gasto Operativo
    const { category, concept, providerName, providerNit, amount, currency = 'COP', projectId, operationId, receiptUrl } = body;

    if (!category || !concept || !providerName || !amount) {
      return NextResponse.json({ error: 'Categoría, concepto, proveedor y monto son obligatorios' }, { status: 400 });
    }

    const numericAmount = Number(amount);
    const expenseNumber = await getNextSequence('expense', 'EXP');

    const expense = await CrmExpense.create({
      expenseNumber,
      date: new Date(),
      category,
      concept: concept.trim(),
      providerName: providerName.trim(),
      providerNit: providerNit?.trim(),
      amount: numericAmount,
      currency,
      projectId,
      operationId,
      responsibleUserId: auth.user.userId,
      responsibleUserName: auth.user.name,
      status: 'IN_REVIEW',
      receiptUrl,
    });

    await logCrmAudit(
      { userId: auth.user.userId, name: auth.user.name, role: auth.user.role },
      'CREATE_EXPENSE',
      'CrmExpense',
      expense._id.toString(),
      { expenseNumber: expense.expenseNumber, amount: numericAmount, concept: expense.concept },
      req.headers.get('x-forwarded-for') || '127.0.0.1'
    );

    return NextResponse.json({
      success: true,
      message: 'Gasto registrado y enviado a revisión',
      expense,
    });
  } catch (error: any) {
    console.error('Error al registrar operación financiera CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error en finanzas' }, { status: 500 });
  }
}
