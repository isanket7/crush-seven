import { describe, it, expect } from "vitest";
import { addDays, startOfDay, formatISODate, formatDisplay } from "./date";

describe("date utils", () => {
  it("startOfDay zeroes time", () => {
    const d = new Date("2025-01-15T13:45:10.123Z");
    const sod = startOfDay(d);
    expect(sod.getHours()).toBe(0);
    expect(sod.getMinutes()).toBe(0);
    expect(sod.getSeconds()).toBe(0);
    expect(sod.getMilliseconds()).toBe(0);
  });

  it("addDays adds calendar days", () => {
    const d = new Date("2025-01-30T00:00:00.000Z");
    const next = addDays(d, 5);
    expect(formatISODate(next)).toBe("2025-02-04");
  });

  it("formatISODate returns yyyy-mm-dd", () => {
    const d = new Date("2024-03-09T05:00:00Z");
    expect(formatISODate(d)).toBe("2024-03-09");
  });

  it("formatDisplay returns localized string", () => {
    const str = formatDisplay("2024-12-01", "en-IN");
    expect(typeof str).toBe("string");
    expect(str.length).toBeGreaterThan(0);
  });
});
