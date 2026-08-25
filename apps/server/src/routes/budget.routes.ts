import { authMiddleware } from "@/middleware/auth";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  listBudgets,
  updateBudget,
  getBudgetsSummary,
} from "@/services/budget.service";
import { checkBudgetAlerts } from "@/services/budget-alert.service";
import {
  createBudgetSchema,
  updateBudgetSchema,
  listBudgetsQuerySchema,
} from "@flowpay/schema/budget.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const budgetRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listBudgetsQuerySchema), async (c) => {
    const userId = c.get("userId");
    const { isActive } = c.req.valid("query");
    const data = await listBudgets(userId, { isActive });
    return c.json({ data });
  })
  .get("/summary", async (c) => {
    const userId = c.get("userId");
    const data = await getBudgetsSummary(userId);
    return c.json({ data });
  })
  .post("/check-alerts", async (c) => {
    const userId = c.get("userId");
    const data = await checkBudgetAlerts(userId);
    return c.json({ data });
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getBudgetById(userId, id);
    if (!data) return c.json({ error: "Budget not found" }, 404);
    return c.json({ data });
  })
  .post("/", zValidator("json", createBudgetSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createBudget(userId, body);
    return c.json({ data }, 201);
  })
  .put("/:id", zValidator("json", updateBudgetSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateBudget(userId, id, body);
    if (!data) return c.json({ error: "Budget not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteBudget(userId, id);
    if (!data) return c.json({ error: "Budget not found" }, 404);
    return c.json({ success: true });
  });
