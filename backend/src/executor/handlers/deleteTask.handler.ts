import { CommandResult } from "../../../../shared/command.result";
import { TaskService } from "../../services/task.service";
import { z } from "zod";
import { undoService } from "./undoAction.handler";

const taskService = new TaskService();

// Delete can use id OR title, so we need a union schema
const DeleteTaskPayloadSchema = z.union([
  z.object({ id: z.number().int().positive() }),
  z.object({ title: z.string().min(1) }),
]);

export async function deleteTaskHandler(
  payload: unknown,
  sessionId: string = "default"
): Promise<CommandResult> {
  const validation = DeleteTaskPayloadSchema.safeParse(payload);
  
  if (!validation.success) {
    return {
      status: "ERROR",
      intent: "DELETE_TASK",
      error: {
        code: "INVALID_COMMAND",
        message: "Please provide task id or title"
      }
    };
  }

  const data = validation.data;

  try {
    const result = await taskService.deleteTaskSmart(data);

    /* ======================================================
       ❓ DELETE AMBÍGUO → devolver candidatos
       ====================================================== */
    if ("candidates" in result) {
      return {
        status: "SUCCESS",
        intent: "DELETE_TASK",
        data: {
          ambiguous: true,
          candidates: result.candidates
        }
      };
    }

    /* ======================================================
       ✅ DELETE OK
       ====================================================== */
    // Record undoable action with deleted task data
    if (result.deletedTask) {
      undoService.recordAction(sessionId, {
        type: "DELETE_TASK",
        taskId: result.deletedTask.id,
        data: {
          title: result.deletedTask.title,
          dueAt: result.deletedTask.dueAt?.toISOString(),
          priority: result.deletedTask.priority,
          recurrence: result.deletedTask.recurrence
        }
      });
    }

    return {
      status: "SUCCESS",
      intent: "DELETE_TASK",
      data: {
        deleted: true
      }
    };
  } catch (error: any) {
    return {
      status: "ERROR",
      intent: "DELETE_TASK",
      error: {
        code: error.message || "DELETE_TASK_FAILED",
        message: "Failed to delete task"
      }
    };
  }
}
