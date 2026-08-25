import { z } from "zod";

export const createSplitSchema = z.object({
  transactionId: z.string().min(1),
  participantName: z.string().min(1).max(100),
  participantContact: z.string().max(200).optional(),
  shareAmount: z.number().positive(),
});

export const splitEvenlySchema = z.object({
  transactionId: z.string().min(1),
  participants: z
    .array(z.string().min(1).max(100))
    .min(2)
    .max(50),
});

export const settleSplitSchema = z.object({
  isSettled: z.boolean(),
});

export const listSplitsSchema = z.object({
  transactionId: z.string().optional(),
  isSettled: z.enum(["true", "false"]).optional(),
});

export type CreateSplitInput = z.infer<typeof createSplitSchema>;
export type SplitEvenlyInput = z.infer<typeof splitEvenlySchema>;
export type SettleSplitInput = z.infer<typeof settleSplitSchema>;
export type ListSplitsQuery = z.infer<typeof listSplitsSchema>;
