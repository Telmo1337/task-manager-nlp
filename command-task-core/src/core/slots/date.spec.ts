import { extractDates } from "./date";

describe("extractDates", () => {
  describe("basic keywords", () => {
    it("extracts 'today'", () => {
      expect(extractDates("do it today")).toContain("today");
    });

    it("extracts 'tomorrow'", () => {
      expect(extractDates("schedule for tomorrow")).toContain("tomorrow");
    });

    it("extracts 'yesterday'", () => {
      expect(extractDates("it was yesterday")).toContain("yesterday");
    });

    it("extracts 'day after tomorrow'", () => {
      expect(extractDates("day after tomorrow")).toContain("day after tomorrow");
    });
  });

  describe("weekdays", () => {
    it("extracts 'next monday'", () => {
      expect(extractDates("next monday")).toContain("next monday");
    });

    it("extracts 'tuesday' as 'next tuesday'", () => {
      expect(extractDates("on tuesday")).toContain("next tuesday");
    });

    it("extracts 'next friday'", () => {
      expect(extractDates("schedule for next friday")).toContain("next friday");
    });
  });

  describe("relative dates", () => {
    it("extracts 'in 3 days'", () => {
      expect(extractDates("in 3 days")).toContain("in 3 days");
    });

    it("extracts 'in 1 day'", () => {
      expect(extractDates("in 1 day")).toContain("in 1 day");
    });

    it("extracts 'in 2 weeks'", () => {
      expect(extractDates("in 2 weeks")).toContain("in 2 weeks");
    });

    it("extracts 'next week'", () => {
      expect(extractDates("next week")).toContain("next week");
    });
  });

  describe("month formats", () => {
    it("extracts 'jan 15'", () => {
      const result = extractDates("on jan 15");
      expect(result).toContain("jan 15");
    });

    it("extracts 'january 20'", () => {
      const result = extractDates("january 20");
      expect(result).toContain("january 20");
    });

    it("extracts '15 jan' as 'jan 15'", () => {
      const result = extractDates("15th jan");
      expect(result).toContain("jan 15");
    });
  });

  describe("ISO format", () => {
    it("extracts ISO date", () => {
      expect(extractDates("2026-02-15")).toContain("2026-02-15");
    });
  });

  describe("PT format (dd/mm/yyyy)", () => {
    it("extracts PT slash format", () => {
      expect(extractDates("15/02/2026")).toContain("15/02/2026");
    });

    it("extracts PT dash format", () => {
      expect(extractDates("15-02-2026")).toContain("15-02-2026");
    });
  });

  describe("edge cases", () => {
    it("returns empty for no date", () => {
      expect(extractDates("buy milk")).toEqual([]);
    });

    it("extracts multiple dates", () => {
      const result = extractDates("from today to tomorrow");
      expect(result).toContain("today");
      expect(result).toContain("tomorrow");
    });
  });
});
