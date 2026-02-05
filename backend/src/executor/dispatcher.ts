import { Command, RawInputPayload } from "../../../shared/command.schema";
import { CommandResult } from "../../../shared/command.result";

import { createTaskHandler } from "./handlers/createTask.handler";
import { listTasksHandler } from "./handlers/listTasks.handler";
import { deleteTaskHandler } from "./handlers/deleteTask.handler";
import { deleteAllTasksHandler } from "./handlers/deleteAllTasks.handler";
import { editTaskHandler } from "./handlers/editTask.handler";
import { handleUndoAction } from "./handlers/undoAction.handler";

import { interpret } from "../../../command-task-core/src";
import { initialState, ConversationState } from "../../../command-task-core/src/core/state/types";
import { mapCoreResultToCommandResult } from "./mapCoreResultToCommandResult";

// 🔥 Session-based state storage (use Redis in production)
const sessionStates = new Map<string, ConversationState>();

// Session cleanup after 30 minutes of inactivity
const SESSION_TTL = 30 * 60 * 1000;
const sessionTimestamps = new Map<string, number>();

function cleanupOldSessions() {
  const now = Date.now();
  for (const [sessionId, timestamp] of sessionTimestamps) {
    if (now - timestamp > SESSION_TTL) {
      sessionStates.delete(sessionId);
      sessionTimestamps.delete(sessionId);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupOldSessions, 5 * 60 * 1000);

function getSessionState(sessionId: string): ConversationState {
  sessionTimestamps.set(sessionId, Date.now());
  return sessionStates.get(sessionId) || { ...initialState };
}

function setSessionState(sessionId: string, state: ConversationState) {
  sessionTimestamps.set(sessionId, Date.now());
  sessionStates.set(sessionId, state);
}

export async function dispatchCommand(
  command: Command,
  sessionId: string = "default"
): Promise<CommandResult> {

  /* ================================
     🧠 RAW INPUT → CORE
     ================================ */
  if (command.intent === "RAW_INPUT") {
    const payload = command.payload as RawInputPayload;
    const conversationState = getSessionState(sessionId);

    const { result, state } = interpret(payload.text, conversationState);
    setSessionState(sessionId, state);

    // ⬅️ SÓ aqui executamos backend
    if (result.type === "FINAL") {
      return dispatchCommand({
        type: "COMMAND",
        intent: result.intent,
        payload: result.payload,
      }, sessionId);
    }

    // QUESTION / INFO
    return mapCoreResultToCommandResult(result)!;
  }

  /* ================================
     🚀 COMANDOS FINAIS
     ================================ */
  switch (command.intent) {
    case "CREATE_TASK":
      return createTaskHandler(command.payload, sessionId);

    case "LIST_TASKS":
      return listTasksHandler(command.payload);

    case "DELETE_TASK":
      return deleteTaskHandler(command.payload, sessionId);

    case "DELETE_ALL_TASKS":
      return deleteAllTasksHandler();

    case "EDIT_TASK":
      return editTaskHandler(command.payload, sessionId);

    case "UNDO_ACTION":
      return handleUndoAction(sessionId);

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
