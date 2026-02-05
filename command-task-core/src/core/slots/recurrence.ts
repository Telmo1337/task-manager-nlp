export type RecurrencePattern = {
  type: "daily" | "weekly" | "monthly" | "yearly" | "weekdays";
  days?: string[]; // For specific weekdays like ["monday", "wednesday"]
  interval?: number; // For "every 2 weeks"
};

export function extractRecurrence(text: string): RecurrencePattern | null {
  const lower = text.toLowerCase();

  // Daily patterns
  if (/\b(every\s+day|daily)\b/.test(lower)) {
    return { type: "daily" };
  }

  // Every X days
  const everyDaysMatch = lower.match(/\bevery\s+(\d+)\s+days?\b/);
  if (everyDaysMatch) {
    return { type: "daily", interval: Number(everyDaysMatch[1]) };
  }

  // Weekly patterns
  if (/\b(every\s+week|weekly)\b/.test(lower)) {
    return { type: "weekly" };
  }

  // Every X weeks
  const everyWeeksMatch = lower.match(/\bevery\s+(\d+)\s+weeks?\b/);
  if (everyWeeksMatch) {
    return { type: "weekly", interval: Number(everyWeeksMatch[1]) };
  }

  // Monthly patterns
  if (/\b(every\s+month|monthly)\b/.test(lower)) {
    return { type: "monthly" };
  }

  // Yearly patterns
  if (/\b(every\s+year|yearly|annually)\b/.test(lower)) {
    return { type: "yearly" };
  }

  // Specific weekdays: "every monday", "every monday and friday"
  const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const foundDays: string[] = [];
  
  for (const day of weekdays) {
    // Match "every monday" or "every monday and wednesday"
    if (new RegExp(`\\bevery\\s+(?:.*\\b)?${day}\\b`).test(lower)) {
      foundDays.push(day);
    }
  }
  
  // Also check for patterns like "every monday, wednesday, and friday"
  const everyDaysPattern = lower.match(/\bevery\s+((?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s*(?:,|and)\s*(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday))*)\b/);
  if (everyDaysPattern) {
    const daysPart = everyDaysPattern[1];
    for (const day of weekdays) {
      if (daysPart.includes(day) && !foundDays.includes(day)) {
        foundDays.push(day);
      }
    }
  }

  if (foundDays.length > 0) {
    return { type: "weekdays", days: foundDays };
  }

  // Weekdays (Mon-Fri)
  if (/\b(weekdays|every\s+weekday)\b/.test(lower)) {
    return { type: "weekdays", days: ["monday", "tuesday", "wednesday", "thursday", "friday"] };
  }

  // Weekends
  if (/\b(weekends|every\s+weekend)\b/.test(lower)) {
    return { type: "weekdays", days: ["saturday", "sunday"] };
  }

  return null;
}

export function recurrenceToString(pattern: RecurrencePattern): string {
  if (pattern.type === "daily") {
    if (pattern.interval && pattern.interval > 1) {
      return `every ${pattern.interval} days`;
    }
    return "daily";
  }

  if (pattern.type === "weekly") {
    if (pattern.interval && pattern.interval > 1) {
      return `every ${pattern.interval} weeks`;
    }
    return "weekly";
  }

  if (pattern.type === "monthly") {
    return "monthly";
  }

  if (pattern.type === "yearly") {
    return "yearly";
  }

  if (pattern.type === "weekdays" && pattern.days) {
    return pattern.days.join(",");
  }

  return "";
}
