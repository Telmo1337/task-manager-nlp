"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicCleanup = basicCleanup;
exports.removeNoise = removeNoise;
const noise_1 = require("./noise");
function basicCleanup(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}
function removeNoise(input) {
    let result = input;
    for (const phrase of noise_1.NOISE_PHRASES) {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(new RegExp(escaped, "g"), "");
    }
    return result.replace(/\s+/g, " ").trim();
}
