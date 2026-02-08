import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { executeCommandController } from "./controllers/execute.controller";
import { TaskService } from "./services/task.service";
import authRoutes from "./routes/auth.routes";
import { authMiddleware, AuthenticatedRequest } from "./middlewares/auth.middleware";

dotenv.config();

const taskService = new TaskService();

export function createApp() {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "x-session-id", "Authorization"],
    exposedHeaders: ["x-session-id"],
  }))

  app.use(express.json());

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.use("/auth", authRoutes);

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
