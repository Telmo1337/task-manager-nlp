"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isListTasksPayload = isListTasksPayload;
function isListTasksPayload(payload) {
    if (typeof payload !== "object" || payload === null) {
        return false;
    }
    const data = payload;
    if (typeof data.filter !== "string") {
        return false;
    }
    if (data.filter === "DATE") {
        return typeof data.value === "string";
    }
    return ["ALL", "TODAY", "TOMORROW"].includes(data.filter);
}
