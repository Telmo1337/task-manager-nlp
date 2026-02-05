import { Intent } from "../types";
import { INTENT_KEYWORDS } from "./keywords";

export interface DetectedIntent {
  primary: Intent | null;
  secondary?: Intent | null; // para chaining seguro
}

function findIntents(text: string): Intent[] {
  const found: Intent[] = [];
  const lower = text.toLowerCase();

  for (const intent of Object.keys(INTENT_KEYWORDS) as Intent[]) {
    const keywords = INTENT_KEYWORDS[intent];
    // Check each keyword - use word boundary for single words, includes for phrases
    const matched = keywords.some(k => {
      if (k.includes(" ")) {
        // Multi-word phrase - use includes
        return lower.includes(k);
      }
      // Single word - use word boundary regex
      return new RegExp(`\\b${k}\\b`, "i").test(text);
    });
    
    if (matched) {
      found.push(intent);
    }
  }

  return found;
}

function isSafeChaining(intents: Intent[]): boolean {
  // permitimos apenas CREATE + LIST (em qualquer ordem)
  if (intents.length !== 2) return false;
  const set = new Set(intents);
  return set.has("CREATE_TASK") && set.has("LIST_TASKS");
}

export function detectIntent(text: string): DetectedIntent {
  const intents = findIntents(text);

  if (intents.length === 0) {
    return { primary: null };
  }

  if (intents.length === 1) {
    return { primary: intents[0] };
  }

  // DELETE_ALL_TASKS takes priority over DELETE_TASK
  if (intents.includes("DELETE_ALL_TASKS") && intents.includes("DELETE_TASK")) {
    return { primary: "DELETE_ALL_TASKS" };
  }

  // múltiplas intenções
  if (isSafeChaining(intents)) {
    // define CREATE como primária por ordem natural
    return { primary: "CREATE_TASK", secondary: "LIST_TASKS" };
  }

  // conflito
  return { primary: null };
}
