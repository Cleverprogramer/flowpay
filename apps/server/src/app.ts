import { auth } from "@flowpay/auth";
import { env } from "@flowpay/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { categoryRoutes } from "./routes/category.routes";
import { walletRoutes } from "./routes/wallet.routes";
import { budgetRoutes } from "./routes/budget.routes";
import { transactionRoutes } from "./routes/transaction.routes";
import { notificationRoutes } from "./routes/notification.routes";
import { invoiceRoutes } from "./routes/invoice.routes";
import { goalRoutes } from "./routes/goal.routes";
import { recurringRuleRoutes } from "./routes/recurring-rule.routes";
import { reportRoutes } from "./routes/report.routes";
import { deviceRoutes } from "./routes/device.routes";

const app = new Hono()
  .use(logger())
  .use(
    "/*",
    cors({
      origin: env.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

  .route("/api/category", categoryRoutes)
  .route("/api/wallet", walletRoutes)
  .route("/api/budget", budgetRoutes)
  .route("/api/invoice", invoiceRoutes)
  .route("/api/transaction", transactionRoutes)
  .route("/api/notification", notificationRoutes)
  .route("/api/goal", goalRoutes)
  .route("/api/recurring-rule", recurringRuleRoutes)
  .route("/api/report", reportRoutes)
  .route("/api/device", deviceRoutes);

app.onError((err, c) => {
  console.error("[Server Error]", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
    500,
  );
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

export type AppType = typeof app;
export default app;
