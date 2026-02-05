export type ListTasksPayload = {
    filter: "ALL";
} | {
    filter: "TODAY";
} | {
    filter: "TOMORROW";
} | {
    filter: "DATE";
    value: string;
} | {
    filter: "COMPLETED";
} | {
    filter: "COMPLETED_ON_DATE";
    value: string;
} | {
    filter: "PENDING";
};
