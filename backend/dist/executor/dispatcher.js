"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchCommand = dispatchCommand;
const createTask_handler_1 = require("./handlers/createTask.handler");
const listTasks_handler_1 = require("./handlers/listTasks.handler");
const deleteTask_handler_1 = require("./handlers/deleteTask.handler");
const editTask_handler_1 = require("./handlers/editTask.handler");
const src_1 = require("../../../command-task-core/src");
const types_1 = require("../../../command-task-core/src/core/state/types");
const mapCoreResultToCommandResult_1 = require("./mapCoreResultToCommandResult");
// 🔥 estado conversacional vive aqui
let conversationState = types_1.initialState;
async function dispatchCommand(command) {
    /* ================================
       🧠 RAW INPUT → CORE
       ================================ */
    if (command.intent === "RAW_INPUT") {
        const payload = command.payload;
        const { result, state } = (0, src_1.interpret)(payload.text, conversationState);
        conversationState = state;
        // ⬅️ SÓ aqui executamos backend
        if (result.type === "FINAL") {
            return dispatchCommand({
                type: "COMMAND",
                intent: result.intent,
                payload: result.payload,
            });
        }
        // QUESTION / INFO
        return (0, mapCoreResultToCommandResult_1.mapCoreResultToCommandResult)(result);
    }
    /* ================================
       🚀 COMANDOS FINAIS
       ================================ */
    switch (command.intent) {
        case "CREATE_TASK":
            return (0, createTask_handler_1.createTaskHandler)(command.payload);
        case "LIST_TASKS":
            return (0, listTasks_handler_1.listTasksHandler)(command.payload);
        case "DELETE_TASK":
            return (0, deleteTask_handler_1.deleteTaskHandler)(command.payload);
        case "EDIT_TASK":
            return (0, editTask_handler_1.editTaskHandler)(command.payload);
        default:
            return {
                status: "ERROR",
                intent: command.intent,
                error: {
                    code: "UNKNOWN_INTENT",
                    message: `No handler for intent ${command.intent}`,
                },
            };
    }
}
