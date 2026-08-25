import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  getSpendingByCategory,
  getMonthlyTrends,
  getWalletBreakdown,
  getDailyActivity,
  getTopDescriptions,
} from "@/services/report.service";
import {
  reportRangeSchema,
  monthlyTrendsSchema,
  dailyActivitySchema,
} from "@flowpay/schema/report.schema";

export const reportRoutes = new Hono()
  .use(authMiddleware)
  .get(
    "/spending-by-category",
    zValidator("query", reportRangeSchema),
    async (c) => {
      const userId = c.get("userId");
      const query = c.req.valid("query");
      const data = await getSpendingByCategory(userId, query);
      return c.json({ data });
    },
  )
  .get(
    "/monthly-trends",
    zValidator("query", monthlyTrendsSchema),
    async (c) => {
      const userId = c.get("userId");
      const { months } = c.req.valid("query");
      const data = await getMonthlyTrends(userId, months);
      return c.json({ data });
    },
  )
  .get("/wallet-breakdown", async (c) => {
    const userId = c.get("userId");
    const data = await getWalletBreakdown(userId);
    return c.json({ data });
  })
  .get(
    "/daily-activity",
    zValidator("query", dailyActivitySchema),
    async (c) => {
      const userId = c.get("userId");
      const { month } = c.req.valid("query");
      try {
        const data = await getDailyActivity(userId, month);
        return c.json({ data });
      } catch {
        return c.json({ error: "Invalid month format" }, 400);
      }
    },
  )
  .get("/top-descriptions", async (c) => {
    const userId = c.get("userId");
    const data = await getTopDescriptions(userId);
    return c.json({ data });
  });
