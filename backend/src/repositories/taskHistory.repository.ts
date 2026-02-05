import { prisma } from "../prisma/client";

export type HistoryAction = "created" | "updated" | "completed" | "deleted" | "restored";

interface CreateHistoryData {
  taskId: number;
  taskTitle: string;
  action: HistoryAction;
  details?: string; // JSON string
}

export class TaskHistoryRepository {
  create(data: CreateHistoryData) {
    return prisma.taskHistory.create({
      data: {
        taskId: data.taskId,
        taskTitle: data.taskTitle,
        action: data.action,
        details: data.details || null,
      }
    });
  }

  findAll() {
    return prisma.taskHistory.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  findByTaskId(taskId: number) {
    return prisma.taskHistory.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" }
    });
  }

  findRecent(limit: number = 50) {
    return prisma.taskHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }

  // Find history within a date range
  findByDateRange(start: Date, end: Date) {
    return prisma.taskHistory.findMany({
      where: {
        createdAt: { gte: start, lte: end }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
