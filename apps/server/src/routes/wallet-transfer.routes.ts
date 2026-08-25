import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listTransfers,
  createTransfer,
} from "@/services/wallet-transfer.service";
import {
  createTransferSchema,
  listTransfersSchema,
} from "@flowpay/schema/wallet-transfer.schema";

export const walletTransferRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listTransfersSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listTransfers(userId, params);
    return c.json(result);
  })
  .post("/", zValidator("json", createTransferSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const result = await createTransfer(userId, body);
    if ("error" in result) return c.json({ error: result.error }, 400);
    return c.json({ data: result.data }, 201);
  });
