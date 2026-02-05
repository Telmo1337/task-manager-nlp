import { TaskService } from "../../services/task.service";
import { isListTasksPayload } from "../../guards/listTasks.guard";

// Import type locally to avoid dist import issues
type ListTasksPayload =
  | { filter: "ALL" }
  | { filter: "TODAY" }
  | { filter: "TOMORROW" }
  | { filter: "DATE"; value: string }
  | { filter: "COMPLETED" }
  | { filter: "COMPLETED_ON_DATE"; value: string }
  | { filter: "PENDING" };
import { CommandResult } from "../../../../shared/command.result";


const taskService = new TaskService();

type ListTasksFilter =
  | { type: "ALL" }
  | { type: "TODAY" }
  | { type: "TOMORROW" }
  | { type: "DATE"; value: string }
  | { type: "COMPLETED" }
  | { type: "COMPLETED_ON_DATE"; value: string }
  | { type: "PENDING" };

export async function listTasksHandler(
  payload: unknown
): Promise<CommandResult> {
  // 1️⃣ valida runtime + TS
  if (!isListTasksPayload(payload)) {
    return {
      status: "ERROR",
      intent: "LIST_TASKS",
      error: {
        code: "INVALID_COMMAND",
        message: "Invalid LIST_TASKS payload"
      }
    };
  }

  // 2️⃣ payload agora é formalmente tipado
  const data: ListTasksPayload = payload;

  let filter: ListTasksFilter;

  if (data.filter === "TODAY") {
    filter = { type: "TODAY" };
  } else if (data.filter === "TOMORROW") {
    filter = { type: "TOMORROW" };
  } else if (data.filter === "DATE" && "value" in data) {
    filter = { type: "DATE", value: data.value };
  } else if (data.filter === "COMPLETED") {
    filter = { type: "COMPLETED" };
  } else if (data.filter === "COMPLETED_ON_DATE" && "value" in data) {
    filter = { type: "COMPLETED_ON_DATE", value: data.value };
  } else if (data.filter === "PENDING") {
    filter = { type: "PENDING" };
  } else {
    filter = { type: "ALL" };
  }

  // 3️⃣ execução segura
  const tasks = await taskService.listTasksWithFilter(filter);

  return {
    status: "SUCCESS",
    intent: "LIST_TASKS",
    data: tasks
  };
}
