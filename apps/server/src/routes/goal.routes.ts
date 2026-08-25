import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listGoals,
  getGoalById,
  createGoal,
  updateGoal,
  contributeToGoal,
  deleteGoal,
} from "@/services/goal.service";
import {
  createGoalSchema,
  updateGoalSchema,
  contributeGoalSchema,
} from "@flowpay/schema/goal.schema";

export const goalRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listGoals(userId);
    return c.json({ data });
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getGoalById(userId, id);
    if (!data) return c.json({ error: "Goal not found" }, 404);
    return c.json({ data });
  })
  .post("/", zValidator("json", createGoalSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createGoal(userId, body);
    return c.json({ data }, 201);
  })
  .patch(
    "/:id/contribute",
    zValidator("json", contributeGoalSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const data = await contributeToGoal(userId, id, body.amount);
      if (!data) return c.json({ error: "Goal not found" }, 404);
      return c.json({ data });
    },
  )
  .put("/:id", zValidator("json", updateGoalSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateGoal(userId, id, body);
    if (!data) return c.json({ error: "Goal not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteGoal(userId, id);
    if (!data) return c.json({ error: "Goal not found" }, 404);
    return c.json({ success: true });
  });
