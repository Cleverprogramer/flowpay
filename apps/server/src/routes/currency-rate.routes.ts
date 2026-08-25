import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listCurrencyRates,
  upsertCurrencyRate,
  deleteCurrencyRate,
  convertCurrency,
} from "@/services/currency-rate.service";
import {
  upsertCurrencyRateSchema,
  convertCurrencySchema,
} from "@flowpay/schema/currency-rate.schema";

export const currencyRateRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listCurrencyRates(userId);
    return c.json({ data });
  })
  .get("/convert", zValidator("query", convertCurrencySchema), async (c) => {
    const userId = c.get("userId");
    const query = c.req.valid("query");
    const data = await convertCurrency(userId, query);
    if (!data)
      return c.json(
        { error: `No stored rate for ${query.from}/${query.to}` },
        404,
      );
    return c.json({ data });
  })
  .put("/", zValidator("json", upsertCurrencyRateSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await upsertCurrencyRate(userId, body);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteCurrencyRate(userId, id);
    if (!data) return c.json({ error: "Rate not found" }, 404);
    return c.json({ success: true });
  });
