import { describe, expect, test } from "bun:test";
import { convertAmount, invertRate } from "./currency";

describe("convertAmount", () => {
  test("multiplies by the rate and rounds to cents", () => {
    expect(convertAmount(100, 0.912345)).toBe(91.23);
    expect(convertAmount(10.1, 3)).toBe(30.3);
  });

  test("handles zero amount and zero rate", () => {
    expect(convertAmount(0, 1.5)).toBe(0);
    expect(convertAmount(50, 0)).toBe(0);
  });
});

describe("invertRate", () => {
  test("inverts a rate with eight decimal precision", () => {
    expect(invertRate(2)).toBe(0.5);
    expect(invertRate(0.25)).toBe(4);
  });

  test("round-trips close to the original value", () => {
    const original = 1.0875;
    expect(invertRate(invertRate(original))).toBeCloseTo(original, 6);
  });

  test("guards against division by zero", () => {
    expect(invertRate(0)).toBe(0);
  });
});
