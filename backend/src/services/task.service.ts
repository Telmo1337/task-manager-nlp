import { TaskRepository, TaskStatus } from "../repositories/task.repository";
import { TaskHistoryRepository } from "../repositories/taskHistory.repository";
import { resolveDateTime } from "../utils/dateTimeResolver";

interface CreateTaskInput {
  title: string;
  description?: string;
  date: string;
  time?: string;
  priority?: "urgent" | "high" | "normal" | "low";
  recurrence?: string;
}

type ListTasksFilter =
  | { type: "ALL" }
  | { type: "TODAY" }
  | { type: "TOMORROW" }
  | { type: "DATE"; value: string }
  | { type: "COMPLETED" }
  | { type: "COMPLETED_ON_DATE"; value: string }
  | { type: "PENDING" };

interface EditTaskInput {
  id: unknown;
  title?: unknown;
  description?: unknown;
  date?: unknown;
  time?: unknown;
  priority?: unknown;
  recurrence?: unknown;
  status?: unknown;
}

export class TaskService {
  private repository = new TaskRepository();
  private historyRepository = new TaskHistoryRepository();

  /* ======================================================
     CREATE TASK — duplicado = MESMO título + MESMA hora
     ====================================================== */
  async createTask(input: CreateTaskInput) {
    if (!input.title || !input.date) {
      throw new Error("TITLE_AND_DATE_REQUIRED");
    }

    const priority = input.priority || "normal";
    const recurrence = input.recurrence || null;
    const description = input.description || null;

    // ⚠️ se não houver hora, NÃO normalizamos para 00:00
    if (!input.time) {
      const dueAt = resolveDateTime(input.date);

      const created = await this.repository.create({
        title: input.title,
        description,
        dueAt,
        priority,
        recurrence,
      });

      // Record history
      await this.historyRepository.create({
        taskId: created.id,
        taskTitle: created.title,
        action: "created",
        details: JSON.stringify({ dueAt, priority, recurrence })
      });

      return {
        duplicate: false,
        task: created,
      };
    }

    // ⏱️ daqui para baixo SÓ com hora
    const dueAt = resolveDateTime(input.date, input.time);

    const duplicate = await this.repository.findDuplicate(input.title, dueAt);

    if (duplicate) {
      return {
        duplicate: true,
        task: duplicate,
        payload: {
          title: input.title,
          dueAt,
        },
      };
    }

    const created = await this.repository.create({
      title: input.title,
      description,
      dueAt,
      priority,
      recurrence,
    });

    // Record history
    await this.historyRepository.create({
      taskId: created.id,
      taskTitle: created.title,
      action: "created",
      details: JSON.stringify({ dueAt, priority, recurrence })
    });

    return {
      duplicate: false,
      task: created,
    };
  }

