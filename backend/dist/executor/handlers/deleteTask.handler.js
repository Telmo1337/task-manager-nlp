"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskHandler = deleteTaskHandler;
const task_service_1 = require("../../services/task.service");
const taskService = new task_service_1.TaskService();
async function deleteTaskHandler(payload) {
    const data = payload;
    if (!data.id && !data.title) {
        return {
            status: "ERROR",
            intent: "DELETE_TASK",
            error: {
                code: "INVALID_COMMAND",
                message: "Please provide task id or title"
            }
        };
    }
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
        return {
            status: "SUCCESS",
            intent: "DELETE_TASK",
            data: {
                deleted: true
            }
        };
    }
    catch (error) {
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
