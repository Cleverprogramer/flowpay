import { z } from "zod";

export const createNotificationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(["success", "alert", "info"]).optional(),
});

export const listNotificationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const updateNotificationReadSchema = z.object({
  isRead: z.boolean(),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationReadInput = z.infer<
  typeof updateNotificationReadSchema
>;
