import { DateTime } from "luxon";

const DEFAULT_TIMEZONE = "Europe/Lisbon";

/* ======================================================
   Map month names to numbers
   ====================================================== */
function parseMonthName(month: string): number | null {
  const monthMap: Record<string, number> = {
    jan: 1, january: 1,
    feb: 2, february: 2,
    mar: 3, march: 3,
    apr: 4, april: 4,
    may: 5,
    jun: 6, june: 6,
    jul: 7, july: 7,
    aug: 8, august: 8,
    sep: 9, sept: 9, september: 9,
    oct: 10, october: 10,
    nov: 11, november: 11,
    dec: 12, december: 12,
  };
  return monthMap[month.toLowerCase()] || null;
}

/* ======================================================
   Get next occurrence of a weekday
   ====================================================== */
function getNextWeekday(dayName: string, zone: string, thisWeek: boolean = false): DateTime {
  const weekdays: Record<string, number> = {
    monday: 1, tuesday: 2, wednesday: 3, thursday: 4,
    friday: 5, saturday: 6, sunday: 7
  };
  
  const targetDay = weekdays[dayName.toLowerCase()];
  if (!targetDay) throw new Error("INVALID_WEEKDAY");
  
  const now = DateTime.now().setZone(zone);
  const currentDay = now.weekday;
  
  let daysToAdd = targetDay - currentDay;
  
  if (thisWeek) {
    // "this friday" - same week, can be today or past (but we'll use it anyway)
    if (daysToAdd < 0) daysToAdd += 7; // if past, go to next week
  } else {
    // "next friday" - always next occurrence
    if (daysToAdd <= 0) daysToAdd += 7;
  }
  
  return now.plus({ days: daysToAdd }).startOf("day");
}

/* ======================================================
   Get end of period
   ====================================================== */
function getEndOfPeriod(period: string, zone: string): DateTime {
  const now = DateTime.now().setZone(zone);
  
  switch (period) {
    case "day":
      return now.endOf("day");
    case "week":
      return now.endOf("week");
    case "month":
      return now.endOf("month");
    default:
      throw new Error("INVALID_PERIOD");
  }
}

/* ======================================================
   Get weekend (Saturday)
   ====================================================== */
function getWeekend(zone: string, thisWeekend: boolean = false): DateTime {
  const now = DateTime.now().setZone(zone);
  const currentDay = now.weekday;
  
  // Saturday = 6
  let daysToSaturday = 6 - currentDay;
  
  if (thisWeekend) {
    if (daysToSaturday < 0) daysToSaturday += 7;
  } else {
    if (daysToSaturday <= 0) daysToSaturday += 7;
  }
  
  return now.plus({ days: daysToSaturday }).startOf("day");
}

/* ======================================================
   Resolver DATA (aceita ISO, PT e palavras-chave)
   ====================================================== */
