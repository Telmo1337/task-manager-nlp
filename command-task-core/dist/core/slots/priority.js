"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPriority = extractPriority;
exports.priorityToEmoji = priorityToEmoji;
function extractPriority(text) {
    const lower = text.toLowerCase();
    // Urgent patterns
    if (/\b(urgent|asap|immediately|critical|emergency)\b/.test(lower)) {
        return "urgent";
    }
    // High priority patterns
    if (/\b(high\s*priority|important|high)\b/.test(lower)) {
        return "high";
    }
    // Low priority patterns
    if (/\b(low\s*priority|whenever|not\s+urgent|low)\b/.test(lower)) {
        return "low";
    }
    // Normal is default - return null to not set explicitly
    if (/\b(normal\s*priority|normal)\b/.test(lower)) {
        return "normal";
    }
    return null;
}
function priorityToEmoji(priority) {
    switch (priority) {
        case "urgent": return "🔴";
        case "high": return "🟠";
        case "normal": return "🟢";
        case "low": return "⚪";
        default: return "";
    }
}
