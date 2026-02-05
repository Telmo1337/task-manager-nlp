"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotsStep = slotsStep;
const extractor_1 = require("../../slots/extractor");
function slotsStep(ctx) {
    const extracted = (0, extractor_1.extractSlots)(ctx.normalizedInput, ctx.intent // pode ser null
    );
    return {
        ...ctx,
        slots: extracted.slots
    };
}
