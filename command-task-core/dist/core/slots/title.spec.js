"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const title_1 = require("./title");
describe("extractTitle", () => {
    describe("CREATE_TASK", () => {
        it("extracts title from 'add buy milk tomorrow'", () => {
            const result = (0, title_1.extractTitle)("add buy milk tomorrow", "CREATE_TASK");
            expect(result[0]).toBe("buy milk");
        });
        it("extracts title from 'create task study english at 10'", () => {
            const result = (0, title_1.extractTitle)("create task study english at 10", "CREATE_TASK");
            expect(result[0]).toContain("study english");
        });
        it("extracts title with schedule keyword", () => {
            const result = (0, title_1.extractTitle)("schedule meeting today", "CREATE_TASK");
            expect(result[0]).toContain("meeting");
        });
    });
    describe("LIST_TASKS", () => {
        it("returns empty for LIST_TASKS", () => {
            expect((0, title_1.extractTitle)("list tasks", "LIST_TASKS")).toEqual([]);
        });
        it("returns empty for show my tasks", () => {
            expect((0, title_1.extractTitle)("show my tasks", "LIST_TASKS")).toEqual([]);
        });
    });
    describe("DELETE_TASK", () => {
        it("extracts title from delete command", () => {
            const result = (0, title_1.extractTitle)("delete buy milk", "DELETE_TASK");
            expect(result[0]).toContain("buy milk");
        });
    });
    describe("edge cases", () => {
        it("returns empty for pure date input", () => {
            expect((0, title_1.extractTitle)("2026-01-15", "CREATE_TASK")).toEqual([]);
        });
        it("returns empty for pure time input", () => {
            expect((0, title_1.extractTitle)("10:30", "CREATE_TASK")).toEqual([]);
        });
        it("returns empty for only keywords", () => {
            const result = (0, title_1.extractTitle)("add task for today", "CREATE_TASK");
            // Should be empty or very short since all are stop words
            expect(result[0] || "").toBe("");
        });
    });
});
