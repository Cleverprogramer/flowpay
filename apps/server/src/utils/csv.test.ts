import { describe, expect, test } from "bun:test";
import { toCsv } from "./csv";

describe("toCsv", () => {
  test("joins headers and rows with CRLF line endings", () => {
    const csv = toCsv(["a", "b"], [["1", "2"]]);
    expect(csv).toBe("a,b\r\n1,2\r\n");
  });

  test("escapes values containing commas", () => {
    const csv = toCsv(["desc"], [["coffee, large"]]);
    expect(csv).toBe('desc\r\n"coffee, large"\r\n');
  });

  test("escapes values containing quotes by doubling them", () => {
    const csv = toCsv(["desc"], [['he said "hi"']]);
    expect(csv).toBe('desc\r\n"he said ""hi"""\r\n');
  });

  test("escapes values containing newlines", () => {
    const csv = toCsv(["note"], [["line1\nline2"]]);
    expect(csv).toBe('note\r\n"line1\nline2"\r\n');
  });

  test("renders null as empty and numbers as-is", () => {
    const csv = toCsv(["a", "b"], [[null, 42]]);
    expect(csv).toBe("a,b\r\n,42\r\n");
  });
});
