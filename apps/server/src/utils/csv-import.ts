export interface ParsedCsvRow {
  date: string;
  amount: number;
  description: string;
  typeHint: "income" | "expense" | null;
  note: string | null;
}

export interface CsvParseIssue {
  line: number;
  reason: string;
}

function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

export function parseTransactionsCsv(content: string, maxRows = 500): {
  rows: ParsedCsvRow[];
  issues: CsvParseIssue[];
} {
  const lines = content
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (!lines.length) return { rows: [], issues: [{ line: 1, reason: "File is empty" }] };

  const headers = splitCsvLine(lines[0]!).map((h) =>
    h.trim().toLowerCase(),
  );
  const dateIndex = headers.indexOf("date");
  const amountIndex = headers.indexOf("amount");
  const descIndex = Math.max(
    headers.indexOf("description"),
    headers.indexOf("name"),
  );
  const typeIndex = headers.indexOf("type");
  const noteIndex = headers.indexOf("note");

  if (dateIndex < 0 || amountIndex < 0 || descIndex < 0) {
    return {
      rows: [],
      issues: [
        { line: 1, reason: "Missing required columns: date, amount, description" },
      ],
    };
  }

  const rows: ParsedCsvRow[] = [];
  const issues: CsvParseIssue[] = [];

  for (let i = 1; i < lines.length && rows.length < maxRows; i++) {
    const fields = splitCsvLine(lines[i]!);
    const date = fields[dateIndex]?.trim() ?? "";
    const rawAmount = fields[amountIndex]?.trim().replace(/[$,]/g, "") ?? "";
    const description = fields[descIndex]?.trim() ?? "";
    const rawType = typeIndex >= 0 ? fields[typeIndex]?.trim().toLowerCase() : "";
    const note = noteIndex >= 0 ? fields[noteIndex]?.trim() || null : null;

    const parsedDate = new Date(date);
    if (!date || Number.isNaN(parsedDate.getTime())) {
      issues.push({ line: i + 1, reason: `Invalid date "${date}"` });
      continue;
    }

    const numericAmount = Number(rawAmount);
    if (!rawAmount || Number.isNaN(numericAmount)) {
      issues.push({ line: i + 1, reason: `Invalid amount "${rawAmount}"` });
      continue;
    }

    if (!description) {
      issues.push({ line: i + 1, reason: "Missing description" });
      continue;
    }

    let typeHint: "income" | "expense" | null = null;
    if (numericAmount > 0 && rawType === "income") typeHint = "income";
    else if (rawType === "expense") typeHint = "expense";
    else if (rawType === "income") typeHint = "income";
    else if (numericAmount < 0 || date.startsWith("-")) typeHint = "expense";

    rows.push({
      date: parsedDate.toISOString(),
      amount: Math.abs(Math.round(numericAmount * 100) / 100),
      description,
      typeHint,
      note,
    });
  }

  return { rows, issues };
}
