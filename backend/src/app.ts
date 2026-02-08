import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { executeCommandController } from "./controllers/execute.controller";
import { TaskService } from "./services/task.service";
import authRoutes from "./routes/auth.routes";
import { authMiddleware, AuthenticatedRequest } from "./middlewares/auth.middleware";
import { httpsRedirect } from "./middlewares/https.middleware";

dotenv.config();

const taskService = new TaskService();

export function createApp() {
  const app = express();

  // Security: HTTPS redirect in production
  app.use(httpsRedirect);

  // Security: HTTP headers protection
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for dev
  }));

  // Performance: Compression
  app.use(compression());

  // Security: Request logging
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // Security: Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { status: "error", message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Stricter rate limit for auth routes
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // Only 10 auth attempts per 15 minutes
    message: { status: "error", message: "Too many authentication attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use(cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "x-session-id", "Authorization"],
    exposedHeaders: ["x-session-id"],
    credentials: true, // Allow cookies to be sent
  }));

  // Cookie parser for httpOnly cookies
  app.use(cookieParser());

  app.use(express.json({ limit: "10kb" })); // Limit body size for security

  // Health check endpoint (with cache headers)
  app.get("/health", (_req, res) => {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes (with stricter rate limiting)
  app.use("/auth", authLimiter, authRoutes);

  app.post("/execute", authMiddleware, executeCommandController);

  // Calendar endpoint - get tasks for a month (protected)
  app.get("/calendar/:year/:month", authMiddleware, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.userId;
      const year = parseInt(req.params.year as string);
      const month = parseInt(req.params.month as string);
      const tasks = await taskService.getTasksForCalendar(userId, year, month);
      res.json({ status: "ok", tasks });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get calendar data" });
    }
  });

  // Get single task by ID (protected)
  app.get("/tasks/:id", authMiddleware, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.userId;
      const id = parseInt(req.params.id as string);
      const task = await taskService.getTaskById(userId, id);
      if (!task) {
        return res.status(404).json({ status: "error", message: "Task not found" });
      }
      res.json({ status: "ok", task });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get task" });
    }
  });

  // Update task status (protected)
  app.patch("/tasks/:id/status", authMiddleware, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.userId;
      const id = parseInt(req.params.id as string);
      const { status } = req.body;
      
      if (!["pending", "in_progress", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ status: "error", message: "Invalid status" });
      }
      
      const task = await taskService.updateTaskStatus(userId, id, status);
      res.json({ status: "ok", task });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message || "Failed to update status" });
    }
  });

  // Get task history (protected)
  app.get("/history", authMiddleware, async (req, res) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.userId;
      const taskId = req.query.taskId ? parseInt(req.query.taskId as string) : undefined;
      const history = await taskService.getTaskHistory(userId, taskId);
      res.json({ status: "ok", history });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get history" });
    }
  });

  return app;
}
