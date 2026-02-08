import { Intent } from "../types";


export interface ConversationState {
  activeIntent?: Intent;
  awaitingSlot?: string;

  // 🆕 slot opcional (ex: time)
  awaitingOptionalSlot?: "time";

  slots: Record<string, any[]>;

  pendingCommand?: {
    intent: Intent;
    payload: Record<string, any>;
  };

  // DELETE ambíguo
  pendingDelete?: {
    candidates: {
      id: number;
      title: string;
      dueAt: string;
    }[];
  };

  // EDIT ambíguo
  pendingEdit?: {
    candidates: {
      id: number;
      title: string;
      dueAt: string;
    }[];
    targetId?: number;
  };

  // EDIT - awaiting changes (we have the task ID, waiting for what to change)
  awaitingEditChanges?: {
    taskId: number;
  };

  // EDIT - awaiting specific field values
  awaitingDescription?: boolean;
  awaitingTime?: boolean;
  awaitingDate?: boolean;
  awaitingTitle?: boolean;
  awaitingPriority?: boolean;

  // DELETE ALL confirmation
  awaitingDeleteAllConfirmation?: boolean;
}

export const initialState: ConversationState = {
  slots: {},
};