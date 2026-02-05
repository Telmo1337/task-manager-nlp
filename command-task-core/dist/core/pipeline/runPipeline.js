"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipeline = runPipeline;
const context_1 = require("./context");
const normalize_1 = require("./steps/normalize");
const intent_1 = require("./steps/intent");
const slots_1 = require("./steps/slots");
const ambiguity_1 = require("./steps/ambiguity");
function runPipeline(input) {
    let ctx = (0, context_1.createContext)(input);
    ctx = (0, normalize_1.normalizeStep)(ctx);
    ctx = (0, intent_1.intentStep)(ctx);
    ctx = (0, slots_1.slotsStep)(ctx);
    const { ambiguity } = (0, ambiguity_1.ambiguityStep)(ctx);
    return { ctx, ambiguity };
}
