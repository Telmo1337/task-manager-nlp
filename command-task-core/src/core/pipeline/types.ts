import { Intent } from "../types";

export interface PipelineContext {
  rawInput: string;
  normalizedInput: string;
  intent: Intent | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slots: Record<string, any[]>;
}
