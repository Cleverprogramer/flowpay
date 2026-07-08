import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(["weekly", "monthly", "yearly"]),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
});

export const updateBudgetSchema = z.object({
  amount: z.number().positive().optional(),
  period: z.enum(["weekly", "monthly", "yearly"]).optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  isActive: z.boolean().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
