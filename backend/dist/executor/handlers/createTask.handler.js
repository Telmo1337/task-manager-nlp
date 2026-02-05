"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskHandler = createTaskHandler;
const task_service_1 = require("../../services/task.service");
const taskService = new task_service_1.TaskService();
async function createTaskHandler(payload) {
    try {
        const { title, date, time } = payload;
        if (!title || !date) {
            return {
                status: "ERROR",
                intent: "CREATE_TASK",
                error: {
                    code: "INVALID_COMMAND",
                    message: "Title and date are required"
                }
            };
        }
        const result = await taskService.createTask({ title, date, time });
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
        return {
            status: "SUCCESS",
            intent: "CREATE_TASK",
            data: {
                id: task.id,
                title: task.title,
                dueAt: task.dueAt.toISOString(),
                createdAt: task.createdAt.toISOString()
            }
        };
    }
    catch (error) {
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
