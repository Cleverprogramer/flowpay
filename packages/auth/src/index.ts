import { expo } from "@better-auth/expo";
import { db } from "@flowpay/db";
import * as schema from "@flowpay/db/schema/auth";
import { env } from "@flowpay/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const devOrigins = env.NODE_ENV === "development" ? ["*"] : [];

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [
    env.CORS_ORIGIN,
    "flowpay://",
    "flowpay.exp.direct://",
    "mybettertapp://",
    ...devOrigins,
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      onboardingCompleted: {
        type: "boolean",
        required: false,
        input: true,
      },
      country: {
        type: "string",
        required: false,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      image: {
        type: "string",
        required: false,
        input: true,
      },
      currency: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    disableCSRFCheck: env.NODE_ENV === "development",
  },
  plugins: [expo()],
});
