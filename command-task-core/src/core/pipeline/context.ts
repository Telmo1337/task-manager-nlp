import { PipelineContext } from "./types";

export function createContext(input: string): PipelineContext {
  return {
    rawInput: input,
    normalizedInput: "",
    intent: null,
    slots: {}
  };
}
