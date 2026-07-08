import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  emoji: z.string().optional(),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  emoji: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const listCategorySchema = z.object({
    type: z.enum(["income", "expense"]).optional(),
})

export const categorySchema = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  name: z.string().min(1).max(50),
  emoji: z.string().nullable().optional(),
  type: z.enum(["income", "expense"]),
  color: z.string().nullable().optional(),
  sortOrder: z.number().int(),
  isSystem: z.boolean(),
  createdAt: z.string().or(z.date()),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ListCategoryQuery = z.infer<typeof listCategorySchema>;
