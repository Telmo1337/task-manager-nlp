"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLikelyCommand = isLikelyCommand;
const detector_1 = require("./detector");
function isLikelyCommand(text) {
    const detected = (0, detector_1.detectIntent)(text);
    return detected.primary !== null;
}
