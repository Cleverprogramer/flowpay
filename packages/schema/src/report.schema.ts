import { z } from "zod";

export const reportRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const monthlyTrendsSchema = z.object({
  months: z.coerce.number().int().positive().max(24).default(6),
});

export type ReportRangeQuery = z.infer<typeof reportRangeSchema>;
export type MonthlyTrendsQuery = z.infer<typeof monthlyTrendsSchema>;
