import { z } from "zod";

export const registerDeviceSchema = z.object({
  expoPushToken: z.string().min(1).max(255),
  deviceName: z.string().max(100).optional(),
  platform: z.enum(["ios", "android", "web"]).optional(),
});

export type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;
