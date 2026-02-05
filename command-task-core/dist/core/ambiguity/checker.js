"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAmbiguity = checkAmbiguity;
const requirements_1 = require("./requirements");
function checkAmbiguity(intent, slots) {
    const required = requirements_1.REQUIRED_SLOTS[intent] || [];
    // 1️⃣ falta slot obrigatório?
    for (const slot of required) {
        if (!slots[slot] || slots[slot].length === 0) {
            return { type: "MISSING_SLOT", slot };
        }
    }
    // 2️⃣ slot com múltiplos valores?
    for (const [slot, values] of Object.entries(slots)) {
        if (values.length > 1) {
            return { type: "AMBIGUOUS_SLOT", slot, values };
        }
    }
    return { type: "OK" };
}
