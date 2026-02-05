export type Intent =
  | "CREATE_TASK"
  | "LIST_TASKS"
  | "EDIT_TASK"
  | "DELETE_TASK"
  | "DELETE_ALL_TASKS"
  | "UNDO_ACTION";

export type CoreResult =
  | {
      type: "QUESTION";
      message: string;
    }
  | {
      type: "INFO";
      message: string;
    }
  | {
      type: "FINAL";
      intent: Intent;
      payload: Record<string, any>;
    };
