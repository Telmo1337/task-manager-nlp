import { interpret } from "./index";
import { ConversationState, initialState } from "./state/types";

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
      expect(state.kind).toBe("AWAITING_SLOT");
      if (state.kind === "AWAITING_SLOT") {
        expect(state.activeIntent).toBe("CREATE_TASK");
        expect(state.awaitingSlot).toBe("date");
      }
    });

    it("asks for time when title and date are present but time is missing", () => {
      const { result, state } = interpret("add buy milk tomorrow", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/time/i);
      }
      expect(state.kind).toBe("AWAITING_SLOT");
      if (state.kind === "AWAITING_SLOT") {
        expect(state.activeIntent).toBe("CREATE_TASK");
        expect(state.awaitingSlot).toBe("time");
      }
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
      expect(state.kind).toBe("PENDING_DELETE_ALL");
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
      expect(state.kind).toBe("EDIT");
      if (state.kind === "EDIT") {
        expect(state.taskId).toBe(22);
      }
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

    it("identity — returns INFO with assistant description for 'who are you'", () => {
      const { result } = interpret("who are you", initialState);
      expect(result.type).toBe("INFO");
      if (result.type === "INFO") {
        expect(result.message).toMatch(/task manager/i);
      }
    });

    it("identity — returns INFO with name for 'what is your name'", () => {
      const { result } = interpret("what is your name", initialState);
      expect(result.type).toBe("INFO");
      if (result.type === "INFO") {
        expect(result.message).toMatch(/task manager/i);
      }
    });

    it("help — returns INFO with command examples for 'help'", () => {
      const { result } = interpret("help", initialState);
      expect(result.type).toBe("INFO");
      if (result.type === "INFO") {
        expect(result.message).toMatch(/create|show|list/i);
      }
    });

    it("help — returns INFO with capabilities for 'what can you do'", () => {
      const { result } = interpret("what can you do", initialState);
      expect(result.type).toBe("INFO");
      if (result.type === "INFO") {
        expect(result.message).toMatch(/create|tasks/i);
      }
    });

    it("joke — returns INFO with a message from the jokes set", () => {
      const knownJokes = [
        "Why did the task go to therapy? It had too many issues to resolve! 😄",
        "I tried to organize a hide and seek tournament, but it was a disaster. Good players are hard to find!",
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "What do you call a task that's been waiting forever? Pro-crastinated! ⏰",
      ];
      const { result } = interpret("tell me a joke", initialState);
      expect(result.type).toBe("INFO");
      if (result.type === "INFO") {
        expect(knownJokes).toContain(result.message);
      }
    });

    it("goodbye — returns INFO for 'bye'", () => {
      const { result } = interpret("bye", initialState);
      expect(result.type).toBe("INFO");
    });
  });
});

