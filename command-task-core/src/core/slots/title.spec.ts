import { extractTitle } from "./title";

describe("extractTitle", () => {
  describe("CREATE_TASK", () => {
    it("extracts title from 'add buy milk tomorrow'", () => {
      const result = extractTitle("add buy milk tomorrow", "CREATE_TASK");
      expect(result[0]).toBe("buy milk");
    });

    it("extracts title from 'create task study english at 10'", () => {
      const result = extractTitle("create task study english at 10", "CREATE_TASK");
      expect(result[0]).toContain("study english");
    });

    it("extracts title with schedule keyword", () => {
      const result = extractTitle("schedule meeting today", "CREATE_TASK");
      expect(result[0]).toContain("meeting");
    });
  });

  describe("LIST_TASKS", () => {
    it("returns empty for LIST_TASKS", () => {
      expect(extractTitle("list tasks", "LIST_TASKS")).toEqual([]);
    });

    it("returns empty for show my tasks", () => {
      expect(extractTitle("show my tasks", "LIST_TASKS")).toEqual([]);
    });
  });

  describe("DELETE_TASK", () => {
    it("extracts title from delete command", () => {
      const result = extractTitle("delete buy milk", "DELETE_TASK");
      expect(result[0]).toContain("buy milk");
    });
  });

  describe("edge cases", () => {
    it("returns empty for pure date input", () => {
      expect(extractTitle("2026-01-15", "CREATE_TASK")).toEqual([]);
    });

    it("returns empty for pure time input", () => {
      expect(extractTitle("10:30", "CREATE_TASK")).toEqual([]);
    });

    it("returns empty for only keywords", () => {
      const result = extractTitle("add task for today", "CREATE_TASK");
      // Should be empty or very short since all are stop words
      expect(result[0] || "").toBe("");
    });
  });
});
