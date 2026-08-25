import { describe, expect, test } from "bun:test";
import {
  computeBudgetAlertLevel,
  shouldRaiseBudgetAlert,
} from "./budget-alerts";

describe("computeBudgetAlertLevel", () => {
  test("returns none below 80 percent", () => {
    expect(computeBudgetAlertLevel(50, 100)).toBe("none");
    expect(computeBudgetAlertLevel(79.9, 100)).toBe("none");
  });

  test("returns warning at or above 80 percent", () => {
    expect(computeBudgetAlertLevel(80, 100)).toBe("warning");
    expect(computeBudgetAlertLevel(99, 100)).toBe("warning");
  });

  test("returns exceeded at 100 percent and beyond", () => {
    expect(computeBudgetAlertLevel(100, 100)).toBe("exceeded");
    expect(computeBudgetAlertLevel(150, 100)).toBe("exceeded");
  });

  test("returns none for a zero budget", () => {
    expect(computeBudgetAlertLevel(10, 0)).toBe("none");
  });
});

describe("shouldRaiseBudgetAlert", () => {
  test("raises when crossing into warning from none", () => {
    expect(shouldRaiseBudgetAlert("warning", "none")).toBe(true);
  });

  test("raises when escalating from warning to exceeded", () => {
    expect(shouldRaiseBudgetAlert("exceeded", "warning")).toBe(true);
    expect(shouldRaiseBudgetAlert("exceeded", "none")).toBe(true);
  });

  test("does not re-raise the same level", () => {
    expect(shouldRaiseBudgetAlert("warning", "warning")).toBe(false);
    expect(shouldRaiseBudgetAlert("exceeded", "exceeded")).toBe(false);
  });

  test("never alerts for the none level", () => {
    expect(shouldRaiseBudgetAlert("none", "none")).toBe(false);
    expect(shouldRaiseBudgetAlert("none", "warning")).toBe(false);
  });
});
