import { Intent } from "../types";

export interface PipelineContext {
  rawInput: string;
  normalizedInput: string;
  intent: Intent | null;
  slots: Record<string, any[]>;
}
