import { detectIntent } from "./detector";

describe("detectIntent", () => {
  describe("CREATE_TASK intent", () => {
    it("detects 'add' keyword", () => {
      expect(detectIntent("add buy milk")).toEqual({ primary: "CREATE_TASK" });
    });

    it("detects 'create' keyword", () => {
      expect(detectIntent("create task study")).toEqual({ primary: "CREATE_TASK" });
    });

    it("detects 'schedule' keyword", () => {
      expect(detectIntent("schedule meeting")).toEqual({ primary: "CREATE_TASK" });
    });

    it("detects 'new' keyword", () => {
      expect(detectIntent("new task homework")).toEqual({ primary: "CREATE_TASK" });
    });
  });

  describe("LIST_TASKS intent", () => {
    it("detects 'list' keyword", () => {
      expect(detectIntent("list tasks")).toEqual({ primary: "LIST_TASKS" });
    });

    it("detects 'show' keyword", () => {
      expect(detectIntent("show my tasks")).toEqual({ primary: "LIST_TASKS" });
    });

    it("detects 'view' keyword", () => {
      expect(detectIntent("view tasks")).toEqual({ primary: "LIST_TASKS" });
    });
  });

  describe("DELETE_TASK intent", () => {
    it("detects 'delete' keyword", () => {
      expect(detectIntent("delete task 1")).toEqual({ primary: "DELETE_TASK" });
    });

    it("detects 'remove' keyword", () => {
      expect(detectIntent("remove buy milk")).toEqual({ primary: "DELETE_TASK" });
    });

    it("detects 'cancel task' keyword", () => {
      expect(detectIntent("cancel task meeting")).toEqual({ primary: "DELETE_TASK" });
    });
  });

  describe("EDIT_TASK intent", () => {
    it("detects 'edit' keyword", () => {
      expect(detectIntent("edit task 1")).toEqual({ primary: "EDIT_TASK" });
    });

    it("detects 'update' keyword", () => {
      expect(detectIntent("update meeting")).toEqual({ primary: "EDIT_TASK" });
    });

    it("detects 'change' keyword", () => {
      expect(detectIntent("change task time")).toEqual({ primary: "EDIT_TASK" });
    });
  });

  describe("no intent", () => {
    it("returns null for unknown input", () => {
      expect(detectIntent("hello world")).toEqual({ primary: null });
    });

    it("returns null for empty string", () => {
      expect(detectIntent("")).toEqual({ primary: null });
    });
  });

  describe("safe chaining", () => {
    it("allows CREATE + LIST chaining", () => {
      const result = detectIntent("add buy milk and show tasks");
      expect(result.primary).toBe("CREATE_TASK");
      expect(result.secondary).toBe("LIST_TASKS");
    });
  });
});
