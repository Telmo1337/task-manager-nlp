import { patterns } from "./patterns";
import { responses } from "./responses";

export function getConversationalResponse(text: string): string | null {
  const lower = text.toLowerCase().trim();

  for (const { key, test } of patterns) {
    if (test(lower)) {
      const response = responses[key];
      if (typeof response === "function") return response();
      if (Array.isArray(response)) return response[Math.floor(Math.random() * response.length)];
      return response;
    }
  }

  return null;
}
