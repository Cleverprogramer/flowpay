import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1).max(50),
  clientName: z.string().min(1).max(200),
  clientEmail: z.email().optional(),
  currency: z.string().min(1).max(10).optional(),
  issueDate: z.iso.datetime(),
  dueDate: z.iso.datetime(),
  note: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive(),
      }),
    )
    .min(1),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
});

export const listInvoicesSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<
  typeof updateInvoiceStatusSchema
>;
export type ListInvoicesQuery = z.infer<typeof listInvoicesSchema>;
