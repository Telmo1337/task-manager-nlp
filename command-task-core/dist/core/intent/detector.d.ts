import { Intent } from "../types";
export interface DetectedIntent {
    primary: Intent | null;
    secondary?: Intent | null;
}
export declare function detectIntent(text: string): DetectedIntent;
