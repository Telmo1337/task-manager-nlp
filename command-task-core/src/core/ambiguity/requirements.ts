import { Intent } from "../types";

export const REQUIRED_SLOTS: Record<Intent, string[]> = {
  CREATE_TASK: ["title", "date", "time"],
  LIST_TASKS: [],
  EDIT_TASK: ["id"],           // needs id first, then ask what to change
  DELETE_TASK: [],             // can use id or title
  DELETE_ALL_TASKS: [],        // requires confirmation only
  UNDO_ACTION: []
};
