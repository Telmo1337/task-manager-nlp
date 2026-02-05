import { CommandResult } from "../../../../shared/command.result";
import { TaskService } from "../../services/task.service";

const taskService = new TaskService();

export async function deleteAllTasksHandler(): Promise<CommandResult> {
  try {
    const count = await taskService.deleteAllTasks();

    return {
      status: "SUCCESS",
      intent: "DELETE_ALL_TASKS",
      data: {
        deleted: true,
        count,
        message: `Deleted ${count} task(s).`
      }
    };
  } catch (error: any) {
    return {
      status: "ERROR",
      intent: "DELETE_ALL_TASKS",
      error: {
        code: "DELETE_TASK_FAILED",
        message: "Failed to delete all tasks"
      }
    };
  }
}
