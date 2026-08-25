import { z } from "zod";

export const createCategorizationRuleSchema = z.object({
  categoryId: z.string().min(1),
  keyword: z.string().min(1).max(100),
  matchType: z.enum(["contains", "starts_with", "exact"]).optional(),
  priority: z.number().int().min(0).max(1000).optional(),
});

export const updateCategorizationRuleSchema = z.object({
  categoryId: z.string().min(1).optional(),
  keyword: z.string().min(1).max(100).optional(),
  matchType: z.enum(["contains", "starts_with", "exact"]).optional(),
  priority: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const suggestCategorySchema = z.object({
  description: z.string().min(1).max(255),
});

export type CreateCategorizationRuleInput = z.infer<
  typeof createCategorizationRuleSchema
>;
export type UpdateCategorizationRuleInput = z.infer<
  typeof updateCategorizationRuleSchema
>;
