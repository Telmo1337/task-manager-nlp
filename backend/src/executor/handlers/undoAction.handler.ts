import { CommandResult } from "../../../../shared/command.result";
import { UndoService } from "../../services/undo.service";
import { TaskService } from "../../services/task.service";

const undoService = new UndoService();
const taskService = new TaskService();

export { undoService };

export async function handleUndoAction(
  sessionId: string,
  userId: number
): Promise<CommandResult> {
  const lastAction = undoService.popLastAction(sessionId);

  if (!lastAction) {
    return {
      status: "ERROR",
      intent: "UNDO_ACTION",
      error: {
        code: "NOTHING_TO_UNDO",
        message: "Nothing to undo. No recent actions found."
      }
    };
  }

  try {
    switch (lastAction.type) {
      case "CREATE_TASK":
        // Undo create = delete the task
        if (lastAction.taskId) {
          await taskService.deleteTask(userId, lastAction.taskId);
          return {
            status: "SUCCESS",
            intent: "UNDO_ACTION",
            data: {
              undone: true,
              message: `Undone: Deleted task "${lastAction.data?.title || "task"}" that was just created.`
            }
          };
        }
        break;

      case "DELETE_TASK":
        // Undo delete = recreate the task
        if (lastAction.data) {
          await taskService.createTask({
            title: lastAction.data.title || "Untitled",
            date: lastAction.data.dueAt || new Date().toISOString(),
            priority: (lastAction.data.priority as "urgent" | "high" | "normal" | "low") || "normal",
            recurrence: lastAction.data.recurrence || undefined,
            userId
          });
          return {
            status: "SUCCESS",
            intent: "UNDO_ACTION",
            data: {
              undone: true,
              message: `Undone: Restored task "${lastAction.data.title}".`
            }
          };
        }
        break;

      case "EDIT_TASK":
        // Undo edit = restore previous state
        if (lastAction.taskId && lastAction.previousData) {
          await taskService.updateTask(userId, lastAction.taskId, {
            title: lastAction.previousData.title,
            dueAt: lastAction.previousData.dueAt ? new Date(lastAction.previousData.dueAt) : undefined,
            priority: lastAction.previousData.priority,
            recurrence: lastAction.previousData.recurrence
          });
          return {
            status: "SUCCESS",
            intent: "UNDO_ACTION",
            data: {
              undone: true,
              message: `Undone: Restored task to "${lastAction.previousData.title}".`
            }
          };
        }
        break;
    }

    return {
      status: "ERROR",
      intent: "UNDO_ACTION",
      error: {
        code: "UNDO_FAILED",
        message: "Could not undo the last action. Missing required data."
      }
    };
  } catch (error) {
    console.error("Undo action error:", error);
    return {
      status: "ERROR",
      intent: "UNDO_ACTION",
      error: {
        code: "UNDO_FAILED",
        message: "Failed to undo. The action could not be reversed."
      }
    };
  }
}
