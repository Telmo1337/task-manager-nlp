import { Intent } from "../types";
import { REQUIRED_SLOTS } from "./requirements";

export type AmbiguityResult =
  | { type: "OK" }
  | { type: "MISSING_SLOT"; slot: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "AMBIGUOUS_SLOT"; slot: string; values: any[] };

export function checkAmbiguity(
  intent: Intent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slots: Record<string, any[]>
): AmbiguityResult {

  const required = REQUIRED_SLOTS[intent] || [];

  // 1️⃣ falta slot obrigatório?
  for (const slot of required) {
    if (!slots[slot] || slots[slot].length === 0) {
      return { type: "MISSING_SLOT", slot };
    }
  }

  // 2️⃣ slot com múltiplos valores?
  for (const [slot, values] of Object.entries(slots)) {
    if (values.length > 1) {
      return { type: "AMBIGUOUS_SLOT", slot, values };
    }
  }

  return { type: "OK" };
}
