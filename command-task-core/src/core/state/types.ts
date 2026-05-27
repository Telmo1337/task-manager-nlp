import { Intent } from "../types";

export type TaskCandidate = { id: number; title: string; dueAt: string };

export type EditSubState =
  | "AWAITING_CHANGES"
  | "AWAITING_DESCRIPTION"
  | "AWAITING_TIME"
  | "AWAITING_DATE"
  | "AWAITING_TITLE"
  | "AWAITING_PRIORITY";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Slots = Record<string, any[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PendingCommand = { intent: Intent; payload: Record<string, any> };

export type ConversationState =
  | { kind: "IDLE"; slots: Slots }
  | { kind: "AWAITING_SLOT"; activeIntent: Intent; awaitingSlot: string; slots: Slots }
  | { kind: "AWAITING_OPTIONAL_TIME"; pendingCommand: PendingCommand; slots: Slots }
  | { kind: "PENDING_DELETE"; candidates: TaskCandidate[]; slots: Slots }
  | { kind: "PENDING_COMMAND"; pendingCommand: PendingCommand; slots: Slots }
  | { kind: "PENDING_DELETE_ALL"; slots: Slots }
  | { kind: "EDIT"; taskId: number; editSubState: EditSubState; slots: Slots };

export const initialState: ConversationState = { kind: "IDLE", slots: {} };
