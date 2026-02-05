import { extractSlots } from "../../slots/extractor";
import { PipelineContext } from "../types";

export function slotsStep(ctx: PipelineContext): PipelineContext {
  const extracted = extractSlots(
    ctx.normalizedInput,
    ctx.intent // pode ser null
  );

  return {
    ...ctx,
    slots: extracted.slots
  };
}
