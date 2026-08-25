import { describe, expect, test } from "bun:test";
import { parseTransactionsCsv } from "./csv-import";

describe("parseTransactionsCsv", () => {
  const header = "date,amount,description,type,note";

  test("parses well-formed rows with quoted fields", () => {
    const csv = [
      header,
      '2026-08-01,"1,250.50",Grocery run,expense,weekly shop',
      "2026-08-02,500.00,Client payment,income,",
    ].join("\n");

    const result = parseTransactionsCsv(csv);

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]!.amount).toBe(1250.5);
    expect(result.rows[0]!.typeHint).toBe("expense");
    expect(result.rows[1]!.typeHint).toBe("income");
    expect(result.issues).toHaveLength(0);
  });

  test("reports issues with line numbers for bad rows", () => {
    const csv = [
      header,
      "not-a-date,10.00,Bad row,expense,",
      "2026-08-03,,Missing amount,expense,",
      "2026-08-04,9.99,Good row,expense,",
    ].join("\n");

    const result = parseTransactionsCsv(csv);

    expect(result.rows).toHaveLength(1);
    expect(result.issues.map((issue) => issue.line)).toEqual([2, 3]);
  });

  test("rejects files without required columns", () => {
    const result = parseTransactionsCsv("foo,bar\n1,2");
    expect(result.rows).toHaveLength(0);
    expect(result.issues[0]!.reason).toContain("date");
  });

  test("handles empty input and respects maxRows", () => {
    expect(parseTransactionsCsv("").rows).toHaveLength(0);

    const many = Array.from(
      { length: 20 },
      (_, i) => `2026-08-01,1.00,T${i},expense,`,
    );
    const result = parseTransactionsCsv([header, ...many].join("\n"), 5);
    expect(result.rows).toHaveLength(5);
  });
});
