import { db } from "@flowpay/db";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { and, eq, gte, lte, sql, desc } from "drizzle-orm";

export async function getSpendingByCategory(
  userId: string,
  params?: { startDate?: string; endDate?: string },
) {
  const conditions = [
    eq(transaction.userId, userId),
    eq(transaction.type, "expense"),
  ];
  if (params?.startDate)
    conditions.push(gte(transaction.transactionDate, new Date(params.startDate)));
  if (params?.endDate)
    conditions.push(lte(transaction.transactionDate, new Date(params.endDate)));

  const rows = await db
    .select({
      categoryId: transaction.categoryId,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      categoryColor: category.color,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(transaction)
    .leftJoin(category, eq(transaction.categoryId, category.id))
    .where(and(...conditions))
    .groupBy(
      transaction.categoryId,
      category.name,
      category.emoji,
      category.color,
    )
    .orderBy(desc(sql`SUM(${transaction.amount})`));

  const grandTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

  return rows.map((row) => ({
    ...row,
    total: Number(row.total),
    percentage:
      grandTotal > 0
        ? Math.round((Number(row.total) / grandTotal) * 100)
        : 0,
  }));
}

export async function getMonthlyTrends(userId: string, months: number) {
  const rows = await db
    .select({
      month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${transaction.transactionDate}), 'YYYY-MM')`,
      type: transaction.type,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(transaction)
    .where(eq(transaction.userId, userId))
    .groupBy(
      sql`DATE_TRUNC('month', ${transaction.transactionDate})`,
      transaction.type,
    )
    .orderBy(sql`DATE_TRUNC('month', ${transaction.transactionDate}) DESC`)
    .limit(months * 2);

  const byMonth = new Map<
    string,
    {
      month: string;
      income: number;
      expense: number;
      net: number;
      transactionCount: number;
    }
  >();

  for (const row of rows) {
    const entry = byMonth.get(row.month) ?? {
      month: row.month,
      income: 0,
      expense: 0,
      net: 0,
      transactionCount: 0,
    };
    if (row.type === "income") entry.income = Number(row.total);
    else entry.expense = Number(row.total);
    entry.transactionCount += row.count;
    entry.net = entry.income - entry.expense;
    byMonth.set(row.month, entry);
  }

  return Array.from(byMonth.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-months);
}

export async function getWalletBreakdown(userId: string) {
  const rows = await db
    .select({
      walletId: wallet.id,
      walletName: wallet.name,
      walletType: wallet.type,
      currency: wallet.currency,
      balance: wallet.balance,
      transactionCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${transaction}
        WHERE ${transaction.walletId} = ${wallet.id}
      )`,
    })
    .from(wallet)
    .where(eq(wallet.userId, userId))
    .orderBy(desc(wallet.balance));

  return rows.map((row) => ({ ...row, balance: Number(row.balance) }));
}

export async function getDailyActivity(userId: string, month: string) {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) throw new Error("month must be YYYY-MM");

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0, 23, 59, 59));

  const rows = await db
    .select({
      day: sql<string>`EXTRACT(DAY FROM ${transaction.transactionDate})::int`,
      income: sql<string>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} ELSE 0 END), 0)`,
      expense: sql<string>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN ${transaction.amount} ELSE 0 END), 0)`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.transactionDate, start),
        lte(transaction.transactionDate, end),
      ),
    )
    .groupBy(sql`EXTRACT(DAY FROM ${transaction.transactionDate})`)
    .orderBy(sql`EXTRACT(DAY FROM ${transaction.transactionDate})`);

  return rows.map((row) => ({
    day: row.day,
    income: Number(row.income),
    expense: Number(row.expense),
    net: Number(row.income) - Number(row.expense),
  }));
}

export async function getTopDescriptions(userId: string, limit = 10) {
  const rows = await db
    .select({
      description: sql<string>`LOWER(TRIM(${transaction.description}))`,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.type, "expense"),
      ),
    )
    .groupBy(sql`LOWER(TRIM(${transaction.description}))`)
    .orderBy(desc(sql`SUM(${transaction.amount})`))
    .limit(limit);

  return rows.map((row) => ({
    description: row.description,
    total: Number(row.total),
    count: row.count,
  }));
}

export async function getWeekdaySpending(userId: string) {
  const rows = await db
    .select({
      weekday: sql<string>`EXTRACT(DOW FROM ${transaction.transactionDate})::int`,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(transaction)
    .where(
      and(eq(transaction.userId, userId), eq(transaction.type, "expense")),
    )
    .groupBy(sql`EXTRACT(DOW FROM ${transaction.transactionDate})`);

  const names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return Array.from({ length: 7 }, (_, index) => {
    const row = rows.find((item) => Number(item.weekday) === index);
    return {
      weekday: names[index]!,
      total: row ? Number(row.total) : 0,
      count: row?.count ?? 0,
    };
  });
}

export async function getYearInReview(userId: string, year: number) {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  const rows = await db
    .select({
      month: sql<string>`EXTRACT(MONTH FROM ${transaction.transactionDate})::int`,
      type: transaction.type,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.transactionDate, start),
        lte(transaction.transactionDate, end),
      ),
    )
    .groupBy(
      sql`EXTRACT(MONTH FROM ${transaction.transactionDate})`,
      transaction.type,
    );

  return Array.from({ length: 12 }, (_, index) => {
    const monthRows = rows.filter((row) => Number(row.month) === index + 1);
    const income = monthRows.find((row) => row.type === "income");
    const expense = monthRows.find((row) => row.type === "expense");
    return {
      month: index + 1,
      income: income ? Number(income.total) : 0,
      expense: expense ? Number(expense.total) : 0,
    };
  });
}
