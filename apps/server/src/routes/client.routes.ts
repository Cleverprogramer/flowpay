import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listClients,
  getClientById,
  getClientInvoicesSummary,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/client.service";
import {
  createClientSchema,
  updateClientSchema,
  listClientsSchema,
} from "@flowpay/schema/client.schema";

export const clientRoutes = new Hono()
  .use(authMiddleware)
  .get("/", zValidator("query", listClientsSchema), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("query");
    const result = await listClients(userId, params);
    return c.json(result);
  })
  .get("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await getClientById(userId, id);
    if (!data) return c.json({ error: "Client not found" }, 404);
    return c.json({ data });
  })
  .get("/:id/invoice-summary", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const exists = await getClientById(userId, id);
    if (!exists) return c.json({ error: "Client not found" }, 404);
    const data = await getClientInvoicesSummary(userId, id);
    return c.json({ data });
  })
  .post("/", zValidator("json", createClientSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createClient(userId, body);
    return c.json({ data }, 201);
  })
  .put("/:id", zValidator("json", updateClientSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateClient(userId, id, body);
    if (!data) return c.json({ error: "Client not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteClient(userId, id);
    if (!data) return c.json({ error: "Client not found" }, 404);
    return c.json({ success: true });
  });
