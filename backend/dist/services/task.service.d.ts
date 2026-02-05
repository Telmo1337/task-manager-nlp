interface CreateTaskInput {
    title: string;
    date: string;
    time?: string;
}
type ListTasksFilter = {
    type: "ALL";
} | {
    type: "TODAY";
} | {
    type: "TOMORROW";
} | {
    type: "DATE";
    value: string;
};
interface EditTaskInput {
    id: unknown;
    title?: unknown;
    date?: unknown;
    time?: unknown;
}
export declare class TaskService {
    private repository;
    createTask(input: CreateTaskInput): Promise<{
        duplicate: boolean;
        task: {
            title: string;
            dueAt: Date;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        payload?: undefined;
    } | {
        duplicate: boolean;
        task: {
            title: string;
            dueAt: Date;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        };
        payload: {
            title: string;
            dueAt: Date;
        };
    }>;
    listTasksWithFilter(filter: ListTasksFilter): Promise<{
        id: number;
        title: string;
        dueAt: Date;
        createdAt: Date;
    }[]>;
    deleteTask(taskId: unknown): Promise<{
        id: number;
    }>;
    editTask(input: EditTaskInput): Promise<{
        id: number;
        title: string;
        dueAt: Date;
    }>;
    deleteTaskSmart(input: {
        id?: number;
        title?: string;
    }): Promise<{
        deleted: boolean;
        candidates?: undefined;
    } | {
        deleted: boolean;
        candidates: {
            id: number;
            title: string;
            dueAt: Date;
        }[];
    }>;
}
export {};
