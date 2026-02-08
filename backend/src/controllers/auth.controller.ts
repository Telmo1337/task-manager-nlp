import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { accountLockoutService } from "../services/account-lockout.service";
import { securityLogService } from "../services/security-log.service";

const authService = new AuthService();

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

function getClientInfo(req: Request): { ip: string; userAgent: string } {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() 
    || req.socket.remoteAddress 
    || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  return { ip, userAgent };
}

const ERROR_MESSAGES: Record<string, { status: number; message: string }> = {
  EMAIL_ALREADY_EXISTS: { status: 409, message: "Email already registered" },
  INVALID_CREDENTIALS: { status: 401, message: "Invalid email or password" },
  INVALID_REFRESH_TOKEN: { status: 401, message: "Invalid or expired refresh token" },
  USER_NOT_FOUND: { status: 404, message: "User not found" },
  EMAIL_REQUIRED: { status: 400, message: "Email is required" },
  PASSWORD_REQUIRED: { status: 400, message: "Password is required" },
  NAME_REQUIRED: { status: 400, message: "Name is required" },
  INVALID_EMAIL_FORMAT: { status: 400, message: "Invalid email format" },
  PASSWORD_TOO_SHORT: { status: 400, message: "Password must be at least 8 characters" },
  NAME_TOO_SHORT: { status: 400, message: "Name must be at least 2 characters" },
  ACCOUNT_LOCKED: { status: 423, message: "Account temporarily locked due to too many failed attempts" },
  SUSPICIOUS_ACTIVITY: { status: 429, message: "Suspicious activity detected. Please try again later" },
};

function handleError(res: Response, error: unknown): void {
  if (error instanceof Error) {
    const errorInfo = ERROR_MESSAGES[error.message];
    if (errorInfo) {
      res.status(errorInfo.status).json({ status: "error", message: errorInfo.message });
      return;
    }
  }
  console.error("Auth error:", error);
  res.status(500).json({ status: "error", message: "Internal server error" });
}

function setTokenCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
  res.cookie("accessToken", tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie("refreshToken", tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/auth", // Restrict refresh token to auth routes only
  });
}

function clearTokenCookies(res: Response): void {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", { ...COOKIE_OPTIONS, path: "/auth" });
}

export async function registerController(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const { ip, userAgent } = getClientInfo(req);

    // Check for suspicious activity from this IP
    const suspicious = await accountLockoutService.checkSuspiciousActivity(ip);
    if (suspicious) {
      await securityLogService.log({
        action: "suspicious_registration_attempt",
        ip,
        userAgent,
        details: { email },
      });
      throw new Error("SUSPICIOUS_ACTIVITY");
    }

    const result = await authService.register({ email, password, name });

    // Log successful registration
    await securityLogService.log({
      userId: result.user.id,
      action: "register",
      ip,
      userAgent,
    });

    // Set httpOnly cookies
    setTokenCookies(res, result.tokens);

    res.status(201).json({
      status: "ok",
      user: result.user,
      tokens: result.tokens, // Still return tokens for backward compatibility
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const { ip, userAgent } = getClientInfo(req);

    // Check for suspicious activity
    const suspicious = await accountLockoutService.checkSuspiciousActivity(ip);
    if (suspicious) {
      await securityLogService.log({
        action: "suspicious_login_attempt",
        ip,
        userAgent,
        details: { email },
      });
      throw new Error("SUSPICIOUS_ACTIVITY");
    }

    // Try to find user first to check lockout
    const userForLockout = await authService.findUserByEmail(email);
    if (userForLockout) {
      const lockStatus = await accountLockoutService.isAccountLocked(userForLockout.id);
      if (lockStatus.locked) {
        await securityLogService.log({
          userId: userForLockout.id,
          action: "login_attempt_while_locked",
          ip,
          userAgent,
        });
        throw new Error("ACCOUNT_LOCKED");
      }
    }

    try {
      const result = await authService.login({ email, password });

      // Record successful login attempt
      await accountLockoutService.recordAttempt({
        email,
        userId: result.user.id,
        ip,
        userAgent,
        success: true,
      });

      // Log successful login
      await securityLogService.log({
        userId: result.user.id,
        action: "login",
        ip,
        userAgent,
      });

      // Set httpOnly cookies
      setTokenCookies(res, result.tokens);

      res.json({
        status: "ok",
        user: result.user,
        tokens: result.tokens, // Still return tokens for backward compatibility
      });
    } catch (loginError) {
      // Record failed login attempt
      if (userForLockout) {
        await accountLockoutService.recordAttempt({
          email,
          userId: userForLockout.id,
          ip,
          userAgent,
          success: false,
        });

        await securityLogService.log({
          userId: userForLockout.id,
          action: "failed_login",
          ip,
          userAgent,
        });
      }
      throw loginError;
    }
  } catch (error) {
    handleError(res, error);
  }
}

export async function logoutController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Not authenticated" });
      return;
    }

    const { ip, userAgent } = getClientInfo(req);

    await authService.logout(req.user.userId);

    // Log logout
    await securityLogService.log({
      userId: req.user.userId,
      action: "logout",
      ip,
      userAgent,
    });

    // Clear cookies
    clearTokenCookies(res);

    res.json({ status: "ok", message: "Logged out successfully" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  try {
    // Try to get refresh token from cookie first, then body
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ status: "error", message: "Refresh token is required" });
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

    // Set new cookies
    setTokenCookies(res, tokens);

    res.json({
      status: "ok",
      tokens,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function profileController(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Not authenticated" });
      return;
    }

    const user = await authService.getProfile(req.user.userId);

    res.json({
      status: "ok",
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
}
