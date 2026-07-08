import { authMiddleware } from "@/middleware/auth";
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionSummary,
  listTransactions,
  updateTransaction,
} from "@/services/transaction.service";
import {
  createTransactionSchema,
  listTransactionsSchema,
  transactionSummarySchema,
  updateTransactionSchema,
} from "@flowpay/schema/transaction.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const transactionRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listTransactionsSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listTransactions(userId, params);
    return c.json(result);
  })
  .get("/summary", zValidator("query", transactionSummarySchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await getTransactionSummary(userId, params);
    return c.json({ data: result });
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getTransactionById(userId, id);
    if (!data) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ data });
  })
  .post("/", zValidator("json", createTransactionSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createTransaction(userId, body);
    return c.json({ data }, 201);
  })
  .put("/:id", zValidator("json", updateTransactionSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateTransaction(userId, id, body);
    if (!data) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteTransaction(userId, id);
    if (!data) return c.json({ error: "Transaction not found" }, 404);
    return c.json({ success: true });
  });