export function resolveDate(
  date: string,
  zone: string = DEFAULT_TIMEZONE
): DateTime {
  const now = DateTime.now().setZone(zone);

  const clean = date.trim().toLowerCase();

  // palavras-chave básicas
  if (clean === "today") return now.startOf("day");
  if (clean === "tomorrow") return now.plus({ days: 1 }).startOf("day");
  if (clean === "yesterday") return now.minus({ days: 1 }).startOf("day");
  if (clean === "day after tomorrow") return now.plus({ days: 2 }).startOf("day");

  // next week / this week
  if (clean === "next week") return now.plus({ weeks: 1 }).startOf("week");
  if (clean === "this week") return now.startOf("week");

  // next month
  if (clean === "next month") return now.plus({ months: 1 }).startOf("month");

  // end of period
  if (clean === "end of day") return getEndOfPeriod("day", zone);
  if (clean === "end of week") return getEndOfPeriod("week", zone);
  if (clean === "end of month") return getEndOfPeriod("month", zone);

  // weekend
  if (clean === "this weekend") return getWeekend(zone, true);
  if (clean === "next weekend") return getWeekend(zone, false);

  // in X days
  const inDaysMatch = clean.match(/^in\s+(\d+)\s+days?$/);
  if (inDaysMatch) {
    return now.plus({ days: Number(inDaysMatch[1]) }).startOf("day");
  }

  // in X weeks
  const inWeeksMatch = clean.match(/^in\s+(\d+)\s+weeks?$/);
  if (inWeeksMatch) {
    return now.plus({ weeks: Number(inWeeksMatch[1]) }).startOf("day");
  }

  // in X months
  const inMonthsMatch = clean.match(/^in\s+(\d+)\s+months?$/);
  if (inMonthsMatch) {
    return now.plus({ months: Number(inMonthsMatch[1]) }).startOf("day");
  }

  // this monday, this tuesday, etc.
  const thisWeekdayMatch = clean.match(/^this\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (thisWeekdayMatch) {
    return getNextWeekday(thisWeekdayMatch[1], zone, true);
  }

  // next monday, next tuesday, etc.
  const nextWeekdayMatch = clean.match(/^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (nextWeekdayMatch) {
    return getNextWeekday(nextWeekdayMatch[1], zone, false);
  }

  // just weekday name (monday, tuesday, etc.)
  const weekdayMatch = clean.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
  if (weekdayMatch) {
    return getNextWeekday(weekdayMatch[1], zone);
  }

  // month day: "jan 15", "january 15"
  const monthDayMatch = clean.match(/^([a-z]+)\s+(\d{1,2})$/);
  if (monthDayMatch) {
    const monthNum = parseMonthName(monthDayMatch[1]);
    if (monthNum) {
      const day = Number(monthDayMatch[2]);
      let year = now.year;
      
      // Check if the date is valid
      const testDate = DateTime.fromObject({ year, month: monthNum, day }, { zone });
      if (!testDate.isValid) {
        const monthName = DateTime.fromObject({ month: monthNum }).toFormat("MMMM");
        throw new Error(`Invalid date: ${monthName} doesn't have ${day} days`);
      }
      
      // If the date is in the past this year, use next year
      if (testDate < now) {
        year += 1;
      }
      
      return DateTime.fromObject({ year, month: monthNum, day }, { zone }).startOf("day");
    }
  }

  // day of month: "6 of february", "15 of jan"
  const dayOfMonthMatch = clean.match(/^(\d{1,2})\s+of\s+([a-z]+)$/);
  if (dayOfMonthMatch) {
    const day = Number(dayOfMonthMatch[1]);
    const monthNum = parseMonthName(dayOfMonthMatch[2]);
    if (monthNum) {
      let year = now.year;
      
      // Check if the date is valid
      const testDate = DateTime.fromObject({ year, month: monthNum, day }, { zone });
      if (!testDate.isValid) {
        const monthName = DateTime.fromObject({ month: monthNum }).toFormat("MMMM");
        throw new Error(`Invalid date: ${monthName} doesn't have ${day} days`);
      }
      
      // If the date is in the past this year, use next year
      if (testDate < now) {
        year += 1;
      }
      
      return DateTime.fromObject({ year, month: monthNum, day }, { zone }).startOf("day");
    }
  }

  // ISO → 2026-01-22
  let parsed = DateTime.fromISO(clean, { zone });
  if (parsed.isValid) return parsed.startOf("day");

  // PT → 22/01/2026
  parsed = DateTime.fromFormat(clean, "dd/MM/yyyy", { zone });
  if (parsed.isValid) return parsed.startOf("day");

  // PT com hífen → 22-01-2026
  parsed = DateTime.fromFormat(clean, "dd-MM-yyyy", { zone });
  if (parsed.isValid) return parsed.startOf("day");

  // US → 1/22/2026 or 01/22/2026
  parsed = DateTime.fromFormat(clean, "M/d/yyyy", { zone });
  if (parsed.isValid) return parsed.startOf("day");

  throw new Error("INVALID_DATE");
}

/* ======================================================
   Resolver HORA (10 | 10:30 | 10am | 22h)
   ====================================================== */
export function resolveTime(time: string) {
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

    if (isPm && hour < 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;

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
export function resolveDateTime(
  date: string,
  time?: string,
  zone: string = DEFAULT_TIMEZONE
): Date {
  let base = resolveDate(date, zone);

  if (time) {
    const { hour, minute } = resolveTime(time);
    base = base.set({ hour, minute });
  }

  // guarda sempre em UTC (boa prática)
  return base.toUTC().toJSDate();
}
