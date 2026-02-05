import { ConversationState } from "./types";
import { Intent } from "../types";
export declare function resetState(): ConversationState;
export declare function startIntent(intent: Intent): ConversationState;
export declare function awaitSlot(state: ConversationState, slot: string): ConversationState;
export declare function fillSlot(state: ConversationState, slot: string, value: any): ConversationState;
