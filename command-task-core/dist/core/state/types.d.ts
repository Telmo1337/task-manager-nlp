import { Intent } from "../types";
export interface ConversationState {
    activeIntent?: Intent;
    awaitingSlot?: string;
    awaitingOptionalSlot?: "time";
    slots: Record<string, any[]>;
    pendingCommand?: {
        intent: Intent;
        payload: Record<string, any>;
    };
    pendingDelete?: {
        candidates: {
            id: number;
            title: string;
            dueAt: string;
        }[];
    };
    pendingEdit?: {
        candidates: {
            id: number;
            title: string;
            dueAt: string;
        }[];
        targetId?: number;
    };
    awaitingEditChanges?: {
        taskId: number;
    };
    awaitingDeleteAllConfirmation?: boolean;
}
export declare const initialState: ConversationState;
