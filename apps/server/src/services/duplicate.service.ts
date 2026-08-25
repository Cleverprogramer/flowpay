import { db } from "@flowpay/db";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, desc, eq, gte } from "drizzle-orm";
import {
  findDuplicateGroups,
  type DuplicateGroup,
} from "@/utils/duplicates";

const SCAN_WINDOW_DAYS = 90;
const MAX_SCAN_ROWS = 2000;

export async function listPotentialDuplicates(userId: string): Promise<DuplicateGroup[]> {
  const since = new Date(Date.now() - SCAN_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const rows = await db
    .select({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transactionDate,
    })
    .from(transaction)
    .where(
      and(eq(transaction.userId, userId), gte(transaction.transactionDate, since)),
    )
    .orderBy(desc(transaction.transactionDate))
    .limit(MAX_SCAN_ROWS);

  return findDuplicateGroups(
    rows.map((row) => ({ ...row, amount: Number(row.amount) })),
  );
}
