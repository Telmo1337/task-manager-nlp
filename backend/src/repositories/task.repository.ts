import { prisma } from "../prisma/client";
import { resolveDate } from "../utils/dateTimeResolver";

interface CreateTaskData {
  title: string;
  description?: string | null;
  dueAt: Date;
  priority?: string;
  recurrence?: string | null;
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
      }
    });
  }

  findAll() {
    return prisma.task.findMany({
      orderBy: { dueAt: "asc" }
    });
  }

  // Find tasks with specific status
  findByStatus(status: TaskStatus) {
    return prisma.task.findMany({
      where: { status },
      orderBy: { dueAt: "asc" }
    });
  }

  // Find completed tasks (history)
  findCompleted() {
    return prisma.task.findMany({
      where: { status: "completed" },
      orderBy: { completedAt: "desc" }
    });
  }

  // Find tasks completed on a specific date
  findCompletedOnDate(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: {
        status: "completed",
        completedAt: { gte: start, lte: end }
      },
      orderBy: { completedAt: "desc" }
    });
  }

  findDueToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: { dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  findDueTomorrow() {
    const base = new Date();
    base.setDate(base.getDate() + 1);

    const start = new Date(base);
    start.setHours(0, 0, 0, 0);

    const end = new Date(base);
    end.setHours(23, 59, 59, 999);

    return prisma.task.findMany({
      where: { dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  findDueOnDate(date: string) {
    // Use resolveDate to handle natural language dates like "february 7"
    const resolved = resolveDate(date);
    
    const start = resolved.startOf("day").toJSDate();
    const end = resolved.endOf("day").toJSDate();

    return prisma.task.findMany({
      where: { dueAt: { gte: start, lte: end } },
      orderBy: { dueAt: "asc" }
    });
  }

  /* ======================================================
     ✅ DUPLICADO = MESMO título NORMALIZADO + MESMO instante
     ====================================================== */
  findDuplicate(title: string, dueAt: Date) {
    return prisma.task.findFirst({
      where: {
        title: title.trim().toLowerCase(),
        dueAt: dueAt
      }
    });
  }

  deleteById(id: number) {
    return prisma.task.delete({ where: { id } });
  }

  findById(id: number) {
    return prisma.task.findUnique({ where: { id } });
  }

  updateById(id: number, data: { 
    title?: string; 
    description?: string;
    dueAt?: Date; 
    priority?: string; 
    recurrence?: string | null;
    status?: TaskStatus;
  }) {
    return prisma.task.update({
      where: { id },
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
  async markCompleted(id: number) {
    return prisma.task.update({
      where: { id },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });
  }

  // Update task status
  async updateStatus(id: number, status: TaskStatus) {
    const data: any = { status };
    if (status === "completed") {
      data.completedAt = new Date();
    } else {
      data.completedAt = null;
    }
    return prisma.task.update({
      where: { id },
      data
    });
  }

    /* ======================================================
     🔍 PROCURAR POR TÍTULO (para DELETE inteligente)
     ====================================================== */
  findByTitle(title: string) {
    return prisma.task.findMany({
      where: {
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
  async deleteAll() {
    const result = await prisma.task.deleteMany({});
    return result.count;
  }
}
