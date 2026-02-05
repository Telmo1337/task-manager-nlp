type ListTasksPayload = {
    filter: "ALL";
} | {
    filter: "TODAY";
} | {
    filter: "TOMORROW";
} | {
    filter: "DATE";
    value: string;
};
export declare function isListTasksPayload(payload: unknown): payload is ListTasksPayload;
export {};
