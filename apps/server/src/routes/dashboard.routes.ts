import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { getDashboard } from "@/services/dashboard.service";

export const dashboardRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await getDashboard(userId);
    return c.json({ data });
  });
