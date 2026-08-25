import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  getOrCreatePreferences,
  updatePreferences,
} from "@/services/notification-preference.service";
import { updateNotificationPreferenceSchema } from "@flowpay/schema/notification-preference.schema";

export const notificationPreferenceRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await getOrCreatePreferences(userId);
    return c.json({ data });
  })
  .put(
    "/",
    zValidator("json", updateNotificationPreferenceSchema),
    async (c) => {
      const userId = c.get("userId");
      const body = c.req.valid("json");
      const data = await updatePreferences(userId, body);
      return c.json({ data });
    },
  );
