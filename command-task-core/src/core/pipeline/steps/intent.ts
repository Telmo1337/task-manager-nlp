import { detectIntent } from "../../intent";
import { PipelineContext } from "../types";

export function intentStep(ctx: PipelineContext): PipelineContext {
  const detected = detectIntent(ctx.normalizedInput);

  return {
    ...ctx,
    intent: detected.primary
  };
}
