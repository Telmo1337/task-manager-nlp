import { runPipeline } from "../pipeline/runPipeline";
import { isDescriptionKeywordOnly } from "../slots/description";
import { resetState } from "../state/stateManager";
import { ConversationState } from "../state/types";
import { CoreResult, Intent } from "../types";

type EditState = Extract<ConversationState, { kind: "EDIT" }>;

function finalResult(
  intent: Intent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: Record<string, any>,
): CoreResult {
  return { type: "FINAL", intent, payload };
}

function extractNewTitle(text: string): string | null {
  const cleaned = text
    .replace(/^(change|rename|set|update)\s+(it\s+)?to\s+/i, "")
    .replace(/^(new\s+title|title)\s*[:=]?\s*/i, "")
    .replace(/^call\s+it\s+/i, "")
    .trim();

  if (!cleaned || cleaned.length < 2) return null;

  if (/^\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;
  if (/^(at\s+)?\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;
  if (/^(to\s+)?\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned)) return null;

  if (/^(today|tomorrow|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(cleaned)) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return null;
  if (/^(at\s+|to\s+)?(today|tomorrow|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(cleaned)) return null;

  if (/^(high|medium|low)\s*(priority)?$/i.test(cleaned)) return null;
  if (/^(to\s+)?(high|medium|low)\s*(priority)?$/i.test(cleaned)) return null;

  if (/^(time|date)\s+(to\s+)?\d/i.test(cleaned)) return null;
  if (/^(change\s+)?(time|date)/i.test(cleaned)) return null;

  return cleaned;
}

export function handleEditFlow(
  input: string,
  state: EditState,
): { result: CoreResult; state: ConversationState } {
  const normalized = input.trim().toLowerCase();
  const taskId = state.taskId;

  if (normalized === "cancel") {
    return {
      result: { type: "INFO", message: "Edit cancelled." },
      state: resetState(),
    };
  }

  if (isDescriptionKeywordOnly(input)) {
    return {
      result: {
        type: "QUESTION",
        message: "What description would you like to add?",
      },
      state: { ...state, editSubState: "AWAITING_DESCRIPTION" },
    };
  }

  if (/^(time|the\s+time|change\s+time)$/i.test(normalized)) {
    return {
      result: {
        type: "QUESTION",
        message: "What time would you like to set? (e.g., 5pm, 14:30)",
      },
      state: { ...state, editSubState: "AWAITING_TIME" },
    };
  }

  if (/^(date|the\s+date|change\s+date)$/i.test(normalized)) {
    return {
      result: {
        type: "QUESTION",
        message: "What date would you like to set? (e.g., tomorrow, next monday, feb 10)",
      },
      state: { ...state, editSubState: "AWAITING_DATE" },
    };
  }

  if (/^(title|the\s+title|name|change\s+title|rename)$/i.test(normalized)) {
    return {
      result: {
        type: "QUESTION",
        message: "What would you like to rename it to?",
      },
      state: { ...state, editSubState: "AWAITING_TITLE" },
    };
  }

  if (/^(priority|the\s+priority|change\s+priority)$/i.test(normalized)) {
    return {
      result: {
        type: "QUESTION",
        message: "What priority? (high, medium, or low)",
      },
      state: { ...state, editSubState: "AWAITING_PRIORITY" },
    };
  }

  if (state.editSubState === "AWAITING_DESCRIPTION") {
    return {
      result: finalResult("EDIT_TASK", { id: taskId, description: input.trim() }),
      state: resetState(),
    };
  }

  if (state.editSubState === "AWAITING_TIME") {
    const { ctx } = runPipeline(input);
    if (ctx.slots.time?.length) {
      return {
        result: finalResult("EDIT_TASK", { id: taskId, time: ctx.slots.time[0] }),
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

  if (state.editSubState === "AWAITING_DATE") {
    const { ctx } = runPipeline(input);
    if (ctx.slots.date?.length) {
      return {
        result: finalResult("EDIT_TASK", { id: taskId, date: ctx.slots.date[0] }),
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

  if (state.editSubState === "AWAITING_TITLE") {
    return {
      result: finalResult("EDIT_TASK", { id: taskId, title: input.trim() }),
      state: resetState(),
    };
  }

  if (state.editSubState === "AWAITING_PRIORITY") {
    const { ctx } = runPipeline(input);
    if (ctx.slots.priority?.length) {
      return {
        result: finalResult("EDIT_TASK", { id: taskId, priority: ctx.slots.priority[0] }),
        state: resetState(),
      };
    }
    const priorityMatch = input.toLowerCase().match(/\b(high|medium|low)\b/);
    if (priorityMatch) {
      return {
        result: finalResult("EDIT_TASK", { id: taskId, priority: priorityMatch[1].toUpperCase() }),
        state: resetState(),
      };
    }
    return {
      result: { type: "QUESTION", message: "Please choose: high, medium, or low." },
      state,
    };
  }

  const { ctx } = runPipeline(input);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = { id: taskId };

  if (ctx.slots.date?.length) payload.date = ctx.slots.date[0];
  if (ctx.slots.time?.length) payload.time = ctx.slots.time[0];
  if (ctx.slots.priority?.length) payload.priority = ctx.slots.priority[0];
  if (ctx.slots.description?.length) payload.description = ctx.slots.description[0];

  if (!payload.date && !payload.time && !payload.priority && !payload.description) {
    const newTitle = extractNewTitle(input);
    if (newTitle) payload.title = newTitle;
  }

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
