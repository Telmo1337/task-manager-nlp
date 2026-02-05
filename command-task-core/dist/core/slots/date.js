"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDates = extractDates;
function extractDates(text) {
    const results = [];
    const lower = text.toLowerCase();
    /* =========================
       Palavras-chave básicas
       ========================= */
    if (/\btoday\b/.test(lower))
        results.push("today");
    if (/\btomorrow\b/.test(lower))
        results.push("tomorrow");
    if (/\bnext\s+day\b/.test(lower))
        results.push("tomorrow"); // "next day" = tomorrow
    if (/\byesterday\b/.test(lower))
        results.push("yesterday");
    if (/\bday after tomorrow\b/.test(lower)) {
        results.push("day after tomorrow");
    }
    /* =========================
       Dias da semana (this/next X)
       ========================= */
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (const day of weekdays) {
        // "this monday" - same week
        if (new RegExp(`\\bthis\\s+${day}\\b`).test(lower)) {
            results.push(`this ${day}`);
        }
        // "next monday", "on monday", just "monday"
        else if (new RegExp(`\\b(next\\s+|on\\s+)?${day}\\b`).test(lower)) {
            results.push(`next ${day}`);
        }
    }
    /* =========================
       Relative days: "in X days", "in a day"
       ========================= */
    if (/\bin\s+a\s+day\b/.test(lower)) {
        results.push("in 1 day");
    }
    const inDaysMatch = lower.match(/\bin\s+(\d+)\s+days?\b/);
    if (inDaysMatch) {
        const num = inDaysMatch[1];
        results.push(`in ${num} day${num === "1" ? "" : "s"}`);
    }
    /* =========================
       Relative weeks: "in X weeks", "next week", "in a week"
       ========================= */
    if (/\bnext\s+week\b/.test(lower)) {
        results.push("next week");
    }
    if (/\bthis\s+week\b/.test(lower)) {
        results.push("this week");
    }
    if (/\bin\s+a\s+week\b/.test(lower)) {
        results.push("in 1 week");
    }
    const inWeeksMatch = lower.match(/\bin\s+(\d+)\s+weeks?\b/);
    if (inWeeksMatch) {
        const num = inWeeksMatch[1];
        results.push(`in ${num} week${num === "1" ? "" : "s"}`);
    }
    /* =========================
       End of period
       ========================= */
    if (/\bend\s+of\s+(the\s+)?week\b/.test(lower)) {
        results.push("end of week");
    }
    if (/\bend\s+of\s+(the\s+)?month\b/.test(lower)) {
        results.push("end of month");
    }
    if (/\bend\s+of\s+(the\s+)?day\b/.test(lower)) {
        results.push("end of day");
    }
    /* =========================
       Relative months: "next month", "in X months"
       ========================= */
    if (/\bnext\s+month\b/.test(lower)) {
        results.push("next month");
    }
    if (/\bin\s+a\s+month\b/.test(lower)) {
        results.push("in 1 month");
    }
    const inMonthsMatch = lower.match(/\bin\s+(\d+)\s+months?\b/);
    if (inMonthsMatch) {
        const num = inMonthsMatch[1];
        results.push(`in ${num} month${num === "1" ? "" : "s"}`);
    }
    /* =========================
       Weekend
       ========================= */
    if (/\bthis\s+weekend\b/.test(lower)) {
        results.push("this weekend");
    }
    if (/\bnext\s+weekend\b/.test(lower)) {
        results.push("next weekend");
    }
    if (/\b(on\s+the\s+)?weekend\b/.test(lower) && !results.some(r => r.includes("weekend"))) {
        results.push("next weekend");
    }
    /* =========================
       Month day: "jan 15", "january 15", "15 jan"
       ========================= */
    const months = [
        "jan(?:uary)?", "feb(?:ruary)?", "mar(?:ch)?", "apr(?:il)?",
        "may", "jun(?:e)?", "jul(?:y)?", "aug(?:ust)?",
        "sep(?:t(?:ember)?)?", "oct(?:ober)?", "nov(?:ember)?", "dec(?:ember)?"
    ];
    const monthPattern = months.join("|");
    // "jan 15" or "january 15"
    const monthDayMatch = lower.match(new RegExp(`\\b(${monthPattern})\\s+(\\d{1,2})\\b`));
    if (monthDayMatch) {
        results.push(`${monthDayMatch[1]} ${monthDayMatch[2]}`);
    }
    // "15 jan" or "15th jan"
    const dayMonthMatch = lower.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${monthPattern})\\b`));
    if (dayMonthMatch) {
        results.push(`${dayMonthMatch[2]} ${dayMonthMatch[1]}`);
    }
    // "6 of february" or "6th of february"
    const dayOfMonthMatch = lower.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+of\\s+(${monthPattern})\\b`));
    if (dayOfMonthMatch) {
        results.push(`${dayOfMonthMatch[2]} ${dayOfMonthMatch[1]}`);
    }
    /* =========================
       ISO → 2026-01-22
       ========================= */
    const isoMatch = lower.match(/\b\d{4}-\d{2}-\d{2}\b/);
    if (isoMatch) {
        results.push(isoMatch[0]);
    }
    /* =========================
       PT → 22/01/2026
       ========================= */
    const ptSlashMatch = lower.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    if (ptSlashMatch) {
        results.push(ptSlashMatch[0]);
    }
    /* =========================
       PT → 22-01-2026
       ========================= */
    const ptDashMatch = lower.match(/\b\d{2}-\d{2}-\d{4}\b/);
    if (ptDashMatch) {
        results.push(ptDashMatch[0]);
    }
    /* =========================
       US → 01/22/2026 (MM/DD/YYYY)
       ========================= */
    const usSlashMatch = lower.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
    if (usSlashMatch && !results.includes(usSlashMatch[0])) {
        results.push(usSlashMatch[0]);
    }
    return results;
}
