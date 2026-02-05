import { detectIntent } from "./detector";

export function isLikelyCommand(text: string): boolean {
  const detected = detectIntent(text);
  return detected.primary !== null;
}