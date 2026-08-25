import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import {
  getNetWorth,
  getCashFlowProjection,
} from "@/services/forecast.service";

export const forecastRoutes = new Hono()
  .use(authMiddleware)
  .get("/net-worth", async (c) => {
    const userId = c.get("userId");
    const data = await getNetWorth(userId);
    return c.json({ data });
  })
  .get("/cash-flow", async (c) => {
    const userId = c.get("userId");
    const data = await getCashFlowProjection(userId);
    return c.json({ data });
  });
