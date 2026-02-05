"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeleteTaskPayload = isDeleteTaskPayload;
function isDeleteTaskPayload(payload) {
    if (!payload || typeof payload !== "object")
        return false;
    if (payload.id !== undefined) {
        return typeof payload.id === "number";
    }
    if (payload.title !== undefined) {
        return typeof payload.title === "string";
    }
    return false;
}