  /* ======================================================
     LIST TASKS
     ====================================================== */
  async listTasksWithFilter(filter: ListTasksFilter) {
    let tasks;

    switch (filter.type) {
      case "TODAY":
        tasks = await this.repository.findDueToday();
        break;

      case "TOMORROW":
        tasks = await this.repository.findDueTomorrow();
        break;

      case "DATE":
        tasks = await this.repository.findDueOnDate(filter.value);
        break;

      case "COMPLETED":
        tasks = await this.repository.findCompleted();
        break;

      case "COMPLETED_ON_DATE":
        const date = new Date(filter.value);
        tasks = await this.repository.findCompletedOnDate(date);
        break;

      case "PENDING":
        tasks = await this.repository.findByStatus("pending");
        break;

      default:
        tasks = await this.repository.findAll();
    }

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueAt: task.dueAt,
      status: task.status,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      priority: task.priority,
      recurrence: task.recurrence,
    }));
  }

  async deleteTask(taskId: unknown) {
    const id = Number(taskId);
    if (!id || Number.isNaN(id)) {
      throw new Error("INVALID_TASK_ID");
    }

    await this.repository.deleteById(id);
    return { id };
  }

  async editTask(input: EditTaskInput) {
    const id = Number(input.id);
    if (!id || Number.isNaN(id)) {
      throw new Error("INVALID_TASK_ID");
    }

    const data: { 
      title?: string; 
      description?: string;
      dueAt?: Date;
      status?: TaskStatus;
    } = {};

    if (typeof input.title === "string") {
      data.title = input.title;
    }

    if (typeof input.description === "string") {
      data.description = input.description;
    }

    if (typeof input.date === "string") {
      data.dueAt = resolveDateTime(
        input.date,
        typeof input.time === "string" ? input.time : undefined,
      );
    }

    if (typeof input.status === "string" && 
        ["pending", "in_progress", "completed", "cancelled"].includes(input.status)) {
      data.status = input.status as TaskStatus;
    }

    if (!Object.keys(data).length) {
      throw new Error("NO_FIELDS_TO_UPDATE");
    }

    const updated = await this.repository.updateById(id, data);

    // Record history
    await this.historyRepository.create({
      taskId: updated.id,
      taskTitle: updated.title,
      action: data.status === "completed" ? "completed" : "updated",
      details: JSON.stringify(data)
    });

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      dueAt: updated.dueAt,
      status: updated.status,
    };
  }

  /* ======================================================
     DELETE INTELIGENTE
     ====================================================== */
  async deleteTaskSmart(input: { id?: number; title?: string }) {
    // 1️⃣ DELETE direto por ID
    if (input.id) {
      // Fetch task data before deleting for undo capability
      const task = await this.repository.findById(input.id);
      if (!task) {
        throw new Error("TASK_NOT_FOUND");
      }
      await this.repository.deleteById(input.id);
      return { 
        deleted: true,
        deletedTask: {
          id: task.id,
          title: task.title,
          dueAt: task.dueAt,
          priority: task.priority,
          recurrence: task.recurrence
        }
      };
    }

    // 2️⃣ DELETE por título
    if (!input.title) {
      throw new Error("DELETE_NEEDS_CRITERIA");
    }

    const matches = await this.repository.findByTitle(input.title);

    if (matches.length === 0) {
      throw new Error("TASK_NOT_FOUND");
    }

    if (matches.length === 1) {
      const task = matches[0];
      await this.repository.deleteById(task.id);
      return { 
        deleted: true,
        deletedTask: {
          id: task.id,
          title: task.title,
          dueAt: task.dueAt,
          priority: task.priority,
          recurrence: task.recurrence
        }
      };
    }

    // 3️⃣ Ambíguo → pedir confirmação
    return {
      deleted: false,
      candidates: matches.map((task) => ({
        id: task.id,
        title: task.title,
        dueAt: task.dueAt,
      })),
    };
  }

  /* ======================================================
     UPDATE TASK (for undo)
     ====================================================== */
  async updateTask(
    taskId: number,
    data: {
      title?: string;
      dueAt?: Date;
      priority?: string;
      recurrence?: string | null;
    }
  ) {
    return this.repository.updateById(taskId, data);
  }

  /* ======================================================
     GET TASK BY ID (for undo - fetch before edit)
     ====================================================== */
  async getTaskById(taskId: number) {
    return this.repository.findById(taskId);
  }

  /* ======================================================
     DELETE ALL TASKS
     ====================================================== */
  async deleteAllTasks() {
    return this.repository.deleteAll();
  }

  /* ======================================================
     UPDATE TASK STATUS
     ====================================================== */
  async updateTaskStatus(taskId: number, status: TaskStatus) {
    const task = await this.repository.findById(taskId);
    if (!task) {
      throw new Error("TASK_NOT_FOUND");
    }

    const updated = await this.repository.updateStatus(taskId, status);

    // Record history
    await this.historyRepository.create({
      taskId: updated.id,
      taskTitle: updated.title,
      action: status === "completed" ? "completed" : "updated",
      details: JSON.stringify({ status, previousStatus: task.status })
    });

    return updated;
  }

  /* ======================================================
     GET TASK HISTORY
     ====================================================== */
  async getTaskHistory(taskId?: number) {
    if (taskId) {
      return this.historyRepository.findByTaskId(taskId);
    }
    return this.historyRepository.findRecent();
  }

  /* ======================================================
     GET TASKS FOR CALENDAR (month view)
     ====================================================== */
  async getTasksForCalendar(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    
    const tasks = await this.repository.findAll();
    
    return tasks
      .filter(task => {
        const taskDate = new Date(task.dueAt);
        return taskDate >= start && taskDate <= end;
      })
      .map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        dueAt: task.dueAt,
        status: task.status,
        priority: task.priority,
        recurrence: task.recurrence,
      }));
  }
}
