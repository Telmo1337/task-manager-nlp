import type { CommandIntent } from "./command.intent";

export type ErrorCode =
  | "INVALID_COMMAND"
  | "UNKNOWN_INTENT"
  | "INVALID_TASK_ID"
  | "TASK_NOT_FOUND"
  | "TITLE_AND_DATE_REQUIRED"
  | "NO_FIELDS_TO_UPDATE"
  | "CREATE_TASK_FAILED"
  | "LIST_TASKS_FAILED"
  | "DELETE_TASK_FAILED"
  | "EDIT_TASK_FAILED"
  | "DUPLICATE_TASK"
  | "AMBIGUOUS_DELETE"
  | "NOTHING_TO_UNDO"
  | "UNDO_FAILED";

export interface CommandError {
  code: ErrorCode;
  message: string;
}

export type CommandResult<T = unknown> =
  | {
      status: "SUCCESS";
      intent: CommandIntent;
      data: T;
    }
  | {
      status: "ERROR";
      intent: CommandIntent;
      error: CommandError;
    }
  | {
      status: "QUESTION";
      message: string;
    };
