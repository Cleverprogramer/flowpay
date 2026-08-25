import { z } from "zod";

export const createTransferSchema = z.object({
  sourceWalletId: z.string().min(1),
  destinationWalletId: z.string().min(1),
  amount: z.number().positive(),
  fee: z.number().min(0).optional(),
  note: z.string().max(500).optional(),
  transferDate: z.iso.datetime().optional(),
});

export const listTransfersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  walletId: z.string().optional(),
});

export type CreateTransferInput = z.infer<typeof createTransferSchema>;
export type ListTransfersQuery = z.infer<typeof listTransfersSchema>;
