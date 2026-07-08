import { authMiddleware } from "@/middleware/auth";
import {
  createNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import {
  createNotificationSchema,
  listNotificationsSchema,
  updateNotificationReadSchema,
} from "@flowpay/schema/notification.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const notificationRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listNotificationsSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listNotifications(userId, params);
    return c.json(result);
  })
  .post("/", zValidator("json", createNotificationSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createNotification(userId, body);
    return c.json({ data }, 201);
  })
  .patch("/mark-all-read", async (c) => {
    const userId = c.get("userId");
    await markAllNotificationsRead(userId);
    return c.json({ success: true });
  })
  .patch(
    "/:id/read",
    zValidator("json", updateNotificationReadSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const { isRead } = c.req.valid("json");
      const data = await markNotificationRead(userId, id, isRead);
      if (!data) return c.json({ error: "Notification not found" }, 404);
      return c.json({ data });
    },
  );
