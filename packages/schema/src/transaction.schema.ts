import { z } from "zod";

export const createTransactionSchema = z.object({
  walletId: z.string().min(1),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  note: z.string().optional(),
  transactionDate: z.iso.datetime(),
  receiptUrl: z.url().optional(),
  isRecurring: z.boolean().optional(),
  recurringInterval: z
    .enum(["daily", "weekly", "monthly", "yearly"])
    .optional(),
});

export const updateTransactionSchema = z.object({
  categoryId: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  note: z.string().optional(),
  transactionDate: z.iso.datetime().optional(),
});

export const listTransactionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  type: z.enum(["income", "expense"]).optional(),
  walletId: z.string().optional(),
  categoryId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const transactionSummarySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  walletId: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsSchema>;
export type TransactionSummaryQuery = z.infer<typeof transactionSummarySchema>;
