"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ambiguityStep = ambiguityStep;
const ambiguity_1 = require("../../ambiguity");
function ambiguityStep(ctx) {
    if (!ctx.intent)
        return { ctx, ambiguity: null };
    const ambiguity = (0, ambiguity_1.checkAmbiguity)(ctx.intent, ctx.slots);
    return { ctx, ambiguity };
}
