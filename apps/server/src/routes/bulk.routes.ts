import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  bulkDeleteTransactions,
  bulkCategorizeTransactions,
  bulkAttachTag,
} from "@/services/bulk.service";
import {
  bulkDeleteSchema,
  bulkCategorizeSchema,
  bulkTagSchema,
} from "@flowpay/schema/bulk.schema";

export const bulkRoutes = new Hono()
  .use(authMiddleware)
  .post("/delete", zValidator("json", bulkDeleteSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await bulkDeleteTransactions(userId, body.transactionIds);
    return c.json({ data });
  })
  .post("/categorize", zValidator("json", bulkCategorizeSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await bulkCategorizeTransactions(
      userId,
      body.transactionIds,
      body.categoryId,
    );
    return c.json({ data });
  })
  .post("/tag", zValidator("json", bulkTagSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await bulkAttachTag(userId, body.transactionIds, body.tagId);
    return c.json({ data });
  });
