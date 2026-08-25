import { Hono } from "hono";
import { db } from "@flowpay/db";
import { sql } from "drizzle-orm";

export const healthRoutes = new Hono().get("/", async (c) => {
  const startedAt = Date.now();

  try {
    await db.execute(sql`SELECT 1`);
    return c.json({
      status: "ok",
      database: "up",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Health Check] Database unreachable:", error);
    return c.json(
      {
        status: "degraded",
        database: "down",
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      },
      503,
    );
  }
});
