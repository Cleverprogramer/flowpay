import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  registerDevice,
  unregisterDevice,
  listDevices,
} from "@/services/device.service";
import { registerDeviceSchema } from "@flowpay/schema/device.schema";

export const deviceRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listDevices(userId);
    return c.json({ data });
  })
  .post("/", zValidator("json", registerDeviceSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await registerDevice(userId, body);
    return c.json({ data }, 201);
  })
  .delete("/:token", async (c) => {
    const userId = c.get("userId");
    const token = decodeURIComponent(c.req.param("token"));
    const data = await unregisterDevice(userId, token);
    if (!data) return c.json({ error: "Device not found" }, 404);
    return c.json({ success: true });
  });
