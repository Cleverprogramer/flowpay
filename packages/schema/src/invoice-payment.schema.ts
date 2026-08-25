import { z } from "zod";

export const createInvoicePaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(["cash", "bank_transfer", "card", "other"]).optional(),
  paidAt: z.iso.datetime().optional(),
  note: z.string().max(500).optional(),
});

export type CreateInvoicePaymentInput = z.infer<
  typeof createInvoicePaymentSchema
>;
