import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CrmTask } from '@/lib/crm/models';
import { requireCrmAuth, logCrmAudit } from '@/lib/crm/auth';

export async function GET(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'tasks.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'mine'; // 'mine' | 'all'

    const query: Record<string, any> = {};
    if (filter === 'mine' && auth.user.role !== 'SUPER_ADMIN' && auth.user.role !== 'DIRECTORA') {
      query.assignedToUserId = auth.user.userId;
    }

    const tasks = await CrmTask.find(query).sort({ dueDate: 1 }).lean();
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('Error al consultar tareas CRM:', error);
    return NextResponse.json({ error: 'Error al consultar tareas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'tasks.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, description, assignedToUserId, assignedToName, priority = 'MEDIUM', dueDate, relatedEntityType, relatedEntityId } = body;

    if (!title || !description || !assignedToUserId || !dueDate) {
      return NextResponse.json({ error: 'Título, descripción, responsable y fecha límite son obligatorios' }, { status: 400 });
    }

    const task = await CrmTask.create({
      title: title.trim(),
      description: description.trim(),
      assignedToUserId,
      assignedToName: assignedToName?.trim() || 'Profesional',
      createdByUserId: auth.user.userId,
      priority,
      dueDate: new Date(dueDate),
      relatedEntityType,
      relatedEntityId,
      status: 'TODO',
    });

    return NextResponse.json({ success: true, message: 'Tarea creada exitosamente', task });
  } catch (error: any) {
    console.error('Error al crear tarea CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al crear tarea' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireCrmAuth(req, 'tasks.manage');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const task = await CrmTask.findById(id);
    if (!task) return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });

    task.status = status;
    if (status === 'COMPLETED') {
      task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }

    await task.save();

    return NextResponse.json({ success: true, message: 'Estado de tarea actualizado', task });
  } catch (error: any) {
    console.error('Error al actualizar tarea CRM:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar tarea' }, { status: 500 });
  }
}
