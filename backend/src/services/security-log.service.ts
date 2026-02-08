import { prisma } from "../prisma/client";

export interface LogSecurityEventParams {
  userId?: number;
  action: string;
  ip: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

export class SecurityLogService {
  async log(params: LogSecurityEventParams): Promise<void> {
    try {
      await prisma.securityLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          ip: params.ip,
          userAgent: params.userAgent || null,
          details: params.details ? JSON.stringify(params.details) : null,
        },
      });
    } catch (error) {
      // Don't let logging failures affect the main flow
      console.error("Failed to log security event:", error);
    }
  }

  async getRecentLogs(userId?: number, limit = 50): Promise<unknown[]> {
    return prisma.securityLog.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

export const securityLogService = new SecurityLogService();
