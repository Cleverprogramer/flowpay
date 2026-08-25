import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";
import { exportUserData } from "@/services/export.service";

export const exportRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const payload = await exportUserData(userId);
    const body = JSON.stringify(payload, null, 2);

    return c.body(body, 200, {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="flowpay-export.json"',
    });
  });
