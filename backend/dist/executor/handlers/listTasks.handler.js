"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasksHandler = listTasksHandler;
const task_service_1 = require("../../services/task.service");
const listTasks_guard_1 = require("../../guards/listTasks.guard");
const taskService = new task_service_1.TaskService();
async function listTasksHandler(payload) {
    // 1️⃣ valida runtime + TS
    if (!(0, listTasks_guard_1.isListTasksPayload)(payload)) {
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
    const data = payload;
    let filter;
    switch (data.filter) {
        case "TODAY":
            filter = { type: "TODAY" };
            break;
        case "TOMORROW":
            filter = { type: "TOMORROW" };
            break;
        case "DATE":
            filter = { type: "DATE", value: data.value };
            break;
        case "ALL":
        default:
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
