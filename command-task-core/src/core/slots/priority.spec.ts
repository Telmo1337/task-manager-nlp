import { extractPriority } from "./priority";

describe("extractPriority()", () => {
  it("returns 'urgent' for 'asap'", () => {
    expect(extractPriority("finish report asap")).toBe("urgent");
  });

  it("returns 'urgent' for 'critical'", () => {
    expect(extractPriority("critical bug fix")).toBe("urgent");
  });

  it("returns 'high' for 'high priority'", () => {
    expect(extractPriority("high priority meeting")).toBe("high");
  });

  it("returns 'high' for 'important'", () => {
    expect(extractPriority("important call with client")).toBe("high");
  });

  it("returns 'low' for 'low'", () => {
    expect(extractPriority("low priority email")).toBe("low");
  });

  it("returns 'low' for 'whenever'", () => {
    expect(extractPriority("clean desk whenever")).toBe("low");
  });

  it("returns 'normal' for 'normal'", () => {
    expect(extractPriority("normal priority task")).toBe("normal");
  });

  it("returns null when no priority keyword is present", () => {
    expect(extractPriority("buy groceries tomorrow at 3pm")).toBeNull();
  });
});
