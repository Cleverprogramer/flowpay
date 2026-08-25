import { describe, expect, test } from "bun:test";
import { matchCategory } from "./categorize";

const rules = [
  {
    keyword: "uber",
    matchType: "contains" as const,
    priority: 10,
    categoryId: "transport",
  },
  {
    keyword: "salary",
    matchType: "starts_with" as const,
    priority: 5,
    categoryId: "income",
  },
  {
    keyword: "coffee",
    matchType: "exact" as const,
    priority: 20,
    categoryId: "food",
  },
];

describe("matchCategory", () => {
  test("matches contains case-insensitively", () => {
    expect(matchCategory("Uber ride to airport", rules)).toBe("transport");
    expect(matchCategory("my UBER trip", rules)).toBe("transport");
  });

  test("matches starts_with only at the beginning", () => {
    expect(matchCategory("salary august", rules)).toBe("income");
    expect(matchCategory("monthly salary", rules)).not.toBe("income");
  });

  test("matches exact strings only", () => {
    expect(matchCategory("coffee", rules)).toBe("food");
    expect(matchCategory("iced coffee", rules)).not.toBe("food");
  });

  test("lower priority number wins when multiple match", () => {
    expect(
      matchCategory("salary uber coffee", [
        ...rules,
        {
          keyword: "salary",
          matchType: "contains" as const,
          priority: 1,
          categoryId: "priority-winner",
        },
      ]),
    ).toBe("priority-winner");
  });

  test("returns null with no rules or empty description", () => {
    expect(matchCategory("anything", [])).toBeNull();
    expect(matchCategory("   ", rules)).toBeNull();
  });
});
