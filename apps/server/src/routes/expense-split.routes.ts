import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listSplits,
  createSplit,
  splitTransactionEvenly,
  settleSplit,
  getSplitsSummary,
  deleteSplit,
} from "@/services/expense-split.service";
import {
  createSplitSchema,
  splitEvenlySchema,
  settleSplitSchema,
  listSplitsSchema,
} from "@flowpay/schema/expense-split.schema";

export const expenseSplitRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listSplitsSchema), async (c) => {
    const userId = c.get("userId");
    const filters = c.req.valid("query");
    const data = await listSplits(userId, filters);
    return c.json({ data });
  })
  .get("/summary", async (c) => {
    const userId = c.get("userId");
    const data = await getSplitsSummary(userId);
    return c.json({ data });
  })
  .post("/even", zValidator("json", splitEvenlySchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await splitTransactionEvenly(userId, body);
    if (!data) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ data }, 201);
  })
  .post("/", zValidator("json", createSplitSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createSplit(userId, body);
    if (!data) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ data }, 201);
  })
  .patch("/:id/settle", zValidator("json", settleSplitSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await settleSplit(userId, id, body.isSettled);
    if (!data) return c.json({ error: "Split not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteSplit(userId, id);
    if (!data) return c.json({ error: "Split not found" }, 404);
    return c.json({ success: true });
  });
