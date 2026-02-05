import { checkAmbiguity } from "../../ambiguity";
import { PipelineContext } from "../types";

export function ambiguityStep(ctx: PipelineContext) {
  if (!ctx.intent) return { ctx, ambiguity: null };

  const ambiguity = checkAmbiguity(ctx.intent, ctx.slots);
  return { ctx, ambiguity };
}
