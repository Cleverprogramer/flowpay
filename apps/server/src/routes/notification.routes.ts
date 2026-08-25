import { authMiddleware } from "@/middleware/auth";
import {
  createNotification,
  listNotifications,
  markAllNotificationsRead,
  getUnreadCount,
  deleteAllNotifications,
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
  .get("/unread-count", async (c) => {
    const userId = c.get("userId");
    const data = await getUnreadCount(userId);
    return c.json({ data });
  })
  .delete("/all", async (c) => {
    const userId = c.get("userId");
    const data = await deleteAllNotifications(userId);
    return c.json({ data });
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
