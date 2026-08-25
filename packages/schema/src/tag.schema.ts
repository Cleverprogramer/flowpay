import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().max(20).optional(),
});

export const attachTagsSchema = z.object({
  transactionId: z.string().min(1),
  tagIds: z.array(z.string()).min(1).max(20),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type AttachTagsInput = z.infer<typeof attachTagsSchema>;
