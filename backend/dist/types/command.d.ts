import { ErrorCode } from "../errors/errorCodes";
export type CommandIntent = "CREATE_TASK" | "LIST_TASKS" | "DELETE_TASK" | "EDIT_TASK";
export interface Command {
    type: "COMMAND";
    intent: CommandIntent;
    payload: unknown;
}
export interface CommandError {
    code: ErrorCode;
    message: string;
}
export interface CommandResultSuccess<T = unknown> {
    status: "SUCCESS";
    intent: CommandIntent;
    data: T;
}
export interface CommandResultError {
    status: "ERROR";
    intent: CommandIntent;
    error: CommandError;
}
export type CommandResult<T = unknown> = CommandResultSuccess<T> | CommandResultError;
