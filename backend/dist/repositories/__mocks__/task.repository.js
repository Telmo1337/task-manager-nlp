"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
class TaskRepository {
    constructor() {
        this.create = jest.fn();
        this.findAll = jest.fn();
        this.findByDate = jest.fn();
        this.deleteById = jest.fn();
        this.updateById = jest.fn();
    }
}
exports.TaskRepository = TaskRepository;
