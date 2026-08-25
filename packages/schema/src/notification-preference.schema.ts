import { z } from "zod";

export const updateNotificationPreferenceSchema = z.object({
  budgetAlerts: z.boolean().optional(),
  transactionUpdates: z.boolean().optional(),
  invoiceReminders: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
});

export type UpdateNotificationPreferenceInput = z.infer<
  typeof updateNotificationPreferenceSchema
>;
