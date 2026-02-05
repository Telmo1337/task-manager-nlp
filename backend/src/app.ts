import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { executeCommandController } from "./controllers/execute.controller";
import { TaskService } from "./services/task.service";

dotenv.config();

const taskService = new TaskService();

export function createApp() {
  const app = express();

  app.use(cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "x-session-id"],
    exposedHeaders: ["x-session-id"],
  }))

  app.use(express.json());

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/execute", executeCommandController);

  // Calendar endpoint - get tasks for a month
  app.get("/calendar/:year/:month", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const tasks = await taskService.getTasksForCalendar(year, month);
      res.json({ status: "ok", tasks });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get calendar data" });
    }
  });

  // Get single task by ID
  app.get("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ status: "error", message: "Task not found" });
      }
      res.json({ status: "ok", task });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get task" });
    }
  });

  // Update task status
  app.patch("/tasks/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["pending", "in_progress", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ status: "error", message: "Invalid status" });
      }
      
      const task = await taskService.updateTaskStatus(id, status);
      res.json({ status: "ok", task });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message || "Failed to update status" });
    }
  });

  // Get task history
  app.get("/history", async (req, res) => {
    try {
      const taskId = req.query.taskId ? parseInt(req.query.taskId as string) : undefined;
      const history = await taskService.getTaskHistory(taskId);
      res.json({ status: "ok", history });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Failed to get history" });
    }
  });

  return app;
}
