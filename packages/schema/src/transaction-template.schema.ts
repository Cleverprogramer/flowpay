import { z } from "zod";

export const createTemplateSchema = z.object({
  walletId: z.string().min(1),
  categoryId: z.string().optional(),
  name: z.string().min(1).max(100),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  note: z.string().optional(),
});

export const updateTemplateSchema = z.object({
  walletId: z.string().min(1).optional(),
  categoryId: z.string().nullable().optional(),
  name: z.string().min(1).max(100).optional(),
  type: z.enum(["income", "expense"]).optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  note: z.string().nullable().optional(),
});

export const applyTemplateSchema = z.object({
  transactionDate: z.iso.datetime().optional(),
  amountOverride: z.number().positive().optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type ApplyTemplateInput = z.infer<typeof applyTemplateSchema>;
