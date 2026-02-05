import { NOISE_PHRASES } from "./noise";

export function basicCleanup(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function removeNoise(input: string): string {
  let result = input;

  for (const phrase of NOISE_PHRASES) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "g"), "");
  }

  return result.replace(/\s+/g, " ").trim();
}
