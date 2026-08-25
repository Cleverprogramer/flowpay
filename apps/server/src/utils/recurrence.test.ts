import { describe, expect, test } from "bun:test";
import { computeNextRunAt } from "./recurrence";

describe("computeNextRunAt", () => {
  const base = new Date("2026-01-15T10:00:00.000Z");

  test("advances daily by one day", () => {
    expect(computeNextRunAt(base, "daily").toISOString()).toBe(
      "2026-01-16T10:00:00.000Z",
    );
  });

  test("advances weekly by seven days", () => {
    expect(computeNextRunAt(base, "weekly").toISOString()).toBe(
      "2026-01-22T10:00:00.000Z",
    );
  });

  test("advances monthly by one month", () => {
    expect(computeNextRunAt(base, "monthly").toISOString()).toBe(
      "2026-02-15T10:00:00.000Z",
    );
  });

  test("advances yearly by one year", () => {
    expect(computeNextRunAt(base, "yearly").toISOString()).toBe(
      "2027-01-15T10:00:00.000Z",
    );
  });

  test("clamps month-end overflow like JavaScript dates", () => {
    const monthEnd = new Date("2026-03-31T10:00:00.000Z");
    expect(computeNextRunAt(monthEnd, "monthly").toISOString()).toBe(
      "2026-05-01T10:00:00.000Z",
    );
  });

  test("does not mutate the input date", () => {
    const original = new Date(base);
    computeNextRunAt(base, "daily");
    expect(base.getTime()).toBe(original.getTime());
  });
});
