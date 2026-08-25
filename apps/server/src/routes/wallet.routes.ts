import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listWallets,
  getWalletById,
  getDefaultWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  adjustWalletBalance,
  recalculateWalletBalances,
} from "@/services/wallet.service";
import { getWalletLimitStatus } from "@/services/wallet-limit.service";
import {
  createWalletSchema,
  updateWalletSchema,
  listWalletsQuerySchema,
  adjustBalanceSchema,
} from "@flowpay/schema/wallet.schema";

export const walletRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listWalletsQuerySchema), async (c) => {
    const userId = c.get("userId");
    const { archived, type } = c.req.valid("query");
    const data = await listWallets(userId, { archived, type });
    return c.json({ data });
  })
  .get("/default", async (c) => {
    const userId = c.get("userId");
    const data = await getDefaultWallet(userId);
    return c.json({ data });
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getWalletById(userId, id);
    if (!data) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ data });
  })
  .post("/", zValidator("json", createWalletSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createWallet(userId, body);
    return c.json({ data }, 201);
  })
  .get("/:id/limit-status", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getWalletLimitStatus(userId, id);
    if (!data) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ data });
  })
  .post("/recalculate-balances", async (c) => {
    const userId = c.get("userId");
    const data = await recalculateWalletBalances(userId);
    return c.json({ data });
  })
  .patch(
    "/:id/balance",
    zValidator("json", adjustBalanceSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const data = await adjustWalletBalance(userId, id, body.amount);
      if (!data) return c.json({ error: "Wallet not found" }, 404);
      return c.json({ data });
    },
  )
  .put("/:id", zValidator("json", updateWalletSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateWallet(userId, id, body);
    if (!data) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteWallet(userId, id);
    if (!data) return c.json({ error: "Wallet not found" }, 404);
    return c.json({ success: true });
  });
