import { z } from "zod";

export const commitImportSchema = z.object({
  walletId: z.string().min(1),
  rows: z
    .array(
      z.object({
        date: z.iso.datetime(),
        amount: z.number().positive(),
        description: z.string().min(1).max(255),
        typeHint: z.enum(["income", "expense"]).nullable().optional(),
        note: z.string().nullable().optional(),
      }),
    )
    .min(1)
    .max(500),
});

export type CommitImportInput = z.infer<typeof commitImportSchema>;
