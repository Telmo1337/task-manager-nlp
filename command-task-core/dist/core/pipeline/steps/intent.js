"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intentStep = intentStep;
const intent_1 = require("../../intent");
function intentStep(ctx) {
    const detected = (0, intent_1.detectIntent)(ctx.normalizedInput);
    return {
        ...ctx,
        intent: detected.primary
    };
}
