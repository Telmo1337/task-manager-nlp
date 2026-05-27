import { interpret } from "./index";
import { initialState } from "./state/types";

// Characterization tests: capture current behaviour of interpret() so the
// Phase 2 refactor can run safely. Do NOT fix bugs here — test as-is.

describe("interpret() — single-turn / fresh input", () => {
  describe("CREATE_TASK", () => {
    it("returns FINAL when title, date, and time are all provided", () => {
      const { result } = interpret("add buy milk tomorrow at 3pm", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("CREATE_TASK");
        expect(result.payload.title).toBe("buy milk");
        expect(result.payload.date).toBe("tomorrow");
        expect(result.payload.time).toBe("3pm");
      }
    });

    it("asks for date when only title is provided", () => {
      const { result, state } = interpret("add buy milk", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/date/i);
      }
      expect(state.activeIntent).toBe("CREATE_TASK");
      expect(state.awaitingSlot).toBe("date");
    });

    it("asks for time when title and date are present but time is missing", () => {
      const { result, state } = interpret("add buy milk tomorrow", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/time/i);
      }
      expect(state.activeIntent).toBe("CREATE_TASK");
      expect(state.awaitingSlot).toBe("time");
    });
  });

  describe("LIST_TASKS", () => {
    it("returns FINAL LIST_TASKS for 'show my tasks'", () => {
      const { result } = interpret("show my tasks", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("LIST_TASKS");
      }
    });

    it("returns FINAL LIST_TASKS for 'list tasks'", () => {
      const { result } = interpret("list tasks", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("LIST_TASKS");
      }
    });
  });

  describe("DELETE_TASK", () => {
    it("returns FINAL DELETE_TASK with id when given 'delete task #1'", () => {
      const { result } = interpret("delete task #1", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("DELETE_TASK");
        expect(result.payload.id).toBe(1);
      }
    });
  });

  describe("DELETE_ALL_TASKS", () => {
    it("asks for confirmation before deleting all tasks", () => {
      const { result, state } = interpret("delete all tasks", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/yes/i);
      }
      expect(state.awaitingDeleteAllConfirmation).toBe(true);
    });
  });

  describe("EDIT_TASK", () => {
    it("asks what to change when only an id is given (no time conflict)", () => {
      // Note: small IDs like #1 or #5 are misread as time slots by the time extractor
      // (current behaviour: "1" extracted as time, causing FINAL instead of QUESTION).
      // #22 has no such conflict and correctly triggers the clarification flow.
      const { result, state } = interpret("edit #22", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/change/i);
      }
      expect(state.awaitingEditChanges?.taskId).toBe(22);
    });

    it("returns FINAL EDIT_TASK when id and date are provided inline", () => {
      // Current behaviour: #5 causes time="5" to also appear in payload (time extractor bug)
      const { result } = interpret("edit #22 to tomorrow", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("EDIT_TASK");
        expect(result.payload.id).toBe(22);
        expect(result.payload.date).toBe("tomorrow");
      }
    });
  });

  describe("UNDO_ACTION", () => {
    it("returns FINAL UNDO_ACTION for 'undo'", () => {
      const { result } = interpret("undo", initialState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("UNDO_ACTION");
      }
    });
  });

  describe("unrecognised input", () => {
    it("returns INFO for text with no recognisable intent", () => {
      const { result } = interpret("blah blah blah nonsense", initialState);
      expect(result.type).toBe("INFO");
    });
  });

  describe("conversational / chit-chat", () => {
    it("returns INFO for a greeting", () => {
      const { result } = interpret("hello", initialState);
      expect(result.type).toBe("INFO");
    });

    it("returns INFO for a thanks", () => {
      const { result } = interpret("thanks", initialState);
      expect(result.type).toBe("INFO");
    });
  });
});
