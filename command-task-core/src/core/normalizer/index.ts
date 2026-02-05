import { basicCleanup, removeNoise } from "./rules";

export function normalizeInput(input: string): string {
  let text = basicCleanup(input);
  text = removeNoise(text);
  return text;
}
