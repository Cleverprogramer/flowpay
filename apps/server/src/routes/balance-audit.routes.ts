import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import { listBalanceAudit } from "@/services/balance-audit.service";
import { listBalanceAuditSchema } from "@flowpay/schema/balance-audit.schema";

export const balanceAuditRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listBalanceAuditSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listBalanceAudit(userId, params);
    return c.json(result);
  });
