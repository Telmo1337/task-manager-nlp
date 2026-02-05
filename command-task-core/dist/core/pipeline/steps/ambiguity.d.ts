import { PipelineContext } from "../types";
export declare function ambiguityStep(ctx: PipelineContext): {
    ctx: PipelineContext;
    ambiguity: null;
} | {
    ctx: PipelineContext;
    ambiguity: import("../../ambiguity").AmbiguityResult;
};
