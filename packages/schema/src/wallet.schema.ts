import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["bank", "credit", "cash", "mobile"]),
  icon: z.string().optional(),
  currency: z.string().min(1).max(10).optional(),
  isDefault: z.boolean().optional(),
});

export const updateWalletSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: z.enum(["bank", "credit", "cash", "mobile"]).optional(),
  icon: z.string().optional(),
  currency: z.string().min(1).max(10).optional(),
  isDefault: z.boolean().optional(),
});

export const walletSchema = z.object({
  id: z.string(),
  userId: z.string().nullable().optional(),
  name: z.string().min(1).max(100),
  type: z.enum(["bank", "credit", "cash", "mobile"]),
  icon: z.string().nullable().optional(),
  currency: z.string().min(1).max(10),
  balance: z.number().optional(),
  isDefault: z.boolean(),
  isSystem: z.boolean(),
  createdAt: z.string().or(z.date()),
});

export type Wallet = z.infer<typeof walletSchema>;
export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
