import { Intent } from "../types";

export const INTENT_KEYWORDS: Record<Intent, string[]> = {
  CREATE_TASK: ["add", "create", "new", "schedule"],
  LIST_TASKS: ["list", "show", "view", "see", "calendar", "tasks i did", "tasks i have", "what tasks", "my tasks", "pending tasks", "completed tasks", "done tasks"],
  EDIT_TASK: ["edit", "change", "update", "move", "mark as"],
  DELETE_TASK: ["delete", "remove", "cancel task"],
  DELETE_ALL_TASKS: ["delete all", "remove all", "clear all", "delete everything", "remove everything"],
  UNDO_ACTION: ["undo", "revert", "go back", "undo that"]
};
