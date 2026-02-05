export function isDeleteTaskPayload(payload: any): payload is {
  id?: number;
  title?: string;
} {
  if (!payload || typeof payload !== "object") return false;

  if (payload.id !== undefined) {
    return typeof payload.id === "number";
  }

  if (payload.title !== undefined) {
    return typeof payload.title === "string";
  }

  return false;
}
