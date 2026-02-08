import { TaskService } from "./task.service";
import { TaskRepository } from "../repositories/task.repository";
import { TaskHistoryRepository } from "../repositories/taskHistory.repository";

jest.mock("../repositories/task.repository");
jest.mock("../repositories/taskHistory.repository");

describe("TaskService", () => {
  let service: TaskService;
  let repository: jest.Mocked<TaskRepository>;
  let historyRepository: jest.Mocked<TaskHistoryRepository>;

  const mockUserId = 1;

  beforeEach(() => {
    service = new TaskService();
    repository = (service as any).repository;
    historyRepository = (service as any).historyRepository;
    // Mock history create to avoid errors
    historyRepository.create.mockResolvedValue({} as any);
  });

  describe("createTask", () => {
    it("creates a task when input is valid", async () => {
      repository.create.mockResolvedValue({
        id: 1,
        title: "study english",
        description: null,
        dueAt: new Date(),
        status: "pending",
        priority: "normal",
        recurrence: null,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: mockUserId
      });

      repository.findDueOnDate.mockResolvedValue([]);

      const result = await service.createTask({
        title: "study english",
        date: "2026-01-21",
        time: "10",
        userId: mockUserId
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
          description: null,
          dueAt: new Date(),
          status: "pending",
          priority: "normal",
          recurrence: null,
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: mockUserId
        }
      ]);

      const result = await service.createTask({
        title: "study english",
        date: "2026-01-21",
        time: "10",
        userId: mockUserId
      });

      expect(result.duplicate).toBe(true);
      expect(result.task).toBeDefined();
    });
  });
});
