export type Priority = "urgent" | "high" | "normal" | "low";
export declare function extractPriority(text: string): Priority | null;
export declare function priorityToEmoji(priority: Priority): string;
