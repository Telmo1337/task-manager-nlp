import { extractDescription, isDescriptionKeywordOnly } from "./description";

describe("extractDescription()", () => {
  it("extracts text after 'description:'", () => {
    expect(extractDescription("add task description: bring the documents")).toBe("bring the documents");
  });

  it("extracts text after 'desc:'", () => {
    expect(extractDescription("meeting desc: discuss Q3 budget")).toBe("discuss Q3 budget");
  });

  it("extracts text after 'note:'", () => {
    expect(extractDescription("call mom note: ask about dinner")).toBe("ask about dinner");
  });

  it("extracts text after 'with description'", () => {
    expect(extractDescription("add task with description buy the stuff")).toBe("buy the stuff");
  });

  it("stops at date keyword when present", () => {
    const result = extractDescription("buy milk description: fresh milk tomorrow at 3pm");
    expect(result).toBe("fresh milk");
  });

  it("returns null when no description keyword is present", () => {
    expect(extractDescription("add buy groceries tomorrow at 3pm")).toBeNull();
  });
});

describe("isDescriptionKeywordOnly()", () => {
  it("returns true for 'description'", () => {
    expect(isDescriptionKeywordOnly("description")).toBe(true);
  });

  it("returns true for 'desc'", () => {
    expect(isDescriptionKeywordOnly("desc")).toBe(true);
  });

  it("returns true for 'note'", () => {
    expect(isDescriptionKeywordOnly("note")).toBe(true);
  });

  it("returns false when text has more content", () => {
    expect(isDescriptionKeywordOnly("description: some text")).toBe(false);
  });
});
