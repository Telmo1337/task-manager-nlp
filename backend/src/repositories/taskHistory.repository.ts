import { prisma } from "../prisma/client";

export type HistoryAction = "created" | "updated" | "completed" | "deleted" | "restored";

interface CreateHistoryData {
  taskId: number;
  taskTitle: string;
  action: HistoryAction;
  details?: string; // JSON string
  userId: number;
}

export class TaskHistoryRepository {
  create(data: CreateHistoryData) {
    return prisma.taskHistory.create({
      data: {
        taskId: data.taskId,
        taskTitle: data.taskTitle,
        action: data.action,
        details: data.details || null,
        userId: data.userId,
      }
    });
  }

  findAll(userId: number) {
    return prisma.taskHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  }

  findByTaskId(userId: number, taskId: number) {
    return prisma.taskHistory.findMany({
      where: { userId, taskId },
      orderBy: { createdAt: "desc" }
    });
  }

  findRecent(userId: number, limit: number = 50) {
    return prisma.taskHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }

  // Find history within a date range
  findByDateRange(userId: number, start: Date, end: Date) {
    return prisma.taskHistory.findMany({
      where: {
        userId,
        createdAt: { gte: start, lte: end }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
