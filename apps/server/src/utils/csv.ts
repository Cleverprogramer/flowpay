function escapeCsvValue(value: string | number | null): string {
  const stringValue = value === null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function toCsv(
  headers: string[],
  rows: Array<Array<string | number | null>>,
): string {
  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ];
  return `${lines.join("\r\n")}\r\n`;
}
