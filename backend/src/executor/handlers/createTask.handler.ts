import { CommandResult } from "../../../../shared/command.result";
import { TaskService } from "../../services/task.service";
import { validateCreateTaskPayload } from "../../validators/command.validator";
import { undoService } from "./undoAction.handler";

const taskService = new TaskService();

export async function createTaskHandler(
  payload: unknown,
  sessionId: string = "default",
  userId: number
): Promise<CommandResult> {
  // Validate payload with Zod
  const validation = validateCreateTaskPayload(payload);
  
  if (!validation.success) {
    return {
      status: "ERROR",
      intent: "CREATE_TASK",
      error: {
        code: "INVALID_COMMAND",
        message: validation.error.issues[0]?.message || "Invalid payload"
      }
    };
  }

  try {
    const { title, description, date, time, priority, recurrence } = validation.data;

    const result = await taskService.createTask({ title, description, date, time, priority, recurrence, userId });

    /* ======================================================
       🔁 DUPLICATE → pedir confirmação ao Core
       ====================================================== */
    if (result.duplicate && time) {
      return {
        status: "ERROR",
        intent: "CREATE_TASK",
        error: {
          code: "DUPLICATE_TASK",
          message: "Task already exists for that date"
        }
      };
    }

    /* ======================================================
       ✅ SUCESSO NORMAL
       ====================================================== */
    const task = result.task;

    // Record undoable action
    undoService.recordAction(sessionId, {
      type: "CREATE_TASK",
      taskId: task.id,
      data: {
        title: task.title,
        dueAt: task.dueAt?.toISOString(),
        priority: task.priority,
        recurrence: task.recurrence
      }
    });

    return {
      status: "SUCCESS",
      intent: "CREATE_TASK",
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        dueAt: task.dueAt.toISOString(),
        priority: task.priority,
        recurrence: task.recurrence,
        createdAt: task.createdAt.toISOString()
      }
    };
  } catch (error) {
    return {
      status: "ERROR",
      intent: "CREATE_TASK",
      error: {
        code: "CREATE_TASK_FAILED",
        message: "Failed to create task"
      }
    };
  }
}
