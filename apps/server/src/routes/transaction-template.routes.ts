import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth";
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  applyTemplate,
} from "@/services/transaction-template.service";
import {
  createTemplateSchema,
  updateTemplateSchema,
  applyTemplateSchema,
} from "@flowpay/schema/transaction-template.schema";

export const templateRoutes = new Hono()
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId");
    const data = await listTemplates(userId);
    return c.json({ data });
  })
  .post("/", zValidator("json", createTemplateSchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createTemplate(userId, body);
    return c.json({ data }, 201);
  })
  .post(
    "/:id/apply",
    zValidator("json", applyTemplateSchema),
    async (c) => {
      const userId = c.get("userId");
      const id = c.req.param("id");
      const body = c.req.valid("json");
      const data = await applyTemplate(userId, id, body);
      if (!data) return c.json({ error: "Template not found" }, 404);
      return c.json({ data }, 201);
    },
  )
  .put("/:id", zValidator("json", updateTemplateSchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateTemplate(userId, id, body);
    if (!data) return c.json({ error: "Template not found" }, 404);
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteTemplate(userId, id);
    if (!data) return c.json({ error: "Template not found" }, 404);
    return c.json({ success: true });
  });
