"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
function createContext(input) {
    return {
        rawInput: input,
        normalizedInput: "",
        intent: null,
        slots: {}
    };
}
