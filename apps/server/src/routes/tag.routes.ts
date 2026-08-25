import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listTags,
  createTag,
  deleteTag,
  attachTagsToTransaction,
  detachTagFromTransaction,
  listTransactionsByTag,
} from "@/services/tag.service";
import {
  createTagSchema,
  attachTagsSchema,
} from "@flowpay/schema/tag.schema";

export const tagRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listTags(userId);
    return c.json({ data });
  })
  .post("/", zValidator("json", createTagSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createTag(userId, body);
    return c.json({ data }, 201);
  })
  .post("/attach", zValidator("json", attachTagsSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const result = await attachTagsToTransaction(userId, body);
    if (!result) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ data: result }, 201);
  })
  .get("/:id/transactions", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const page = Number(c.req.query("page") ?? "1") || 1;
    const limit = Math.min(Number(c.req.query("limit") ?? "20") || 20, 50);
    const result = await listTransactionsByTag(userId, id, { page, limit });
    if (!result) return c.json({ error: "Tag not found" }, 404);
    return c.json(result);
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteTag(userId, id);
    if (!data) return c.json({ error: "Tag not found" }, 404);
    return c.json({ success: true });
  })
  .delete(
    "/:id/transactions/:transactionId",
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const transactionId = c.req.param("transactionId");
      const result = await detachTagFromTransaction(userId, transactionId, id);
      if (!result) return c.json({ error: "Tag not found" }, 404);
      return c.json({ success: true });
    },
  );
