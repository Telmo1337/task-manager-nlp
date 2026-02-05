import { ConversationState } from "./state/types";
import { CoreResult } from "./types";
export declare function interpret(input: string, state: ConversationState): {
    result: CoreResult;
    state: ConversationState;
};
