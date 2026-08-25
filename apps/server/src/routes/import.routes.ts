import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { commitImportedTransactions } from "@/services/import.service";
import { commitImportSchema } from "@flowpay/schema/import.schema";
import { parseTransactionsCsv } from "@/utils/csv-import";

export const importRoutes = new Hono()
  .use(authMiddleware)
  .post("/preview", async (c) => {
    const contentType = c.req.header("Content-Type") ?? "";
    if (!contentType.includes("text/csv") && !contentType.includes("text/plain")) {
      return c.json({ error: "Send CSV body with Content-Type text/csv" }, 400);
    }

    const content = await c.req.text();
    const parsed = parseTransactionsCsv(content);

    return c.json({
      data: {
        rows: parsed.rows,
        issues: parsed.issues,
      },
    });
  })
  .post("/commit", zValidator("json", commitImportSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const result = await commitImportedTransactions(userId, body);
    if (!result) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ data: result }, 201);
  });
