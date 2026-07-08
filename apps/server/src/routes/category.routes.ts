import { authMiddleware } from "@/middleware/auth";
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/services/category.service";
import { createCategorySchema, listCategorySchema, updateCategorySchema } from "@flowpay/schema/category.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const categoryRoutes = new Hono()
.use(authMiddleware)
.get('/', zValidator('query', listCategorySchema), async (c) => {
    const userId = c.get('userId');
    const { type } = c.req.valid('query');
    const data = await listCategories(userId, type);
    return c.json(data);
})
.post("/", zValidator("json", createCategorySchema), async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    const data = await createCategory(userId, body);
    return c.json({ data }, 201);
  })
  .put("/:id", zValidator("json", updateCategorySchema), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const data = await updateCategory(userId, id, body);
    if (!data)
      return c.json(
        { error: "Category not found or is a system category" },
        404,
      );
    return c.json({ data });
  })
  .delete("/:id", async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = await deleteCategory(userId, id);
    if (!data)
      return c.json(
        { error: "Category not found or is a system category" },
        404,
      );
    return c.json({ success: true });
  })