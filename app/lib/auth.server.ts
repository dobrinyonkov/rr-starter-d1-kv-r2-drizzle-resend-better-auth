import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.server";
import * as schema from "../../drizzle/schema";
import { sendMagicLinkEmail } from "./email.server";

const isDev = typeof import.meta !== "undefined" && import.meta.env?.MODE === "development";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
    usePlural: true,
  }),

  // GitHub OAuth
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  // Magic link (passwordless email sign-in)
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail({ to: email, url });
      },
    }),
  ],

  // Store sessions in KV for fast reads
  secondaryStorage: {
    get: (key) => env.KV.get(`auth:${key}`),
    set: (key, value, ttl) =>
      env.KV.put(`auth:${key}`, value, ttl ? { expirationTtl: ttl } : undefined),
    delete: (key) => env.KV.delete(`auth:${key}`),
  },

  // Rate limiting backed by KV
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    window: 60,
    max: 10,
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
    },
  },

  logger: isDev ? { level: "debug" } : undefined,
});

export type Auth = typeof auth;
