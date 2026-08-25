import { auth } from "@flowpay/auth";
import { env } from "@flowpay/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createRateLimiter } from "./middleware/rate-limit";
import { requestIdMiddleware } from "./middleware/request-id";
import { healthRoutes } from "./routes/health.routes";
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
import { clientRoutes } from "./routes/client.routes";
import { expenseSplitRoutes } from "./routes/expense-split.routes";
import { balanceAuditRoutes } from "./routes/balance-audit.routes";
import { categorizationRuleRoutes } from "./routes/categorization-rule.routes";
import { notificationPreferenceRoutes } from "./routes/notification-preference.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { currencyRateRoutes } from "./routes/currency-rate.routes";

const app = new Hono()
  .use(logger())
  .use(requestIdMiddleware)
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
  .route("/api/health", healthRoutes)
  .use("/api/*", createRateLimiter({ windowMs: 60_000, max: 120 }))

  .route("/api/category", categoryRoutes)
  .route("/api/wallet", walletRoutes)
  .route("/api/budget", budgetRoutes)
  .route("/api/invoice", invoiceRoutes)
  .route("/api/transaction", transactionRoutes)
  .route("/api/notification", notificationRoutes)
  .route("/api/goal", goalRoutes)
  .route("/api/recurring-rule", recurringRuleRoutes)
  .route("/api/report", reportRoutes)
  .route("/api/device", deviceRoutes)
  .route("/api/client", clientRoutes)
  .route("/api/expense-split", expenseSplitRoutes)
  .route("/api/balance-audit", balanceAuditRoutes)
  .route("/api/categorization-rule", categorizationRuleRoutes)
  .route("/api/notification-preference", notificationPreferenceRoutes)
  .route("/api/dashboard", dashboardRoutes)
  .route("/api/currency-rate", currencyRateRoutes);

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
