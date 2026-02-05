type ListTasksPayload =
  | { filter: "ALL" }
  | { filter: "TODAY" }
  | { filter: "TOMORROW" }
  | { filter: "DATE"; value: string }
  | { filter: "COMPLETED" }
  | { filter: "COMPLETED_ON_DATE"; value: string }
  | { filter: "PENDING" };

export function isListTasksPayload(
  payload: unknown
): payload is ListTasksPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const data = payload as Record<string, unknown>;

  // If no filter provided, treat as ALL (valid)
  if (data.filter === undefined) {
    return true;
  }

  if (typeof data.filter !== "string") {
    return false;
  }

  // Filters that require a value
  if (data.filter === "DATE" || data.filter === "COMPLETED_ON_DATE") {
    return typeof data.value === "string";
  }

  return ["ALL", "TODAY", "TOMORROW", "COMPLETED", "PENDING"].includes(data.filter);
}
