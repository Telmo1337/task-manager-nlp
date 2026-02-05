"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskHandler = editTaskHandler;
const task_service_1 = require("../../services/task.service");
const taskService = new task_service_1.TaskService();
async function editTaskHandler(payload) {
    try {
        const result = await taskService.editTask(payload);
        return {
            status: "SUCCESS",
            intent: "EDIT_TASK",
            data: result
        };
    }
    catch (error) {
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
