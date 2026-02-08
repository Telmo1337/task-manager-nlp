import { prisma } from "../prisma/client";
import { securityLogService } from "./security-log.service";

export interface LoginAttemptParams {
  email: string;
  userId?: number;
  ip: string;
  userAgent?: string;
  success: boolean;
}

// Security configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const ATTEMPT_WINDOW_MINUTES = 15;

export class AccountLockoutService {
  /**
   * Record a login attempt and check if account should be locked
   */
  async recordAttempt(params: LoginAttemptParams): Promise<void> {
    // Record the attempt
    await prisma.loginAttempt.create({
      data: {
        email: params.email,
        userId: params.userId,
        ip: params.ip,
        userAgent: params.userAgent || null,
        success: params.success,
      },
    });

    if (params.success && params.userId) {
      // Reset failed attempts on successful login
      await prisma.user.update({
        where: { id: params.userId },
        data: { failedAttempts: 0, lockedUntil: null },
      });
    } else if (!params.success && params.userId) {
      // Increment failed attempts
      const user = await prisma.user.update({
        where: { id: params.userId },
        data: { failedAttempts: { increment: 1 } },
      });

      // Lock account if too many failed attempts
      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
        await prisma.user.update({
          where: { id: params.userId },
          data: { lockedUntil: lockUntil },
        });

        await securityLogService.log({
          userId: params.userId,
          action: "account_locked",
          ip: params.ip,
          userAgent: params.userAgent,
          details: {
            reason: "too_many_failed_attempts",
            lockUntil: lockUntil.toISOString(),
          },
        });
      }
    }
  }

  /**
   * Check if an account is currently locked
   */
  async isAccountLocked(userId: number): Promise<{ locked: boolean; lockedUntil?: Date }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true },
    });

    if (!user || !user.lockedUntil) {
      return { locked: false };
    }

    if (user.lockedUntil > new Date()) {
      return { locked: true, lockedUntil: user.lockedUntil };
    }

    // Lock expired, reset it
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: null, failedAttempts: 0 },
    });

    return { locked: false };
  }

  /**
   * Check for suspicious activity (many failed attempts from same IP)
   */
  async checkSuspiciousActivity(ip: string): Promise<boolean> {
    const windowStart = new Date(Date.now() - ATTEMPT_WINDOW_MINUTES * 60 * 1000);

    const failedAttempts = await prisma.loginAttempt.count({
      where: {
        ip,
        success: false,
        createdAt: { gte: windowStart },
      },
    });

    // More than 10 failed attempts from same IP is suspicious
    return failedAttempts > 10;
  }

  /**
   * Unlock an account manually (admin action)
   */
  async unlockAccount(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: null, failedAttempts: 0 },
    });
  }
}

export const accountLockoutService = new AccountLockoutService();
