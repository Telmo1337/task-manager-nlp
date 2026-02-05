import { DateTime } from "luxon";
export declare function resolveDate(date: string, zone?: string): DateTime;
export declare function resolveTime(time: string): {
    hour: number;
    minute: number;
};
export declare function resolveDateTime(date: string, time?: string, zone?: string): Date;
