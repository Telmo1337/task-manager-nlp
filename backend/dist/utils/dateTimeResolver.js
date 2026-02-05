"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDate = resolveDate;
exports.resolveTime = resolveTime;
exports.resolveDateTime = resolveDateTime;
const luxon_1 = require("luxon");
const DEFAULT_TIMEZONE = "Europe/Lisbon";
/* ======================================================
   Resolver DATA (aceita ISO, PT e palavras-chave)
   ====================================================== */
function resolveDate(date, zone = DEFAULT_TIMEZONE) {
    const now = luxon_1.DateTime.now().setZone(zone);
    const clean = date.trim().toLowerCase();
    // palavras-chave
    if (clean === "today")
        return now.startOf("day");
    if (clean === "tomorrow")
        return now.plus({ days: 1 }).startOf("day");
    // ISO → 2026-01-22
    let parsed = luxon_1.DateTime.fromISO(clean, { zone });
    if (parsed.isValid)
        return parsed.startOf("day");
    // PT → 22/01/2026
    parsed = luxon_1.DateTime.fromFormat(clean, "dd/MM/yyyy", { zone });
    if (parsed.isValid)
        return parsed.startOf("day");
    // PT com hífen → 22-01-2026
    parsed = luxon_1.DateTime.fromFormat(clean, "dd-MM-yyyy", { zone });
    if (parsed.isValid)
        return parsed.startOf("day");
    throw new Error("INVALID_DATE");
}
/* ======================================================
   Resolver HORA (10 | 10:30 | 10am | 22h)
   ====================================================== */
function resolveTime(time) {
    const clean = time.replace(/\s+/g, "").toLowerCase();
    // 10
    if (/^\d{1,2}$/.test(clean)) {
        return { hour: Number(clean), minute: 0 };
    }
    // 10:30
    if (/^\d{1,2}:\d{2}$/.test(clean)) {
        const [hour, minute] = clean.split(":").map(Number);
        return { hour, minute };
    }
    // 10am / 10pm
    if (/^\d{1,2}(am|pm)$/.test(clean)) {
        let hour = Number(clean.replace(/am|pm/, ""));
        const isPm = clean.endsWith("pm");
        if (isPm && hour < 12)
            hour += 12;
        if (!isPm && hour === 12)
            hour = 0;
        return { hour, minute: 0 };
    }
    // 22h
    if (/^\d{1,2}h$/.test(clean)) {
        return { hour: Number(clean.replace("h", "")), minute: 0 };
    }
    throw new Error("INVALID_TIME");
}
/* ======================================================
   Resolver DATA + HORA → Date (UTC)
   ====================================================== */
function resolveDateTime(date, time, zone = DEFAULT_TIMEZONE) {
    let base = resolveDate(date, zone);
    if (time) {
        const { hour, minute } = resolveTime(time);
        base = base.set({ hour, minute });
    }
    // guarda sempre em UTC (boa prática)
    return base.toUTC().toJSDate();
}
