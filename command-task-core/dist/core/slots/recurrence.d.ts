export type RecurrencePattern = {
    type: "daily" | "weekly" | "monthly" | "yearly" | "weekdays";
    days?: string[];
    interval?: number;
};
export declare function extractRecurrence(text: string): RecurrencePattern | null;
export declare function recurrenceToString(pattern: RecurrencePattern): string;
