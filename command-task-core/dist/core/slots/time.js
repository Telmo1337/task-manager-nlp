"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTimes = extractTimes;
function extractTimes(text) {
    const results = [];
    // Skip if it looks like a date (ISO format)
    if (/\d{4}-\d{2}-\d{2}/.test(text)) {
        // Remove ISO dates before extracting times
        text = text.replace(/\d{4}-\d{2}-\d{2}/g, "");
    }
    // 22h, 9h format
    const hFormatRegex = /\b(\d{1,2})h\b/g;
    let match;
    while ((match = hFormatRegex.exec(text)) !== null) {
        results.push(match[0]);
    }
    // 5pm, 10am, 17:00, 6:30pm
    const timeRegex = /\b(\d{1,2})(:\d{2})?\s?(am|pm)?\b/gi;
    while ((match = timeRegex.exec(text)) !== null) {
        // Skip if it's just a number that could be a day/year
        const num = parseInt(match[1]);
        if (num > 24 || (num > 12 && !match[2] && !match[3]))
            continue;
        // Skip if already added (h format)
        if (!results.includes(match[0])) {
            results.push(match[0].trim());
        }
    }
    return results;
}
