"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCoreResultToCommandResult = mapCoreResultToCommandResult;
function mapCoreResultToCommandResult(result) {
    switch (result.type) {
        case "QUESTION":
            return {
                status: "QUESTION",
                message: result.message,
            };
        case "INFO":
            return {
                status: "SUCCESS",
                intent: "LIST_TASKS", // dummy / neutro
                data: { message: result.message },
            };
        case "FINAL":
            return null; // ⬅️ FINAL NÃO É resposta HTTP
    }
}
