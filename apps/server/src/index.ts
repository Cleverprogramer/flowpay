import app from "./app";

export { default } from "./app";
export type { AppType } from "./app";

const port = Number(process.env.PORT ?? 3000);

const server = Bun.serve({
  port,
  fetch: app.fetch,
  idleTimeout: 30,
});

console.log(`[Server] FlowPay API listening on http://localhost:${port}`);

const shutdown = (signal: string) => {
  console.log(`[Server] ${signal} received, draining connections...`);
  const exitTimer = setTimeout(() => process.exit(0), 10_000);
  exitTimer.unref();

  server.stop(true);
  console.log("[Server] Shutdown complete");
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
