"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const client_1 = require("../prisma/client");
class TaskRepository {
    create(data) {
        return client_1.prisma.task.create({
            data: {
                title: data.title.trim().toLowerCase(),
                dueAt: data.dueAt
            }
        });
    }
    findAll() {
        return client_1.prisma.task.findMany({
            orderBy: { dueAt: "asc" }
        });
    }
    findDueToday() {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return client_1.prisma.task.findMany({
            where: { dueAt: { gte: start, lte: end } },
            orderBy: { dueAt: "asc" }
        });
    }
    findDueTomorrow() {
        const base = new Date();
        base.setDate(base.getDate() + 1);
        const start = new Date(base);
        start.setHours(0, 0, 0, 0);
        const end = new Date(base);
        end.setHours(23, 59, 59, 999);
        return client_1.prisma.task.findMany({
            where: { dueAt: { gte: start, lte: end } },
            orderBy: { dueAt: "asc" }
        });
    }
    findDueOnDate(date) {
        const base = new Date(date);
        if (isNaN(base.getTime())) {
            throw new Error("INVALID_DATE");
        }
        const start = new Date(base);
        start.setHours(0, 0, 0, 0);
        const end = new Date(base);
        end.setHours(23, 59, 59, 999);
        return client_1.prisma.task.findMany({
            where: { dueAt: { gte: start, lte: end } },
            orderBy: { dueAt: "asc" }
        });
    }
    /* ======================================================
       ✅ DUPLICADO = MESMO título NORMALIZADO + MESMO instante
       ====================================================== */
    findDuplicate(title, dueAt) {
        return client_1.prisma.task.findFirst({
            where: {
                title: title.trim().toLowerCase(),
                dueAt: dueAt
            }
        });
    }
    deleteById(id) {
        return client_1.prisma.task.delete({ where: { id } });
    }
    updateById(id, data) {
        return client_1.prisma.task.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title.trim().toLowerCase() }),
                ...(data.dueAt && { dueAt: data.dueAt })
            }
        });
    }
    /* ======================================================
     🔍 PROCURAR POR TÍTULO (para DELETE inteligente)
     ====================================================== */
    findByTitle(title) {
        return client_1.prisma.task.findMany({
            where: {
                title: {
                    contains: title.trim().toLowerCase()
                }
            },
            orderBy: { dueAt: "asc" }
        });
    }
}
exports.TaskRepository = TaskRepository;
