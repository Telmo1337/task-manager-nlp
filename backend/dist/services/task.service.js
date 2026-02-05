"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const dateTimeResolver_1 = require("../utils/dateTimeResolver");
class TaskService {
    constructor() {
        this.repository = new task_repository_1.TaskRepository();
    }
    /* ======================================================
       CREATE TASK — duplicado = MESMO título + MESMA hora
       ====================================================== */
    async createTask(input) {
        if (!input.title || !input.date) {
            throw new Error("TITLE_AND_DATE_REQUIRED");
        }
        // ⚠️ se não houver hora, NÃO normalizamos para 00:00
        if (!input.time) {
            const dueAt = (0, dateTimeResolver_1.resolveDateTime)(input.date);
            const created = await this.repository.create({
                title: input.title,
                dueAt,
            });
            return {
                duplicate: false,
                task: created,
            };
        }
        // ⏱️ daqui para baixo SÓ com hora
        const dueAt = (0, dateTimeResolver_1.resolveDateTime)(input.date, input.time);
        const duplicate = await this.repository.findDuplicate(input.title, dueAt);
        if (duplicate) {
            return {
                duplicate: true,
                task: duplicate,
                payload: {
                    title: input.title,
                    dueAt,
                },
            };
        }
        const created = await this.repository.create({
            title: input.title,
            dueAt,
        });
        return {
            duplicate: false,
            task: created,
        };
    }
    /* ======================================================
       LIST TASKS
       ====================================================== */
    async listTasksWithFilter(filter) {
        let tasks;
        switch (filter.type) {
            case "TODAY":
                tasks = await this.repository.findDueToday();
                break;
            case "TOMORROW":
                tasks = await this.repository.findDueTomorrow();
                break;
            case "DATE":
                tasks = await this.repository.findDueOnDate(filter.value);
                break;
            default:
                tasks = await this.repository.findAll();
        }
        return tasks.map((task) => ({
            id: task.id,
            title: task.title,
            dueAt: task.dueAt,
            createdAt: task.createdAt,
        }));
    }
    async deleteTask(taskId) {
        const id = Number(taskId);
        if (!id || Number.isNaN(id)) {
            throw new Error("INVALID_TASK_ID");
        }
        await this.repository.deleteById(id);
        return { id };
    }
    async editTask(input) {
        const id = Number(input.id);
        if (!id || Number.isNaN(id)) {
            throw new Error("INVALID_TASK_ID");
        }
        const data = {};
        if (typeof input.title === "string") {
            data.title = input.title;
        }
        if (typeof input.date === "string") {
            data.dueAt = (0, dateTimeResolver_1.resolveDateTime)(input.date, typeof input.time === "string" ? input.time : undefined);
        }
        if (!Object.keys(data).length) {
            throw new Error("NO_FIELDS_TO_UPDATE");
        }
        const updated = await this.repository.updateById(id, data);
        return {
            id: updated.id,
            title: updated.title,
            dueAt: updated.dueAt,
        };
    }
    /* ======================================================
       DELETE INTELIGENTE
       ====================================================== */
    async deleteTaskSmart(input) {
        // 1️⃣ DELETE direto por ID
        if (input.id) {
            await this.repository.deleteById(input.id);
            return { deleted: true };
        }
        // 2️⃣ DELETE por título
        if (!input.title) {
            throw new Error("DELETE_NEEDS_CRITERIA");
        }
        const matches = await this.repository.findByTitle(input.title);
        if (matches.length === 0) {
            throw new Error("TASK_NOT_FOUND");
        }
        if (matches.length === 1) {
            await this.repository.deleteById(matches[0].id);
            return { deleted: true };
        }
        // 3️⃣ Ambíguo → pedir confirmação
        return {
            deleted: false,
            candidates: matches.map((task) => ({
                id: task.id,
                title: task.title,
                dueAt: task.dueAt,
            })),
        };
    }
}
exports.TaskService = TaskService;
