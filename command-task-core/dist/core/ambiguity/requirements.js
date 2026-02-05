"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_SLOTS = void 0;
exports.REQUIRED_SLOTS = {
    CREATE_TASK: ["title", "date", "time"],
    LIST_TASKS: [],
    EDIT_TASK: ["id"], // needs id first, then ask what to change
    DELETE_TASK: [], // can use id or title
    DELETE_ALL_TASKS: [], // requires confirmation only
    UNDO_ACTION: []
};
