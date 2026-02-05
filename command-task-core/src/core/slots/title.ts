import { Intent } from "../types";

const STOP_WORDS =
  /\b(add|create|new|schedule|edit|change|update|move|delete|remove|list|show|view|see|task|for|to|on|my|a)\b/g;

const PRIORITY_WORDS = /\b(urgent|asap|immediately|critical|emergency|high\s*priority|important|low\s*priority|whenever|not\s+urgent|normal\s*priority)\b/gi;

const RECURRENCE_WORDS = /\b(every\s+day|daily|every\s+week|weekly|every\s+month|monthly|every\s+year|yearly|annually|weekdays|every\s+weekday|weekends|every\s+weekend|every\s+\d+\s+(?:days?|weeks?)|every\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*(?:,|and)\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))*)\b/gi;

export function extractTitle(
  text: string,
  intent: Intent | null
): string[] {

  // ❌ LIST nunca tem title
  if (intent === "LIST_TASKS") return [];

  // ❌ Se o input parece ser SÓ uma data ou hora, não é título
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(text.trim()) || // ISO
    /^\d{2}\/\d{2}\/\d{4}$/.test(text.trim()) || // PT /
    /^\d{2}-\d{2}-\d{4}$/.test(text.trim()) || // PT -
    /^\d{1,2}(:\d{2})?\s?(am|pm|h)?$/i.test(text.trim())
  ) {
    return [];
  }

  const cleaned = text
    .toLowerCase()
    // Remove #ID references (e.g., #22)
    .replace(/#\d+/g, "")
    .replace(STOP_WORDS, "")
    .replace(PRIORITY_WORDS, "")
    .replace(RECURRENCE_WORDS, "")
    .replace(/\b(today|tomorrow|day after tomorrow|yesterday)\b/g, "")
    .replace(/\b(this|next)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|weekend)\b/g, "")
    .replace(/\bin\s+\d+\s+(?:days?|weeks?|months?)\b/g, "")
    .replace(/\bend\s+of\s+(?:day|week|month)\b/g, "")
    // "jan 15", "january 15"
    .replace(/\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2}\b/g, "")
    // "15th january", "6 february"
    .replace(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/g, "")
    // "6 of february", "15 of jan"
    .replace(/\b\d{1,2}(?:st|nd|rd|th)?\s+of\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/g, "")
    .replace(/\b\d{1,2}(:\d{2})?\s?(am|pm|h)?\b/g, "")
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, "")
    .replace(/\b\d{2}\/\d{2}\/\d{4}\b/g, "")
    .replace(/\b\d{2}-\d{2}-\d{4}\b/g, "")
    .replace(/\b(at|in)\b/g, "")
    // Remove lone symbols and punctuation
    .replace(/[#@$%^&*()+=\[\]{}|\\;:'"<>?,./]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Don't return titles that are too short or just numbers
  if (!cleaned || cleaned.length < 2 || /^\d+$/.test(cleaned)) return [];

  return [cleaned];
}
