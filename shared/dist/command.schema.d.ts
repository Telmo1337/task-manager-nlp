import { CommandIntent } from "./command.intent";
export interface Command<TPayload = unknown> {
    type: "COMMAND";
    intent: CommandIntent;
    payload: TPayload;
}
export { CommandIntent };
export type RawInputPayload = {
    text: string;
};
