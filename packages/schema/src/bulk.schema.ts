import { z } from "zod";

export const bulkDeleteSchema = z.object({
  transactionIds: z.array(z.string()).min(1).max(100),
});

export const bulkCategorizeSchema = z.object({
  transactionIds: z.array(z.string()).min(1).max(100),
  categoryId: z.string().min(1),
});

export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type BulkCategorizeInput = z.infer<typeof bulkCategorizeSchema>;
