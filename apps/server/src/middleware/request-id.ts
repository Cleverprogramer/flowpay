import type { MiddlewareHandler } from "hono";

const REQUEST_ID_HEADER = "X-Request-Id";

function generateRequestId(): string {
  return crypto.randomUUID();
}

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const requestId =
    c.req.header(REQUEST_ID_HEADER) ?? generateRequestId();

  await next();

  if (!c.res.headers.get(REQUEST_ID_HEADER)) {
    c.header(REQUEST_ID_HEADER, requestId);
  }
};

export { REQUEST_ID_HEADER };
