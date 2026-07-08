import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  createInvoiceSchema,
  updateInvoiceStatusSchema,
  listInvoicesSchema,
} from "@flowpay/schema";
import {
  listInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  deleteInvoice,
  generateInvoiceHtml,
} from "../services/invoice.service";

export const invoiceRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listInvoicesSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listInvoices(userId, params);
    return c.json(result);
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getInvoiceById(userId, id);
    if (!data) return c.json({ error: "Invoice not found" }, 404);
    return c.json({ data });
  })
  .get("/:id/html", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const html = await generateInvoiceHtml(userId, id);
    if (!html) return c.json({ error: "Invoice not found" }, 404);
    return c.json({ html });
  })
  .post("/", zValidator("json", createInvoiceSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createInvoice(userId, body);
    return c.json({ data }, 201);
  })
  .patch(
    "/:id/status",
    zValidator("json", updateInvoiceStatusSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const { status } = c.req.valid("json");
      const data = await updateInvoiceStatus(userId, id, status);
      if (!data) return c.json({ error: "Invoice not found" }, 404);
      return c.json({ data });
    },
  )
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteInvoice(userId, id);
    if (!data) return c.json({ error: "Invoice not found" }, 404);
    return c.json({ success: true });
  });

