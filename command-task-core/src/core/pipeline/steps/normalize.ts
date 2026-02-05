import { normalizeInput } from "../../normalizer";
import { PipelineContext } from "../types";

export function normalizeStep(ctx: PipelineContext): PipelineContext {
  return {
    ...ctx,
    normalizedInput: normalizeInput(ctx.rawInput)
  };
}
