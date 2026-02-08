import { prisma } from "../prisma/client";
import { resolveDate } from "../utils/dateTimeResolver";

interface CreateTaskData {
  title: string;
  description?: string | null;
  dueAt: Date;
  priority?: string;
  recurrence?: string | null;
  userId: number;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export class TaskRepository {
  create(data: CreateTaskData) {
    return prisma.task.create({
      data: {
        title: data.title.trim().toLowerCase(),
        description: data.description || null,
        dueAt: data.dueAt,
        priority: data.priority || "normal",
        recurrence: data.recurrence || null,
        status: "pending",
        userId: data.userId,
      }
    });
  }

  findAll(userId: number) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { dueAt: "asc" }
    });
  }

  // Find tasks with specific status
  findByStatus(userId: number, status: TaskStatus) {
    return prisma.task.findMany({
      where: { userId, status },
      orderBy: { dueAt: "asc" }
    });
  }

  // Find completed tasks (history)
  findCompleted(userId: number) {
    return prisma.task.findMany({
      where: { userId, status: "completed" },
      orderBy: { completedAt: "desc" }
    });
  }

  // Find tasks completed on a specific date
  findCompletedOnDate(userId: number, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: {
        userId,
        status: "completed",
        completedAt: { gte: start, lte: end }
      },
      orderBy: { completedAt: "desc" }
    });
  }

  findDueToday(userId: number) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: { userId, dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  findDueTomorrow(userId: number) {
    const base = new Date();
    base.setDate(base.getDate() + 1);

    const start = new Date(base);
    start.setHours(0, 0, 0, 0);

    const end = new Date(base);
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: { userId, dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  findDueOnDate(userId: number, date: string) {
    // Use resolveDate to handle natural language dates like "february 7"
    const resolved = resolveDate(date);
    
    const start = resolved.startOf("day").toJSDate();
    const end = resolved.endOf("day").toJSDate();

    return prisma.task.findMany({
      where: { userId, dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  /* ======================================================
     ✅ DUPLICADO = MESMO título NORMALIZADO + MESMO instante
     ====================================================== */
  findDuplicate(userId: number, title: string, dueAt: Date) {
    return prisma.task.findFirst({
      where: {
        userId,
        title: title.trim().toLowerCase(),
        dueAt: dueAt
      }
    });
  }

  deleteById(userId: number, id: number) {
    return prisma.task.delete({ 
      where: { id, userId } 
    });
  }

  findById(userId: number, id: number) {
    return prisma.task.findFirst({ 
      where: { id, userId } 
    });
  }

  updateById(userId: number, id: number, data: { 
    title?: string; 
    description?: string;
    dueAt?: Date; 
    priority?: string; 
    recurrence?: string | null;
    status?: TaskStatus;
  }) {
    return prisma.task.update({
      where: { id, userId },
      data: {
        ...(data.title && { title: data.title.trim().toLowerCase() }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.dueAt && { dueAt: data.dueAt }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.recurrence !== undefined && { recurrence: data.recurrence }),
        ...(data.status !== undefined && { status: data.status }),
      }
    });
  }

  // Mark task as completed
  async markCompleted(userId: number, id: number) {
    return prisma.task.update({
      where: { id, userId },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });
  }

  // Update task status
  async updateStatus(userId: number, id: number, status: TaskStatus) {
    const data: any = { status };
    if (status === "completed") {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }
    return prisma.task.update({
      where: { id, userId },
      data
    });
  }

    /* ======================================================
     🔍 PROCURAR POR TÍTULO (para DELETE inteligente)
     ====================================================== */
  findByTitle(userId: number, title: string) {
    return prisma.task.findMany({
      where: {
        userId,
        title: {
          contains: title.trim().toLowerCase()
        }
      },
      orderBy: { dueAt: "asc" }
    });
  }

  /* ======================================================
     🗑️ DELETE ALL TASKS
     ====================================================== */
  async deleteAll(userId: number) {
    const result = await prisma.task.deleteMany({
      where: { userId }
    });
    return result.count;
  }
}
