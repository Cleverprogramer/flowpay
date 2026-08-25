import { describe, expect, test } from "bun:test";
import { splitEvenly } from "./split";

describe("splitEvenly", () => {
  test("divides evenly when amount divides cleanly", () => {
    expect(splitEvenly(1000, 4)).toEqual([250, 250, 250, 250]);
  });

  test("distributes remainder cents to first participants", () => {
    expect(splitEvenly(100, 3)).toEqual([34, 33, 33]);
    expect(splitEvenly(101, 3)).toEqual([34, 34, 33]);
  });

  test("handles single participant", () => {
    expect(splitEvenly(9999, 1)).toEqual([9999]);
  });

  test("returns empty array for zero participants", () => {
    expect(splitEvenly(500, 0)).toEqual([]);
  });

  test("shares always sum back to the original amount", () => {
    const shares = splitEvenly(12345, 7);
    expect(shares.reduce((sum, value) => sum + value, 0)).toBe(12345);
  });
});
