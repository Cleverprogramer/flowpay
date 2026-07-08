import { auth } from "@flowpay/auth";
import { createMiddleware } from "hono/factory";

type AuthEnv = {
    Variables: {
        userId: string;
        userEmail: string;
    }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    })

    if(!session?.user) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", session.user.id);
    c.set("userEmail", session.user.email);

    await next();
})