import { z } from "zod";

/* ======================================================
   Base Command Schema
   ====================================================== */
export const CommandSchema = z.object({
  type: z.literal("COMMAND"),
  intent: z.enum(["RAW_INPUT", "CREATE_TASK", "LIST_TASKS", "DELETE_TASK", "DELETE_ALL_TASKS", "EDIT_TASK", "UNDO_ACTION"]),
  payload: z.unknown(),
});

/* ======================================================
   Payload Schemas
   ====================================================== */
export const RawInputPayloadSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export const CreateTaskPayloadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  priority: z.enum(["urgent", "high", "normal", "low"]).optional().default("normal"),
  recurrence: z.string().optional(),
});

export const ListTasksPayloadSchema = z.object({
  filter: z.enum(["ALL", "TODAY", "TOMORROW", "DATE", "COMPLETED", "COMPLETED_ON_DATE", "PENDING"]).optional().default("ALL"),
  value: z.string().optional(),
});

export const DeleteTaskPayloadSchema = z.object({
  id: z.number().int().positive("Invalid task ID"),
});

export const EditTaskPayloadSchema = z.object({
  id: z.number().int().positive("Invalid task ID"),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
  recurrence: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
});

/* ======================================================
   Validation Functions
   ====================================================== */
export function validateCommand(data: unknown) {
  return CommandSchema.safeParse(data);
}

export function validateRawInputPayload(data: unknown) {
  return RawInputPayloadSchema.safeParse(data);
}

export function validateCreateTaskPayload(data: unknown) {
  return CreateTaskPayloadSchema.safeParse(data);
}

export function validateListTasksPayload(data: unknown) {
  return ListTasksPayloadSchema.safeParse(data);
}

export function validateDeleteTaskPayload(data: unknown) {
  return DeleteTaskPayloadSchema.safeParse(data);
}

export function validateEditTaskPayload(data: unknown) {
  return EditTaskPayloadSchema.safeParse(data);
}

/* ======================================================
   Type exports
   ====================================================== */
export type ValidCommand = z.infer<typeof CommandSchema>;
export type ValidRawInputPayload = z.infer<typeof RawInputPayloadSchema>;
export type ValidCreateTaskPayload = z.infer<typeof CreateTaskPayloadSchema>;
export type ValidListTasksPayload = z.infer<typeof ListTasksPayloadSchema>;
export type ValidDeleteTaskPayload = z.infer<typeof DeleteTaskPayloadSchema>;
export type ValidEditTaskPayload = z.infer<typeof EditTaskPayloadSchema>;
