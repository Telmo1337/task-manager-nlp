import { CommandResult } from "../../../../shared/command.result";
import { TaskService } from "../../services/task.service";
import { validateEditTaskPayload } from "../../validators/command.validator";
import { undoService } from "./undoAction.handler";

const taskService = new TaskService();

export async function editTaskHandler(
  payload: unknown,
  sessionId: string = "default"
): Promise<CommandResult> {
  const validation = validateEditTaskPayload(payload);
  
  if (!validation.success) {
    return {
      status: "ERROR",
      intent: "EDIT_TASK",
      error: {
        code: "INVALID_COMMAND",
        message: validation.error.issues[0]?.message || "Invalid payload"
      }
    };
  }

  try {
    const taskId = Number(validation.data.id);
    
    // Fetch current state before editing for undo capability
    const previousTask = await taskService.getTaskById(taskId);
    
    const result = await taskService.editTask(validation.data);

    // Record undoable action with previous state
    if (previousTask) {
      undoService.recordAction(sessionId, {
        type: "EDIT_TASK",
        taskId: taskId,
        data: {
          title: result.title,
          dueAt: result.dueAt?.toISOString()
        },
        previousData: {
          title: previousTask.title,
          dueAt: previousTask.dueAt?.toISOString(),
          priority: previousTask.priority,
          recurrence: previousTask.recurrence
        }
      });
    }

    return {
      status: "SUCCESS",
      intent: "EDIT_TASK",
      data: result
    };
  } catch (error: any) {
    return {
      status: "ERROR",
      intent: "EDIT_TASK",
      error: {
        code: error.message || "EDIT_TASK_FAILED",
        message: "Failed to edit task"
      }
    };
  }
}
