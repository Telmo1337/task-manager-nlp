import { Intent } from "../types";
export type AmbiguityResult = {
    type: "OK";
} | {
    type: "MISSING_SLOT";
    slot: string;
} | {
    type: "AMBIGUOUS_SLOT";
    slot: string;
    values: any[];
};
export declare function checkAmbiguity(intent: Intent, slots: Record<string, any[]>): AmbiguityResult;
