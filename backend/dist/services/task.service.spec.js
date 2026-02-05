"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("./task.service");
jest.mock("../repositories/task.repository");
describe("TaskService", () => {
    let service;
    let repository;
    beforeEach(() => {
        service = new task_service_1.TaskService();
        repository = service.repository;
    });
    describe("createTask", () => {
        it("creates a task when input is valid", async () => {
            repository.create.mockResolvedValue({
                id: 1,
                title: "study english",
                dueAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            repository.findDueOnDate.mockResolvedValue([]);
            const result = await service.createTask({
                title: "study english",
                date: "2026-01-21",
                time: "10"
            });
            expect(result.duplicate).toBe(false);
            expect(result.task.title).toBe("study english");
            expect(result.task.dueAt).toBeInstanceOf(Date);
        });
        it("detects duplicate task on same date", async () => {
            repository.findDueOnDate.mockResolvedValue([
                {
                    id: 1,
                    title: "study english",
                    dueAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            const result = await service.createTask({
                title: "study english",
                date: "2026-01-21",
                time: "10"
            });
            expect(result.duplicate).toBe(true);
            expect(result.task).toBeDefined();
        });
    });
});
