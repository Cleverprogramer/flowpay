import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listRecurringRules,
  getRecurringRuleById,
  createRecurringRule,
  updateRecurringRule,
  deleteRecurringRule,
  processDueRecurringRules,
} from "@/services/recurring-rule.service";
import {
  createRecurringRuleSchema,
  updateRecurringRuleSchema,
} from "@flowpay/schema/recurring-rule.schema";

export const recurringRuleRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listRecurringRules(userId);
    return c.json({ data });
  })
  .post("/process-due", async (c) => {
    const userId = c.get("userId");
    const data = await processDueRecurringRules(userId);
    return c.json({ data });
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getRecurringRuleById(userId, id);
    if (!data) return c.json({ error: "Recurring rule not found" }, 404);
    return c.json({ data });
  })
  .post("/", zValidator("json", createRecurringRuleSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createRecurringRule(userId, body);
    return c.json({ data }, 201);
  })
  .put(
    "/:id",
    zValidator("json", updateRecurringRuleSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const data = await updateRecurringRule(userId, id, body);
      if (!data) return c.json({ error: "Recurring rule not found" }, 404);
      return c.json({ data });
    },
  )
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteRecurringRule(userId, id);
    if (!data) return c.json({ error: "Recurring rule not found" }, 404);
    return c.json({ success: true });
  });
