import { Hono } from "hono";
import { db } from "@flowpay/db";
import { sql } from "drizzle-orm";

export const healthRoutes = new Hono()
  .get("/", async (c) => {
    const startedAt = Date.now();

    try {
      await db.execute(sql`SELECT 1`);
      return c.json({
        status: "ok",
        database: "up",
        latencyMs: Date.now() - startedAt,
        uptimeSeconds: Math.round(process.uptime()),
        version: process.env.npm_package_version ?? "dev",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[Health Check] Database unreachable:", error);
      return c.json(
        {
          status: "degraded",
          database: "down",
          latencyMs: Date.now() - startedAt,
          uptimeSeconds: Math.round(process.uptime()),
          timestamp: new Date().toISOString(),
        },
        503,
      );
    }
  })
  .get("/meta", (c) =>
    c.json({
      name: "FlowPay API",
      version: process.env.npm_package_version ?? "dev",
      environment: process.env.NODE_ENV ?? "development",
      uptimeSeconds: Math.round(process.uptime()),
      features: [
        "wallets",
        "transactions",
        "budgets",
        "goals",
        "recurring",
        "invoices",
        "reports",
        "splits",
        "tags",
        "transfers",
      ],
    }),
  );
