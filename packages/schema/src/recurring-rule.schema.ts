import { z } from "zod";

export const createRecurringRuleSchema = z.object({
  walletId: z.string().min(1),
  categoryId: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  description: z.string().min(1).max(255),
  note: z.string().optional(),
  interval: z.enum(["daily", "weekly", "monthly", "yearly"]),
  startDate: z.iso.datetime().optional(),
});

export const updateRecurringRuleSchema = z.object({
  categoryId: z.string().nullable().optional(),
  amount: z.number().positive().optional(),
  description: z.string().min(1).max(255).optional(),
  note: z.string().nullable().optional(),
  interval: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  isActive: z.boolean().optional(),
});

export type CreateRecurringRuleInput = z.infer<
  typeof createRecurringRuleSchema
>;
export type UpdateRecurringRuleInput = z.infer<
  typeof updateRecurringRuleSchema
>;
