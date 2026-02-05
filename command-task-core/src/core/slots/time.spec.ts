import { extractTimes } from "./time";

describe("extractTimes", () => {
  describe("simple hour", () => {
    it("extracts '10'", () => {
      expect(extractTimes("at 10")).toContain("10");
    });

    it("extracts '9'", () => {
      expect(extractTimes("9")).toContain("9");
    });
  });

  describe("hour:minute format", () => {
    it("extracts '10:30'", () => {
      expect(extractTimes("at 10:30")).toContain("10:30");
    });

    it("extracts '09:00'", () => {
      expect(extractTimes("09:00")).toContain("09:00");
    });
  });

  describe("AM/PM format", () => {
    it("extracts '10am'", () => {
      expect(extractTimes("at 10am")).toContain("10am");
    });

    it("extracts '3pm'", () => {
      expect(extractTimes("3pm")).toContain("3pm");
    });

    it("extracts '10 am' with space", () => {
      const result = extractTimes("10 am");
      expect(result.some(t => t.includes("10"))).toBe(true);
    });
  });

  describe("24h format with 'h'", () => {
    it("extracts '22h'", () => {
      expect(extractTimes("22h")).toContain("22h");
    });

    it("extracts '9h'", () => {
      expect(extractTimes("9h")).toContain("9h");
    });
  });

  describe("edge cases", () => {
    it("returns empty for no time", () => {
      expect(extractTimes("buy milk tomorrow")).toEqual([]);
    });

    it("does not extract year as time", () => {
      const result = extractTimes("2026-01-15");
      expect(result).not.toContain("2026");
    });
  });
});
