import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const authService = new AuthService();

const ERROR_MESSAGES: Record<string, { status: number; message: string }> = {
  EMAIL_ALREADY_EXISTS: { status: 409, message: "Email already registered" },
  INVALID_CREDENTIALS: { status: 401, message: "Invalid email or password" },
  INVALID_REFRESH_TOKEN: { status: 401, message: "Invalid or expired refresh token" },
  USER_NOT_FOUND: { status: 404, message: "User not found" },
  EMAIL_REQUIRED: { status: 400, message: "Email is required" },
  PASSWORD_REQUIRED: { status: 400, message: "Password is required" },
  NAME_REQUIRED: { status: 400, message: "Name is required" },
  INVALID_EMAIL_FORMAT: { status: 400, message: "Invalid email format" },
  PASSWORD_TOO_SHORT: { status: 400, message: "Password must be at least 6 characters" },
  NAME_TOO_SHORT: { status: 400, message: "Name must be at least 2 characters" },
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

export async function registerController(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body;

    const result = await authService.register({ email, password, name });

    res.status(201).json({
      status: "ok",
      user: result.user,
      tokens: result.tokens,
    });
  } catch (error) {
    handleError(res, error);
  }
}

export async function loginController(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password });

    res.json({
      status: "ok",
      user: result.user,
      tokens: result.tokens,
    });
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

    await authService.logout(req.user.userId);

    res.json({ status: "ok", message: "Logged out successfully" });
  } catch (error) {
    handleError(res, error);
  }
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ status: "error", message: "Refresh token is required" });
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

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
