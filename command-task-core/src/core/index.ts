import { runPipeline } from "./pipeline/runPipeline";
import { detectIntent } from "./intent";
import { normalizePayload } from "./payload/normalize";
import { isDescriptionKeywordOnly } from "./slots/description";

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
   Helper: detect conversational/help questions
   ========================================= */
function getConversationalResponse(text: string): string | null {
  const lower = text.toLowerCase().trim();
  
  // Identity questions
  if (/\b(who|what)\s+(are|r)\s+(you|u)\b/.test(lower) || 
      /\bwhat('?s| is)\s+this\b/.test(lower)) {
    return "Hi! I'm your personal Task Manager assistant. I help you organize your tasks, set reminders, and stay on top of your schedule. Just tell me what you need!";
  }
  
  // Name questions
  if (/\b(what('?s| is)\s+(your|ur)\s+name|do you have a name)\b/.test(lower)) {
    return "I'm Task Manager, your friendly productivity assistant! You can just call me TM if you like. 😊";
  }
  
  // Creator questions
  if (/\b(who\s+(made|created|built|designed)\s+(you|this)|who('?s| is)\s+(your|ur)\s+(creator|maker|developer))\b/.test(lower)) {
    return "I was crafted with care to help you stay organized and productive. Think of me as your digital sidekick!";
  }
  
  // Capability questions  
  if (/\b(what|how)\s+(can|do)\s+(you|u)\s+(do|help)\b/.test(lower) ||
      /\bwhat\s+(do|can)\s+(you|u)\b/.test(lower) ||
      /\b(your|ur)\s+(capabilities|features|functions)\b/.test(lower)) {
    return "I can help you with:\n• Create tasks: 'add buy groceries tomorrow at 3pm'\n• View tasks: 'show my tasks' or 'tasks for today'\n• Edit tasks: 'edit #1 to Friday'\n• Delete tasks: 'delete task #1'\n• Set priorities: 'high priority meeting tomorrow'\n• Add descriptions: 'description: bring the documents'";
  }
  
  // Help request
  if (/^help\b/.test(lower) || /\bhow\s+to\s+use\b/.test(lower) || /\bhelp\s+me\b/.test(lower)) {
    return "Here's how to use me:\n• Create: 'create task [name] [date] [time]'\n• List: 'show tasks', 'today's tasks', 'pending tasks'\n• Edit: 'edit #[id] [changes]'\n• Delete: 'delete #[id]' or 'delete all'\n• Undo: 'undo'\nTip: You can use natural language like 'remind me to call mom tomorrow at 5pm'!";
  }
  
  // Explain / Commands / Examples
  if (/^(explain|commands?|examples?|show\s+commands?|what\s+can\s+i\s+(say|type|do)|options)\b/.test(lower)) {
    return `**Quick Commands:**

**Creating Tasks:**
• "add meeting tomorrow at 2pm"
• "create buy groceries next friday"
• "remind me to call mom at 5pm"
• "high priority report due monday"

**Viewing Tasks:**
• "show my tasks" or "list tasks"
• "today's tasks" or "tasks for today"
• "pending tasks" or "completed tasks"
• "show tasks for february 10"

**Editing Tasks:**
• "edit #5 to next week"
• "change #3 to high priority"
• "rename #2 to new title"
• "edit #1 description: add notes here"

**Deleting Tasks:**
• "delete #5" or "remove task #5"
• "delete all tasks"

**Other:**
• "undo" - undo last action
• "help" - show help
• "who are you?" - about me`;
  }
  
  // Greetings
  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening)|howdy|yo|sup|what'?s\s+up)\b/.test(lower)) {
    return "Hello! I'm ready to help you manage your tasks. What would you like to do today?";
  }
  
  // Goodbye
  if (/^(bye|goodbye|see\s+(you|ya)|later|good\s*night|cya|gtg)\b/.test(lower)) {
    return "Goodbye! Stay productive and come back anytime you need help with your tasks! 👋";
  }
  
  // Thanks
  if (/^(thanks|thank\s+you|thx|ty|appreciate\s+it)\b/.test(lower)) {
    return "You're welcome! Let me know if you need anything else. 😊";
  }
  
  // How are you
  if (/\bhow\s+(are|r)\s+(you|u)\b/.test(lower) || /\bhow('?s| is)\s+it\s+going\b/.test(lower)) {
    return "I'm doing great, thanks for asking! Ready to help you stay organized. What can I do for you?";
  }
  
  // Compliments
  if (/\b(you('?re| are)\s+(great|awesome|amazing|the\s+best|helpful|cool)|good\s+(job|work)|nice|well\s+done|love\s+(you|this))\b/.test(lower)) {
    return "Aw, thank you! That means a lot. I'm here to make your life easier! 💪";
  }
  
  // Apologies
  if (/^(sorry|my\s+bad|oops|whoops|apologies)\b/.test(lower)) {
    return "No worries at all! How can I help you?";
  }
  
  // Frustration
  if (/\b(this\s+(sucks|is\s+bad)|you('?re| are)\s+(bad|useless|stupid|dumb)|i\s+hate\s+(you|this)|ugh|argh)\b/.test(lower)) {
    return "I'm sorry you're frustrated. Let me try to help - what are you trying to do? Maybe I can explain it better.";
  }
  
  // Jokes
  if (/\b(tell\s+(me\s+)?a\s+joke|make\s+me\s+laugh|say\s+something\s+funny|joke)\b/.test(lower)) {
    const jokes = [
      "Why did the task go to therapy? It had too many issues to resolve! 😄",
      "I tried to organize a hide and seek tournament, but it was a disaster. Good players are hard to find!",
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "What do you call a task that's been waiting forever? Pro-crastinated! ⏰"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  // Motivation
  if (/\b(motivate\s+me|i('?m| am)\s+(stressed|overwhelmed|tired|lazy)|need\s+motivation|inspire\s+me)\b/.test(lower)) {
    const quotes = [
      "You've got this! Remember: every big accomplishment starts with a single task. Let's tackle one thing at a time! 💪",
      "Take a deep breath. Progress, not perfection! What's one small task you can finish right now?",
      "Even the longest journey begins with a single step. You're doing great just by being here! ⭐",
      "Feeling overwhelmed? Let's break things down. Show me your tasks and we'll prioritize together!"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  // Boredom
  if (/\b(i('?m| am)\s+bored|nothing\s+to\s+do|bored)\b/.test(lower)) {
    return "Bored? Perfect time to get ahead! Try 'show my tasks' to see what you can knock out, or create a new task for something you've been putting off!";
  }
  
  // Productivity tips
  if (/\b(productivity\s+tips?|how\s+to\s+be\s+(productive|organized)|tips?|advice)\b/.test(lower)) {
    return "Here are some productivity tips:\n• Break big tasks into smaller ones\n• Use priorities (urgent, high, normal, low)\n• Set specific times for tasks\n• Review your completed tasks to stay motivated\n• Don't forget to take breaks! 🧘";
  }
  
  // OK/acknowledgment (but not if it's part of a task)
  if (/^(ok|okay|alright|got\s+it|understood|sure|k|kk)\.?$/i.test(lower)) {
    return "Great! What would you like to do next?";
  }
  
  // Nevermind/cancel
  if (/^(never\s*mind|nvm|forget\s+it|cancel|nope|nothing)\b/.test(lower)) {
    return "No problem! Let me know when you need something.";
  }
  
  // Love/like
  if (/\bi\s+(love|like)\s+(you|this|using\s+this)\b/.test(lower)) {
    return "That makes me happy! I love helping you stay on top of things! ❤️";
  }
  
  // What day/time (redirect)
  if (/\b(what\s+(day|time)\s+is\s+it|what('?s| is)\s+(the\s+)?(date|time|day))\b/.test(lower)) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return `Today is ${dateStr}. Need to create a task for today?`;
  }
  
  // Random fun
  if (/\b(flip\s+a?\s*coin|heads\s+or\s+tails)\b/.test(lower)) {
    return Math.random() < 0.5 ? "🪙 Heads!" : "🪙 Tails!";
  }
  
  if (/\b(roll\s+(a\s+)?dice?|roll\s+d6)\b/.test(lower)) {
    return `🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}!`;
  }
  
  // Easter eggs
  if (/\b(sing|song|music)\b/.test(lower)) {
    return "🎵 Task, task, baby! Too many tasks to do today... 🎵 (I'm better at organizing than singing!)";
  }
  
  if (/\b(meaning\s+of\s+life|42)\b/.test(lower)) {
    return "42? Ah, I see you're a person of culture! But here, the meaning of life is getting things done! 📋";
  }

  return null;
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
