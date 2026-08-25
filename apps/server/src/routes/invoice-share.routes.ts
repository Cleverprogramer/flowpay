import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
  generateShareToken,
  revokeShareToken,
  getPublicInvoiceHtml,
} from "@/services/invoice-share.service";

export const invoiceShareRoutes = new Hono()
  .post(
    "/:id/share",
    authMiddleware,
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const result = await generateShareToken(userId, id);
      if (!result) return c.json({ error: "Invoice not found" }, 404);
      return c.json({ data: result }, 201);
    },
  )
  .delete(
    "/:id/share",
    authMiddleware,
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const result = await revokeShareToken(userId, id);
      if (!result) return c.json({ error: "Invoice not found" }, 404);
      return c.json({ success: true });
    },
  );

export const publicInvoiceRoutes = new Hono()
  .get("/robots.txt", (c) =>
    c.body("User-agent: *\nDisallow: /\n", 200, {
      "Content-Type": "text/plain",
    }),
  )
  .get("/invoice/:token", async (c) => {
    const token = c.req.param("token");
    const html = await getPublicInvoiceHtml(token);
    if (!html) return c.html("<h1>404 - Invoice not found</h1>", 404);

    return c.html(html.replace("</body>", `<div style="text-align:center;padding:16px;font-size:11px;color:#9CA3AF;">Powered by FlowPay</div></body>`));
  });
