import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { TokenPayload } from "../types/auth.types";

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

const authService = new AuthService();

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ status: "error", message: "Authorization header missing" });
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ status: "error", message: "Invalid authorization format" });
    return;
  }

  const token = parts[1];

  try {
    const payload = authService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ status: "error", message: "Invalid or expired token" });
    return;
  }
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    next();
    return;
  }

  const token = parts[1];

  try {
    const payload = authService.verifyAccessToken(token);
    req.user = payload;
  } catch {
    // Token invalid, but that's okay for optional auth
  }

  next();
}
