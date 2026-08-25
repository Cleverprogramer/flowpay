import { z } from "zod";

export const createGoalSchema = z.object({
  walletId: z.string().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  emoji: z.string().max(10).optional(),
  color: z.string().max(20).optional(),
  targetAmount: z.number().positive(),
  targetDate: z.iso.datetime().optional(),
});

export const updateGoalSchema = z.object({
  walletId: z.string().nullable().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  emoji: z.string().max(10).optional(),
  color: z.string().max(20).optional(),
  targetAmount: z.number().positive().optional(),
  savedAmount: z.number().min(0).optional(),
  targetDate: z.iso.datetime().nullable().optional(),
});

export const contributeGoalSchema = z.object({
  amount: z.number().positive(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ContributeGoalInput = z.infer<typeof contributeGoalSchema>;
