import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
  getSubscriptionSummary,
  getNoSpendInsight,
  getSavingsRate,
  getMonthOverMonthDelta,
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
  })
  .get("/savings-rate", async (c) => {
    const userId = c.get("userId");
    const data = await getSavingsRate(userId, {
      startDate: c.req.query("startDate"),
      endDate: c.req.query("endDate"),
    });
    return c.json({ data });
  })
  .get("/month-over-month", async (c) => {
    const userId = c.get("userId");
    const data = await getMonthOverMonthDelta(userId);
    return c.json({ data });
  });
