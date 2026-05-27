import { runPipeline } from "./pipeline/runPipeline";
import { detectIntent } from "./intent";
import { normalizePayload } from "./payload/normalize";
import { getConversationalResponse } from "./conversational";
import { handleEditFlow } from "./flows/editFlow";

import {
  awaitSlot,
  resetState,
} from "./state/stateManager";

import { ConversationState } from "./state/types";
import { CoreResult, Intent } from "./types";
import { REQUIRED_SLOTS } from "./ambiguity/requirements";

/* =========================================
   Helper: resultado FINAL do core
   ========================================= */
function finalResult(
  intent: Intent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>
): CoreResult {
  return {
    type: "FINAL",
    intent,
    payload,
  };
}

export function interpret(
  input: string,
  state: ConversationState,
): { result: CoreResult; state: ConversationState } {
  const normalized = input.trim().toLowerCase();

  /* =========================================
     ⏱️ SLOT OPCIONAL — TIME
     ========================================= */
  if (state.awaitingOptionalSlot === "time") {
    if (normalized === "no" || normalized === "skip") {
      return {
        result: finalResult(
          state.pendingCommand!.intent,
          state.pendingCommand!.payload
        ),
        state: resetState(),
      };
    }

    const { ctx } = runPipeline(input);

    if (!ctx.slots.time) {
      return {
        result: {
          type: "QUESTION",
          message: "Please provide a valid time or type 'no'.",
        },
        state,
      };
    }

    return {
      result: finalResult(state.pendingCommand!.intent, {
        ...state.pendingCommand!.payload,
        time: ctx.slots.time[0],
      }),
      state: resetState(),
    };
  }

  /* =========================================
     🗑️ DELETE ALL CONFIRMATION
     ========================================= */
  if (state.awaitingDeleteAllConfirmation) {
    if (normalized === "yes" || normalized === "y") {
      return {
        result: finalResult("DELETE_ALL_TASKS", {}),
        state: resetState(),
      };
    }

    if (normalized === "no" || normalized === "n" || normalized === "cancel") {
      return {
        result: { type: "INFO", message: "Cancelled. No tasks were deleted." },
        state: resetState(),
      };
    }

    return {
      result: {
        type: "QUESTION",
        message: "Please answer yes or no.",
      },
      state,
    };
  }

  /* =========================================
     ✏️ EDIT - AWAITING CHANGES
     ========================================= */
  if (state.awaitingEditChanges) {
    return handleEditFlow(input, state);
  }

  /* =========================================
     🧠 DELETE AMBÍGUO
     ========================================= */
  if (state.pendingDelete) {
    const id = Number(normalized.replace("#", ""));
    if (!Number.isNaN(id)) {
      const match = state.pendingDelete.candidates.find(t => t.id === id);
      if (match) {
        return {
          result: finalResult("DELETE_TASK", { id }),
          state: resetState(),
        };
      }
    }

    if (/earliest|first/.test(normalized)) {
      const task = [...state.pendingDelete.candidates].sort(
        (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
      )[0];

      return {
        result: finalResult("DELETE_TASK", { id: task.id }),
        state: resetState(),
      };
    }

    if (/last|latest/.test(normalized)) {
      const task = [...state.pendingDelete.candidates].sort(
        (a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime(),
      )[0];

      return {
        result: finalResult("DELETE_TASK", { id: task.id }),
        state: resetState(),
      };
    }

    return {
      result: {
        type: "QUESTION",
        message: "Please choose by ID (e.g. 4), earliest, or latest.",
      },
      state,
    };
  }

  /* =========================================
     ✅ CONFIRMAÇÃO DE COMANDO
     ========================================= */
  if (state.pendingCommand) {
    if (normalized === "yes") {
      return {
        result: finalResult(
          state.pendingCommand.intent,
          state.pendingCommand.payload,
        ),
        state: resetState(),
      };
    }

    if (normalized === "no" || normalized === "cancel") {
      return {
        result: { type: "INFO", message: "Action cancelled." },
        state: resetState(),
      };
    }

    return {
      result: {
        type: "QUESTION",
        message: "Please answer yes or no.",
      },
      state,
    };
  }

  /* =========================================
     ⏳ À ESPERA DE SLOT
     ========================================= */
  if (state.activeIntent && state.awaitingSlot) {
    if (normalized === "cancel") {
      return {
        result: { type: "INFO", message: "Action cancelled." },
        state: resetState(),
      };
    }

    const { ctx } = runPipeline(input);

    const updatedState: ConversationState = {
      ...state,
      slots: {
        ...state.slots,
        ...(ctx.slots[state.awaitingSlot]
          ? { [state.awaitingSlot]: ctx.slots[state.awaitingSlot] }
          : {}),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergedSlots: Record<string, any[]> = {
      ...updatedState.slots,
      ...ctx.slots,
    };

    /* 🔥 AQUI ESTÁ A CORREÇÃO CRÍTICA 🔥 */
    const required = REQUIRED_SLOTS[state.activeIntent];
    const missing = required.find(
      slot => !mergedSlots[slot] || mergedSlots[slot].length === 0
    );

    if (missing) {
      return {
        result: {
          type: "QUESTION",
          message: `Please provide ${missing}.`,
        },
        state: {
          ...updatedState,
          awaitingSlot: missing,
        },
      };
    }

    return {
      result: finalResult(
        state.activeIntent,
        normalizePayload(mergedSlots),
      ),
      state: resetState(),
    };
  }

  /* =========================================
     🆕 NOVO INPUT
     ========================================= */
  const { ctx } = runPipeline(input);
  const detected = detectIntent(input);

  // Check for conversational questions first
  const conversationalResponse = getConversationalResponse(input);
  if (conversationalResponse) {
    return {
      result: { type: "INFO", message: conversationalResponse },
      state,
    };
  }

  if (!detected.primary) {
    return {
      result: { type: "INFO", message: "Hmm, I'm not sure what you mean. Try something like 'create a task', 'show my tasks', or 'delete task #1'." },
      state,
    };
  }

  const intent = detected.primary;
  /* =========================================
     🗑️ DELETE ALL TASKS - requires confirmation
     ========================================= */
  if (intent === "DELETE_ALL_TASKS") {
    return {
      result: {
        type: "QUESTION",
        message: "Are you sure you want to delete ALL tasks? This cannot be undone. (yes/no)",
      },
      state: {
        ...state,
        awaitingDeleteAllConfirmation: true,
      },
    };
  }
  const required = REQUIRED_SLOTS[intent];
  const slots = ctx.slots;

  const missing = required.find(
    slot => !slots[slot] || slots[slot].length === 0
  );

  if (missing) {
    return {
      result: {
        type: "QUESTION",
        message: `Please provide ${missing}.`,
      },
      state: awaitSlot(
        {
          activeIntent: intent,
          slots,
        },
        missing,
      ),
    };
  }

  /* =========================================
     ✏️ EDIT_TASK - ask what to change
     ========================================= */
  if (intent === "EDIT_TASK" && slots.id?.length) {
    // Check if user already provided changes in the same command
    // e.g., "edit #22 to buy groceries" or "change #22 to tomorrow"
    const hasTitle = slots.title?.length && slots.title[0];
    const hasDate = slots.date?.length;
    const hasTime = slots.time?.length;
    const hasPriority = slots.priority?.length;
    const hasDescription = slots.description?.length;
    
    if (hasTitle || hasDate || hasTime || hasPriority || hasDescription) {
      // User provided changes inline, execute directly
      return {
        result: finalResult(intent, normalizePayload(slots)),
        state: resetState(),
      };
    }
    
    // No changes provided, ask what to change
    return {
      result: {
        type: "QUESTION",
        message: "What would you like to change? (new title, date, time, priority, or description)",
      },
      state: {
        ...state,
        awaitingEditChanges: {
          taskId: Number(slots.id[0]),
        },
      },
    };
  }

  return {
    result: finalResult(intent, normalizePayload(slots)),
    state: resetState(),
  };
}
