import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listInvoicePayments,
  createInvoicePayment,
} from "@/services/invoice-payment.service";
import {
  createInvoicePaymentSchema,
} from "@flowpay/schema/invoice-payment.schema";

const invoiceIdParamSchema = z.object({ invoiceId: z.string() });

export const invoicePaymentRoutes = new Hono()
  .use(authMiddleware)
  .get(
    "/invoice/:invoiceId",
    zValidator("param", invoiceIdParamSchema),
    async (c) => {
      const userId = c.get("userId");
      const { invoiceId } = c.req.valid("param");
      const result = await listInvoicePayments(userId, invoiceId);
      if (!result) return c.json({ error: "Invoice not found" }, 404);
      return c.json(result);
    },
  )
  .post(
    "/invoice/:invoiceId",
    zValidator("param", invoiceIdParamSchema),
    zValidator("json", createInvoicePaymentSchema),
    async (c) => {
      const userId = c.get("userId");
      const { invoiceId } = c.req.valid("param");
      const body = c.req.valid("json");
      const data = await createInvoicePayment(userId, invoiceId, body);
      if (!data) return c.json({ error: "Invoice not found" }, 404);
      return c.json({ data }, 201);
    },
  );
