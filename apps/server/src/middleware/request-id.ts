import type { MiddlewareHandler } from "hono";

const REQUEST_ID_HEADER = "X-Request-Id";

function generateRequestId(): string {
  return crypto.randomUUID();
}

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const requestId =
    c.req.header(REQUEST_ID_HEADER) ?? generateRequestId();

  c.header(REQUEST_ID_HEADER, requestId);

  await next();
};

export { REQUEST_ID_HEADER };
