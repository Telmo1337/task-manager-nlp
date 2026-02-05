"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStep = normalizeStep;
const normalizer_1 = require("../../normalizer");
function normalizeStep(ctx) {
    return {
        ...ctx,
        normalizedInput: (0, normalizer_1.normalizeInput)(ctx.rawInput)
    };
}
