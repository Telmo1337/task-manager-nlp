"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInput = normalizeInput;
const rules_1 = require("./rules");
function normalizeInput(input) {
    let text = (0, rules_1.basicCleanup)(input);
    text = (0, rules_1.removeNoise)(text);
    return text;
}
