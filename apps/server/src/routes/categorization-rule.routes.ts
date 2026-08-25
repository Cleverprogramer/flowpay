import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listCategorizationRules,
  suggestCategory,
  createCategorizationRule,
  updateCategorizationRule,
  deleteCategorizationRule,
} from "@/services/categorization-rule.service";
import {
  createCategorizationRuleSchema,
  updateCategorizationRuleSchema,
  suggestCategorySchema,
} from "@flowpay/schema/categorization-rule.schema";

export const categorizationRuleRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listCategorizationRules(userId);
    return c.json({ data });
  })
  .post("/suggest", zValidator("json", suggestCategorySchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await suggestCategory(userId, body.description);
    if (!data) return c.json({ data: null });
    return c.json({ data });
  })
  .post(
    "/",
    zValidator("json", createCategorizationRuleSchema),
    async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");
      const data = await createCategorizationRule(userId, body);
      return c.json({ data }, 201);
    },
  )
  .put(
    "/:id",
    zValidator("json", updateCategorizationRuleSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const data = await updateCategorizationRule(userId, id, body);
      if (!data) return c.json({ error: "Rule not found" }, 404);
      return c.json({ data });
    },
  )
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteCategorizationRule(userId, id);
    if (!data) return c.json({ error: "Rule not found" }, 404);
    return c.json({ success: true });
  });
