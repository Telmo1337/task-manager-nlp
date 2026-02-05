/* export function normalizePayload(
  payload: Record<string, any[]>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, values] of Object.entries(payload)) {
    result[key] = Array.isArray(values) ? values[0] : values;
  }

  return result;
}
 */

export function normalizePayload(
  slots: Record<string, any[]>
): Record<string, any> {
  const payload: Record<string, any> = {};

  // title
  if (slots.title?.length) {
    payload.title = slots.title[0];
  }

  // date
  if (slots.date?.length) {
    payload.date = slots.date[0];
  }

  // ⚠️ TIME SÓ EXISTE SE O USER DISSE MESMO
  if (slots.time?.length) {
    const time = slots.time[0];

    // proteger contra lixo
    if (typeof time === "string" && time.trim() !== "") {
      payload.time = time;
    }
  }

  // id (para delete / edit)
  if (slots.id?.length) {
    const id = Number(slots.id[0]);
    if (!Number.isNaN(id)) {
      payload.id = id;
    }
  }

  // filter (for LIST_TASKS)
  if (slots.filter?.length) {
    payload.filter = slots.filter[0];
    // Include value for DATE and COMPLETED_ON_DATE filters
    if (slots.value?.length) {
      payload.value = slots.value[0];
    }
  } else {
    // Default to ALL for list tasks
    payload.filter = "ALL";
  }

  // priority
  if (slots.priority?.length) {
    payload.priority = slots.priority[0];
  }

  // recurrence
  if (slots.recurrence?.length) {
    payload.recurrence = slots.recurrence[0];
  }

  // description
  if (slots.description?.length) {
    payload.description = slots.description[0];
  }

  return payload;
}
