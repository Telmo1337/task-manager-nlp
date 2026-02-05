"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpret = interpret;
const runPipeline_1 = require("./pipeline/runPipeline");
const intent_1 = require("./intent");
const normalize_1 = require("./payload/normalize");
const stateManager_1 = require("./state/stateManager");
const requirements_1 = require("./ambiguity/requirements");
/* =========================================
   Helper: extract new title for edit (preserves case)
   ========================================= */
function extractNewTitle(text) {
    // Remove common edit phrases but preserve the new title
    const cleaned = text
        .replace(/^(change|rename|set|update)\s+(it\s+)?to\s+/i, "")
        .replace(/^(new\s+title|title)\s*[:=]?\s*/i, "")
        .replace(/^call\s+it\s+/i, "")
        .trim();
    // If nothing left or same as input (no edit phrase found), 
    // check if it looks like a title (not a date/time)
    if (!cleaned || cleaned.length < 2)
        return null;
    // Don't treat dates/times as titles
    if (/^\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(cleaned))
        return null;
    if (/^(today|tomorrow|next\s+\w+)$/i.test(cleaned))
        return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned))
        return null;
    return cleaned;
}
/* =========================================
   Helper: resultado FINAL do core
   ========================================= */
function finalResult(intent, payload) {
    return {
        type: "FINAL",
        intent,
        payload,
    };
}
function interpret(input, state) {
    const normalized = input.trim().toLowerCase();
    /* =========================================
       ⏱️ SLOT OPCIONAL — TIME
       ========================================= */
    if (state.awaitingOptionalSlot === "time") {
        if (normalized === "no" || normalized === "skip") {
            return {
                result: finalResult(state.pendingCommand.intent, state.pendingCommand.payload),
                state: (0, stateManager_1.resetState)(),
            };
        }
        const { ctx } = (0, runPipeline_1.runPipeline)(input);
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
            result: finalResult(state.pendingCommand.intent, {
                ...state.pendingCommand.payload,
                time: ctx.slots.time[0],
            }),
            state: (0, stateManager_1.resetState)(),
        };
    }
    /* =========================================
       🗑️ DELETE ALL CONFIRMATION
       ========================================= */
    if (state.awaitingDeleteAllConfirmation) {
        if (normalized === "yes" || normalized === "y") {
            return {
                result: finalResult("DELETE_ALL_TASKS", {}),
                state: (0, stateManager_1.resetState)(),
            };
        }
        if (normalized === "no" || normalized === "n" || normalized === "cancel") {
            return {
                result: { type: "INFO", message: "Cancelled. No tasks were deleted." },
                state: (0, stateManager_1.resetState)(),
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
                state: (0, stateManager_1.resetState)(),
            };
        }
        // Parse what the user wants to change
        const { ctx } = (0, runPipeline_1.runPipeline)(input);
        const payload = {
            id: state.awaitingEditChanges.taskId,
        };
        // Extract new title if present (use original input to preserve case)
        const newTitle = extractNewTitle(input);
        if (newTitle) {
            payload.title = newTitle;
        }
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
        // If nothing meaningful was extracted, ask again
        if (!payload.title && !payload.date && !payload.time && !payload.priority) {
            return {
                result: {
                    type: "QUESTION",
                    message: "What would you like to change? (new title, date, time, or priority)",
                },
                state,
            };
        }
        return {
            result: finalResult("EDIT_TASK", payload),
            state: (0, stateManager_1.resetState)(),
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
                    state: (0, stateManager_1.resetState)(),
                };
            }
        }
        if (/earliest|first/.test(normalized)) {
            const task = [...state.pendingDelete.candidates].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];
            return {
                result: finalResult("DELETE_TASK", { id: task.id }),
                state: (0, stateManager_1.resetState)(),
            };
        }
        if (/last|latest/.test(normalized)) {
            const task = [...state.pendingDelete.candidates].sort((a, b) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime())[0];
            return {
                result: finalResult("DELETE_TASK", { id: task.id }),
                state: (0, stateManager_1.resetState)(),
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
                result: finalResult(state.pendingCommand.intent, state.pendingCommand.payload),
                state: (0, stateManager_1.resetState)(),
            };
        }
        if (normalized === "no" || normalized === "cancel") {
            return {
                result: { type: "INFO", message: "Action cancelled." },
                state: (0, stateManager_1.resetState)(),
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
                state: (0, stateManager_1.resetState)(),
            };
        }
        const { ctx } = (0, runPipeline_1.runPipeline)(input);
        const updatedState = {
            ...state,
            slots: {
                ...state.slots,
                ...(ctx.slots[state.awaitingSlot]
                    ? { [state.awaitingSlot]: ctx.slots[state.awaitingSlot] }
                    : {}),
            },
        };
        const mergedSlots = {
            ...updatedState.slots,
            ...ctx.slots,
        };
        /* 🔥 AQUI ESTÁ A CORREÇÃO CRÍTICA 🔥 */
        const required = requirements_1.REQUIRED_SLOTS[state.activeIntent];
        const missing = required.find(slot => !mergedSlots[slot] || mergedSlots[slot].length === 0);
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
            result: finalResult(state.activeIntent, (0, normalize_1.normalizePayload)(mergedSlots)),
            state: (0, stateManager_1.resetState)(),
        };
    }
    /* =========================================
       🆕 NOVO INPUT
       ========================================= */
    const { ctx } = (0, runPipeline_1.runPipeline)(input);
    const detected = (0, intent_1.detectIntent)(input);
    if (!detected.primary) {
        return {
            result: { type: "INFO", message: "I didn’t understand that." },
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
                message: "⚠️ Are you sure you want to delete ALL tasks? This cannot be undone. (yes/no)",
            },
            state: {
                ...state,
                awaitingDeleteAllConfirmation: true,
            },
        };
    }
    const required = requirements_1.REQUIRED_SLOTS[intent];
    const slots = ctx.slots;
    const missing = required.find(slot => !slots[slot] || slots[slot].length === 0);
    if (missing) {
        return {
            result: {
                type: "QUESTION",
                message: `Please provide ${missing}.`,
            },
            state: (0, stateManager_1.awaitSlot)({
                activeIntent: intent,
                slots,
            }, missing),
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
        if (hasTitle || hasDate || hasTime || hasPriority) {
            // User provided changes inline, execute directly
            return {
                result: finalResult(intent, (0, normalize_1.normalizePayload)(slots)),
                state: (0, stateManager_1.resetState)(),
            };
        }
        // No changes provided, ask what to change
        return {
            result: {
                type: "QUESTION",
                message: "What would you like to change? (new title, date, time, or priority)",
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
        result: finalResult(intent, (0, normalize_1.normalizePayload)(slots)),
        state: (0, stateManager_1.resetState)(),
    };
}
