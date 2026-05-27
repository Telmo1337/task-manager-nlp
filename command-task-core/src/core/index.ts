import { runPipeline } from "./pipeline/runPipeline";
import { detectIntent } from "./intent";
import { normalizePayload } from "./payload/normalize";
import { isDescriptionKeywordOnly } from "./slots/description";
import { getConversationalResponse } from "./conversational";

import {
  awaitSlot,
  resetState,
} from "./state/stateManager";

import { ConversationState } from "./state/types";
import { CoreResult, Intent } from "./types";
import { REQUIRED_SLOTS } from "./ambiguity/requirements";

/* =========================================
   Helper: extract new title for edit (preserves case)
   ========================================= */
function extractNewTitle(text: string): string | null {
  // Remove common edit phrases but preserve the new title
  const cleaned = text
    .replace(/^(change|rename|set|update)\s+(it\s+)?to\s+/i, "")
    .replace(/^(new\s+title|title)\s*[:=]?\s*/i, "")
    .replace(/^call\s+it\s+/i, "")
    .trim();
  
  // If nothing left or same as input (no edit phrase found), 
  // check if it looks like a title (not a date/time)
  if (!cleaned || cleaned.length < 2) return null;
  
  // Don't treat times as titles (various formats)
  if (/^\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;
  if (/^(at\s+)?\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;
  if (/^(to\s+)?\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;
  
  // Don't treat dates as titles
  if (/^(today|tomorrow|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(cleaned)) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return null;
  if (/^(at\s+|to\s+)?(today|tomorrow|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(cleaned)) return null;
  
  // Don't treat priority as titles
  if (/^(high|medium|low)\s*(priority)?$/i.test(cleaned)) return null;
  if (/^(to\s+)?(high|medium|low)\s*(priority)?$/i.test(cleaned)) return null;
  
  // Don't treat time-related word phrases as titles
  if (/^(time|date)\s+(to\s+)?\d/i.test(cleaned)) return null;
  if (/^(change\s+)?(time|date)/i.test(cleaned)) return null;
  
  return cleaned;
}

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
    if (normalized === "cancel") {
      return {
        result: { type: "INFO", message: "Edit cancelled." },
        state: resetState(),
      };
    }

    // Check if user typed just "description" keyword - prompt for the actual description
    if (isDescriptionKeywordOnly(input)) {
      return {
        result: {
          type: "QUESTION",
          message: "What description would you like to add?",
        },
        state: {
          ...state,
          awaitingDescription: true,
        },
      };
    }

    // Check if user typed just "time" keyword - prompt for the actual time
    if (/^(time|the\s+time|change\s+time)$/i.test(normalized)) {
      return {
        result: {
          type: "QUESTION",
          message: "What time would you like to set? (e.g., 5pm, 14:30)",
        },
        state: {
          ...state,
          awaitingTime: true,
        },
      };
    }

    // Check if user typed just "date" keyword - prompt for the actual date
    if (/^(date|the\s+date|change\s+date)$/i.test(normalized)) {
      return {
        result: {
          type: "QUESTION",
          message: "What date would you like to set? (e.g., tomorrow, next monday, feb 10)",
        },
        state: {
          ...state,
          awaitingDate: true,
        },
      };
    }

    // Check if user typed just "title" keyword - prompt for the actual title
    if (/^(title|the\s+title|name|change\s+title|rename)$/i.test(normalized)) {
      return {
        result: {
          type: "QUESTION",
          message: "What would you like to rename it to?",
        },
        state: {
          ...state,
          awaitingTitle: true,
        },
      };
    }

    // Check if user typed just "priority" keyword - prompt for the actual priority
    if (/^(priority|the\s+priority|change\s+priority)$/i.test(normalized)) {
      return {
        result: {
          type: "QUESTION",
          message: "What priority? (high, medium, or low)",
        },
        state: {
          ...state,
          awaitingPriority: true,
        },
      };
    }

    // If awaiting description text, use the entire input as description
    if (state.awaitingDescription) {
      return {
        result: finalResult("EDIT_TASK", {
          id: state.awaitingEditChanges.taskId,
          description: input.trim(),
        }),
        state: resetState(),
      };
    }

    // If awaiting time, parse and use the time
    if (state.awaitingTime) {
      const { ctx } = runPipeline(input);
      if (ctx.slots.time?.length) {
        return {
          result: finalResult("EDIT_TASK", {
            id: state.awaitingEditChanges.taskId,
            time: ctx.slots.time[0],
          }),
          state: resetState(),
        };
      }
      return {
        result: {
          type: "QUESTION",
          message: "I didn't understand that time. Try something like '5pm' or '14:30'.",
        },
        state,
      };
    }

    // If awaiting date, parse and use the date
    if (state.awaitingDate) {
      const { ctx } = runPipeline(input);
      if (ctx.slots.date?.length) {
        return {
          result: finalResult("EDIT_TASK", {
            id: state.awaitingEditChanges.taskId,
            date: ctx.slots.date[0],
          }),
          state: resetState(),
        };
      }
      return {
        result: {
          type: "QUESTION",
          message: "I didn't understand that date. Try 'tomorrow', 'next monday', or 'feb 10'.",
        },
        state,
      };
    }

    // If awaiting title, use the entire input as title
    if (state.awaitingTitle) {
      return {
        result: finalResult("EDIT_TASK", {
          id: state.awaitingEditChanges.taskId,
          title: input.trim(),
        }),
        state: resetState(),
      };
    }

    // If awaiting priority, parse and use the priority
    if (state.awaitingPriority) {
      const { ctx } = runPipeline(input);
      if (ctx.slots.priority?.length) {
        return {
          result: finalResult("EDIT_TASK", {
            id: state.awaitingEditChanges.taskId,
            priority: ctx.slots.priority[0],
          }),
          state: resetState(),
        };
      }
      // Try to match priority directly
      const priorityMatch = input.toLowerCase().match(/\b(high|medium|low)\b/);
      if (priorityMatch) {
        return {
          result: finalResult("EDIT_TASK", {
            id: state.awaitingEditChanges.taskId,
            priority: priorityMatch[1].toUpperCase(),
          }),
          state: resetState(),
        };
      }
      return {
        result: {
          type: "QUESTION",
          message: "Please choose: high, medium, or low.",
        },
        state,
      };
    }

    // Parse what the user wants to change
    const { ctx } = runPipeline(input);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      id: state.awaitingEditChanges.taskId,
    };

    // Extract new date if present
    if (ctx.slots.date?.length) {
      payload.date = ctx.slots.date[0];
    }

    // Extract new time if present
    if (ctx.slots.time?.length) {
      payload.time = ctx.slots.time[0];
    }

    // Extract new priority if present
    if (ctx.slots.priority?.length) {
      payload.priority = ctx.slots.priority[0];
    }

    // Extract new description if present
    if (ctx.slots.description?.length) {
      payload.description = ctx.slots.description[0];
    }

    // Only extract title if no date/time/priority was found
    // This prevents "at 5pm" from being treated as a title
    if (!payload.date && !payload.time && !payload.priority && !payload.description) {
      const newTitle = extractNewTitle(input);
      if (newTitle) {
        payload.title = newTitle;
      }
    }

    // If nothing meaningful was extracted, ask again
    if (!payload.title && !payload.date && !payload.time && !payload.priority && !payload.description) {
      return {
        result: {
          type: "QUESTION",
          message: "What would you like to change? (new title, date, time, priority, or description)",
        },
        state,
      };
    }

    return {
      result: finalResult("EDIT_TASK", payload),
      state: resetState(),
    };
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
