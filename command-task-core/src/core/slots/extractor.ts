import { Intent } from "../types";
import { ExtractedSlots } from "./types";
import { extractDates } from "./date";
import { extractTimes } from "./time";
import { extractTitle } from "./title";
import { extractRecurrence, recurrenceToString } from "./recurrence";
import { extractPriority } from "./priority";
import { extractDescription, removeDescriptionFromText } from "./description";

export function extractSlots(
  text: string,
  intent: Intent | null
): ExtractedSlots {
  const slots: Record<string, any[]> = {};
  const lower = text.toLowerCase();

  /* ======================================================
     🆔 ID — DELETE / EDIT (supports #1 or just 1)
     ====================================================== */
  if (intent === "DELETE_TASK" || intent === "EDIT_TASK") {
    // Match #1 or standalone numbers
    const hashIdMatch = text.match(/#(\d+)/);
    if (hashIdMatch) {
      slots.id = [Number(hashIdMatch[1])];
    } else {
      const idMatch = text.match(/\b(\d+)\b/);
      if (idMatch) {
        slots.id = [Number(idMatch[1])];
      }
    }
    
    // Also extract title for delete by name
    if (!slots.id) {
      const titleMatch = text.match(/(?:delete|remove)\s+(?:task\s+)?["']?([^"']+)["']?/i);
      if (titleMatch) {
        const title = titleMatch[1].trim()
          .replace(/^(the|task)\s+/i, '')
          .trim();
        if (title && title.length > 0) {
          slots.title = [title];
        }
      }
    }
  }

  /* ======================================================
     📋 LIST FILTERS
     ====================================================== */
  if (intent === "LIST_TASKS") {
    // Check for completed/done tasks
    if (/\b(completed|done|finished|i\s+did)\b/.test(lower)) {
      // Check if asking for tasks done on a specific date
      if (/\byesterday\b/.test(lower)) {
        slots.filter = ["COMPLETED_ON_DATE"];
        slots.value = ["yesterday"];
      } else {
        const dates = extractDates(text);
        if (dates.length) {
          slots.filter = ["COMPLETED_ON_DATE"];
          slots.value = dates;
        } else {
          slots.filter = ["COMPLETED"];
        }
      }
    }
    // Check for pending tasks
    else if (/\b(pending|todo|to\s*-?\s*do|not\s+done|remaining)\b/.test(lower)) {
      slots.filter = ["PENDING"];
    }
    // Check for daily/today's tasks
    else if (/\b(daily|today'?s?)\b/.test(lower)) {
      slots.filter = ["TODAY"];
    }
    // Check for tomorrow
    else if (/\btomorrow'?s?\b/.test(lower)) {
      slots.filter = ["TOMORROW"];
    }
    // Check for specific date
    else {
      const dates = extractDates(text);
      if (dates.length) {
        if (dates[0] === "today") {
          slots.filter = ["TODAY"];
        } else if (dates[0] === "tomorrow") {
          slots.filter = ["TOMORROW"];
        } else {
          slots.filter = ["DATE"];
          slots.value = dates;
        }
      }
    }
  }

  /* ======================================================
     📅 DATE
     ====================================================== */
  if (intent !== "LIST_TASKS") {
    const dates = extractDates(text);
    if (dates.length) slots.date = dates;
  }

  /* ======================================================
     ⏰ TIME
     ====================================================== */
  const times = extractTimes(text);
  if (times.length) slots.time = times;

  /* ======================================================
     🔁 RECURRENCE
     ====================================================== */
  if (intent === "CREATE_TASK") {
    const recurrence = extractRecurrence(text);
    if (recurrence) {
      slots.recurrence = [recurrenceToString(recurrence)];
    }
  }

  /* ======================================================
     ⚡ PRIORITY
     ====================================================== */
  if (intent === "CREATE_TASK" || intent === "EDIT_TASK") {
    const priority = extractPriority(text);
    if (priority) {
      slots.priority = [priority];
    }
  }

  /* ======================================================
     📝 DESCRIPTION
     ====================================================== */
  // Extract description for any intent (needed for edit follow-up where intent may be null)
  const description = extractDescription(text);
  if (description) {
    slots.description = [description];
  }

  /* ======================================================
     📝 TITLE
     ====================================================== */
  // ❌ DELETE_TASK nunca usa title
  // ❌ LIST_TASKS nunca usa title
  if (intent !== "LIST_TASKS" && intent !== "DELETE_TASK") {
    // Remove description from text before extracting title
    const textWithoutDescription = removeDescriptionFromText(text);
    const titles = extractTitle(textWithoutDescription, intent);
    if (titles.length) slots.title = titles;
  }

  return { slots };
}
