import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
  getSubscriptionSummary,
  getNoSpendInsight,
} from "@/services/insight.service";

export const insightRoutes = new Hono()
  .use(authMiddleware)
  .get("/subscriptions", async (c) => {
    const userId = c.get("userId");
    const data = await getSubscriptionSummary(userId);
    return c.json({ data });
  })
  .get("/no-spend", async (c) => {
    const userId = c.get("userId");
    const data = await getNoSpendInsight(userId);
    return c.json({ data });
  });
