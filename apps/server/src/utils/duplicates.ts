export interface DuplicateCandidate {
  id: string;
  description: string;
  amount: number;
  transactionDate: Date | string;
}

export interface DuplicateGroup {
  key: string;
  count: number;
  totalAmount: number;
  items: Array<{ id: string; date: string }>;
}

const DEFAULT_WINDOW_MS = 48 * 60 * 60 * 1000;

function duplicateKey(description: string, amount: number): string {
  return `${description.trim().toLowerCase()}|${amount.toFixed(2)}`;
}

export function findDuplicateGroups(
  candidates: DuplicateCandidate[],
  windowMs = DEFAULT_WINDOW_MS,
): DuplicateGroup[] {
  const buckets = new Map<string, DuplicateCandidate[]>();

  for (const candidate of candidates) {
    const key = duplicateKey(candidate.description, candidate.amount);
    const list = buckets.get(key) ?? [];
    list.push(candidate);
    buckets.set(key, list);
  }

  const groups: DuplicateGroup[] = [];

  for (const [key, list] of buckets) {
    if (list.length < 2) continue;

    const sorted = [...list].sort(
      (a, b) =>
        new Date(a.transactionDate).getTime() -
        new Date(b.transactionDate).getTime(),
    );

    let cluster: DuplicateCandidate[] = [sorted[0]!];

    const flush = () => {
      if (cluster.length >= 2) {
        groups.push({
          key,
          count: cluster.length,
          totalAmount:
            Math.round(
              cluster.reduce((sum, item) => sum + item.amount, 0) * 100,
            ) / 100,
          items: cluster.map((item) => ({
            id: item.id,
            date: new Date(item.transactionDate).toISOString(),
          })),
        });
      }
    };

    for (let i = 1; i < sorted.length; i++) {
      const previous = sorted[i - 1]!;
      const current = sorted[i]!;
      const gap =
        new Date(current.transactionDate).getTime() -
        new Date(previous.transactionDate).getTime();

      if (gap <= windowMs) {
        cluster.push(current);
      } else {
        flush();
        cluster = [current];
      }
    }
    flush();
  }

  return groups.sort((a, b) => b.count - a.count);
}
