import type { MiddlewareHandler } from "hono";

const MAX_BODY_BYTES = 1024 * 1024;

export const bodySizeLimit: MiddlewareHandler = async (c, next) => {
  const contentLength = Number(c.req.header("Content-Length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return c.json({ error: "Request body too large (max 1MB)" }, 413);
  }
  await next();
};
