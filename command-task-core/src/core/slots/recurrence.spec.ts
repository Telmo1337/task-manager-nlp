import { extractRecurrence } from "./recurrence";

describe("extractRecurrence()", () => {
  it("returns daily for 'every day'", () => {
    expect(extractRecurrence("remind me every day")).toEqual({ type: "daily" });
  });

  it("returns daily for 'daily'", () => {
    expect(extractRecurrence("standup daily")).toEqual({ type: "daily" });
  });

  it("returns daily with interval for 'every 3 days'", () => {
    expect(extractRecurrence("water plants every 3 days")).toEqual({ type: "daily", interval: 3 });
  });

  it("returns weekly for 'every week'", () => {
    expect(extractRecurrence("team meeting every week")).toEqual({ type: "weekly" });
  });

  it("returns weekly for 'weekly'", () => {
    expect(extractRecurrence("review weekly")).toEqual({ type: "weekly" });
  });

  it("returns weekly with interval for 'every 2 weeks'", () => {
    expect(extractRecurrence("check-in every 2 weeks")).toEqual({ type: "weekly", interval: 2 });
  });

  it("returns monthly for 'every month'", () => {
    expect(extractRecurrence("pay rent every month")).toEqual({ type: "monthly" });
  });

  it("returns yearly for 'annually'", () => {
    expect(extractRecurrence("renew license annually")).toEqual({ type: "yearly" });
  });

  it("returns specific weekdays for 'every monday'", () => {
    const result = extractRecurrence("gym every monday");
    expect(result?.type).toBe("weekdays");
    expect(result?.days).toContain("monday");
  });

  it("returns weekdays Mon-Fri for 'weekdays'", () => {
    const result = extractRecurrence("standup weekdays");
    expect(result?.type).toBe("weekdays");
    expect(result?.days).toEqual(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  });

  it("returns weekends for 'weekends'", () => {
    const result = extractRecurrence("walk weekends");
    expect(result?.type).toBe("weekdays");
    expect(result?.days).toEqual(["saturday", "sunday"]);
  });

  it("returns null when no recurrence keyword is present", () => {
    expect(extractRecurrence("buy groceries tomorrow at 3pm")).toBeNull();
  });
});