describe("interpret() — multi-turn / state machine", () => {
  describe("CREATE_TASK slot-filling (title → date → time)", () => {
    it("fills slots across three turns and returns FINAL CREATE_TASK", () => {
      const t1 = interpret("add buy milk", initialState);
      expect(t1.result.type).toBe("QUESTION");
      expect(t1.state.kind).toBe("AWAITING_SLOT");
      if (t1.state.kind === "AWAITING_SLOT") {
        expect(t1.state.activeIntent).toBe("CREATE_TASK");
        expect(t1.state.awaitingSlot).toBe("date");
      }

      const t2 = interpret("tomorrow", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("AWAITING_SLOT");
      if (t2.state.kind === "AWAITING_SLOT") {
        expect(t2.state.activeIntent).toBe("CREATE_TASK");
        expect(t2.state.awaitingSlot).toBe("time");
      }

      const t3 = interpret("3pm", t2.state);
      expect(t3.result.type).toBe("FINAL");
      if (t3.result.type === "FINAL") {
        expect(t3.result.intent).toBe("CREATE_TASK");
        expect(t3.result.payload.title).toBe("buy milk");
        expect(t3.result.payload.date).toBe("tomorrow");
        expect(t3.result.payload.time).toBe("3pm");
      }
    });

    it("cancels slot-filling when user types 'cancel'", () => {
      const t1 = interpret("add buy milk", initialState);
      const t2 = interpret("cancel", t1.state);
      expect(t2.result.type).toBe("INFO");
      expect(t2.state.kind).toBe("IDLE");
    });
  });

  describe("DELETE_ALL_TASKS confirmation", () => {
    it("executes DELETE_ALL when user confirms with 'yes'", () => {
      const t1 = interpret("delete all tasks", initialState);
      expect(t1.result.type).toBe("QUESTION");
      expect(t1.state.kind).toBe("PENDING_DELETE_ALL");

      const t2 = interpret("yes", t1.state);
      expect(t2.result.type).toBe("FINAL");
      if (t2.result.type === "FINAL") {
        expect(t2.result.intent).toBe("DELETE_ALL_TASKS");
      }
    });

    it("cancels DELETE_ALL when user answers 'no'", () => {
      const t1 = interpret("delete all tasks", initialState);
      const t2 = interpret("no", t1.state);
      expect(t2.result.type).toBe("INFO");
      expect(t2.state.kind).toBe("IDLE");
    });

    it("re-asks when response is neither yes nor no", () => {
      const t1 = interpret("delete all tasks", initialState);
      const t2 = interpret("maybe", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("PENDING_DELETE_ALL");
    });
  });

  describe("EDIT_TASK — two-turn field flows", () => {
    it("date field: edit → 'date' → provide date → FINAL EDIT_TASK", () => {
      const t1 = interpret("edit #22", initialState);
      expect(t1.result.type).toBe("QUESTION");
      expect(t1.state.kind).toBe("EDIT");
      if (t1.state.kind === "EDIT") {
        expect(t1.state.taskId).toBe(22);
      }

      const t2 = interpret("date", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("EDIT");
      if (t2.state.kind === "EDIT") {
        expect(t2.state.editSubState).toBe("AWAITING_DATE");
      }

      const t3 = interpret("tomorrow", t2.state);
      expect(t3.result.type).toBe("FINAL");
      if (t3.result.type === "FINAL") {
        expect(t3.result.intent).toBe("EDIT_TASK");
        expect(t3.result.payload.id).toBe(22);
        expect(t3.result.payload.date).toBe("tomorrow");
      }
    });

    it("time field: edit → 'time' → provide time → FINAL EDIT_TASK", () => {
      const t1 = interpret("edit #22", initialState);
      const t2 = interpret("time", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("EDIT");
      if (t2.state.kind === "EDIT") {
        expect(t2.state.editSubState).toBe("AWAITING_TIME");
      }

      const t3 = interpret("5pm", t2.state);
      expect(t3.result.type).toBe("FINAL");
      if (t3.result.type === "FINAL") {
        expect(t3.result.intent).toBe("EDIT_TASK");
        expect(t3.result.payload.id).toBe(22);
        expect(t3.result.payload.time).toBe("5pm");
      }
    });

    it("title field: edit → 'title' → provide title → FINAL EDIT_TASK", () => {
      const t1 = interpret("edit #22", initialState);
      const t2 = interpret("title", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("EDIT");
      if (t2.state.kind === "EDIT") {
        expect(t2.state.editSubState).toBe("AWAITING_TITLE");
      }

      const t3 = interpret("New Task Name", t2.state);
      expect(t3.result.type).toBe("FINAL");
      if (t3.result.type === "FINAL") {
        expect(t3.result.intent).toBe("EDIT_TASK");
        expect(t3.result.payload.id).toBe(22);
        expect(t3.result.payload.title).toBe("New Task Name");
      }
    });

    it("priority field: edit → 'priority' → provide priority → FINAL EDIT_TASK", () => {
      const t1 = interpret("edit #22", initialState);
      const t2 = interpret("priority", t1.state);
      expect(t2.result.type).toBe("QUESTION");
      expect(t2.state.kind).toBe("EDIT");
      if (t2.state.kind === "EDIT") {
        expect(t2.state.editSubState).toBe("AWAITING_PRIORITY");
      }

      const t3 = interpret("high", t2.state);
      expect(t3.result.type).toBe("FINAL");
      if (t3.result.type === "FINAL") {
        expect(t3.result.intent).toBe("EDIT_TASK");
        expect(t3.result.payload.id).toBe(22);
        expect(t3.result.payload.priority).toBeDefined();
      }
    });

    it("cancels edit flow when user types 'cancel'", () => {
      const t1 = interpret("edit #22", initialState);
      const t2 = interpret("cancel", t1.state);
      expect(t2.result.type).toBe("INFO");
      expect(t2.state.kind).toBe("IDLE");
    });
  });

  describe("DELETE_TASK — disambiguation", () => {
    const pendingDeleteState: ConversationState = {
      kind: "PENDING_DELETE",
      candidates: [
        { id: 3, title: "Meeting", dueAt: "2025-01-15T10:00:00Z" },
        { id: 7, title: "Meeting", dueAt: "2025-01-20T10:00:00Z" },
      ],
      slots: {},
    };

    it("resolves by id when user types the task id", () => {
      const { result } = interpret("#3", pendingDeleteState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("DELETE_TASK");
        expect(result.payload.id).toBe(3);
      }
    });

    it("resolves to earliest task when user types 'earliest'", () => {
      const { result } = interpret("earliest", pendingDeleteState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("DELETE_TASK");
        expect(result.payload.id).toBe(3);
      }
    });

    it("resolves to latest task when user types 'latest'", () => {
      const { result } = interpret("latest", pendingDeleteState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("DELETE_TASK");
        expect(result.payload.id).toBe(7);
      }
    });

    it("re-asks when response is not an id or earliest/latest", () => {
      const { result, state } = interpret("dunno", pendingDeleteState);
      expect(result.type).toBe("QUESTION");
      expect(state.kind).toBe("PENDING_DELETE");
    });
  });

  describe("optional time slot", () => {
    const awaitingTimeState: ConversationState = {
      kind: "AWAITING_OPTIONAL_TIME",
      pendingCommand: {
        intent: "CREATE_TASK",
        payload: { title: "buy milk", date: "tomorrow" },
      },
      slots: {},
    };

    it("skips time and returns FINAL on 'no'", () => {
      const { result } = interpret("no", awaitingTimeState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("CREATE_TASK");
        expect(result.payload.title).toBe("buy milk");
        expect(result.payload.date).toBe("tomorrow");
        expect(result.payload.time).toBeUndefined();
      }
    });

    it("skips time and returns FINAL on 'skip'", () => {
      const { result } = interpret("skip", awaitingTimeState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("CREATE_TASK");
        expect(result.payload.time).toBeUndefined();
      }
    });

    it("accepts a valid time and includes it in FINAL", () => {
      const { result } = interpret("3pm", awaitingTimeState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("CREATE_TASK");
        expect(result.payload.time).toBe("3pm");
      }
    });
  });

  describe("AMBIGUOUS_SLOT — fresh input triggers disambiguation", () => {
    it("asks which time when two times are provided in one message", () => {
      const { result, state } = interpret("add buy milk tomorrow at 3pm or 5pm", initialState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/3pm/);
        expect(result.message).toMatch(/5pm/);
      }
      expect(state.kind).toBe("AWAITING_DISAMBIGUATION");
      if (state.kind === "AWAITING_DISAMBIGUATION") {
        expect(state.ambiguousSlot).toBe("time");
        expect(state.values).toContain("3pm");
        expect(state.values).toContain("5pm");
        expect(state.activeIntent).toBe("CREATE_TASK");
      }
    });

    it("end-to-end: fresh input → disambiguation → FINAL", () => {
      const t1 = interpret("add buy milk tomorrow at 3pm or 5pm", initialState);
      expect(t1.state.kind).toBe("AWAITING_DISAMBIGUATION");

      const t2 = interpret("2", t1.state);
      expect(t2.result.type).toBe("FINAL");
      if (t2.result.type === "FINAL") {
        expect(t2.result.intent).toBe("CREATE_TASK");
        expect(t2.result.payload.time).toBe("5pm");
        expect(t2.result.payload.date).toBe("tomorrow");
      }
    });
  });

  describe("AWAITING_DISAMBIGUATION — slot ambiguity flow", () => {
    const disambState: ConversationState = {
      kind: "AWAITING_DISAMBIGUATION",
      activeIntent: "CREATE_TASK",
      ambiguousSlot: "time",
      values: ["3pm", "5pm"],
      slots: { title: ["buy milk"], date: ["tomorrow"], time: ["3pm", "5pm"] },
    };

    it("resolves by 1-based index and returns FINAL", () => {
      const { result, state } = interpret("1", disambState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.intent).toBe("CREATE_TASK");
        expect(result.payload.time).toBe("3pm");
        expect(result.payload.title).toBe("buy milk");
        expect(result.payload.date).toBe("tomorrow");
      }
      expect(state.kind).toBe("IDLE");
    });

    it("resolves by value text and returns FINAL", () => {
      const { result } = interpret("5pm", disambState);
      expect(result.type).toBe("FINAL");
      if (result.type === "FINAL") {
        expect(result.payload.time).toBe("5pm");
      }
    });

    it("re-asks when response does not match any value or index", () => {
      const { result, state } = interpret("dunno", disambState);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/3pm/);
        expect(result.message).toMatch(/5pm/);
      }
      expect(state.kind).toBe("AWAITING_DISAMBIGUATION");
    });

    it("falls back to AWAITING_SLOT when resolving still leaves a missing required slot", () => {
      const partialDisamb: ConversationState = {
        kind: "AWAITING_DISAMBIGUATION",
        activeIntent: "CREATE_TASK",
        ambiguousSlot: "time",
        values: ["3pm", "5pm"],
        slots: { title: ["buy milk"], time: ["3pm", "5pm"] }, // date missing
      };
      const { result, state } = interpret("1", partialDisamb);
      expect(result.type).toBe("QUESTION");
      if (result.type === "QUESTION") {
        expect(result.message).toMatch(/date/i);
      }
      expect(state.kind).toBe("AWAITING_SLOT");
      if (state.kind === "AWAITING_SLOT") {
        expect(state.awaitingSlot).toBe("date");
      }
    });
  });
});
