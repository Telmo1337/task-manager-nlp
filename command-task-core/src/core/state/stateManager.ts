import { ConversationState } from "./types";
import { Intent } from "../types";

export function resetState(): ConversationState {
  return { kind: "IDLE", slots: {} };
}

export function awaitSlot(
  activeIntent: Intent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slots: Record<string, any[]>,
  slot: string,
): ConversationState {
  return {
    kind: "AWAITING_SLOT",
    activeIntent,
    awaitingSlot: slot,
    slots,
  };
}
