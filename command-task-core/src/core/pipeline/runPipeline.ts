import { createContext } from "./context";
import { normalizeStep } from "./steps/normalize";
import { intentStep } from "./steps/intent";
import { slotsStep } from "./steps/slots";
import { ambiguityStep } from "./steps/ambiguity";

export function runPipeline(input: string) {
  let ctx = createContext(input);

  ctx = normalizeStep(ctx);
  ctx = intentStep(ctx);
  ctx = slotsStep(ctx);

  const { ambiguity } = ambiguityStep(ctx);

  return { ctx, ambiguity };
}
