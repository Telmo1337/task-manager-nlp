import { ConversationState } from "./types";

import { Intent } from "../types";

/* ======================================================
   RESET TOTAL DO ESTADO
   ====================================================== */
export function resetState(): ConversationState {
  return {
    slots: {}
  };
}

/* ======================================================
   INICIAR UMA INTENÇÃO
   ====================================================== */
export function startIntent(intent: Intent): ConversationState {
  return {
    activeIntent: intent,
    slots: {}
  };
}

/* ======================================================
   MARCAR QUE ESTAMOS À ESPERA DE UM SLOT
   ====================================================== */
export function awaitSlot(
  state: ConversationState,
  slot: string
): ConversationState {
  return {
    ...state,
    awaitingSlot: slot
  };
}

/* ======================================================
   PREENCHER SLOT E LIMPAR awaitingSlot
   ====================================================== */
export function fillSlot(
  state: ConversationState,
  slot: string,
  value: any
): ConversationState {
  return {
    ...state,
    awaitingSlot: undefined, // ✅ nunca null
    slots: {
      ...state.slots,
      [slot]: [value]
    }
  };
}
