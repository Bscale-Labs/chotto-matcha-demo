import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db/client";
import { user } from "@/db/schema";
import { sendMagicLinkEmail } from "@/lib/email/resend";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    cookiePrefix: "chotto-matcha"
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
  },
  plugins: [
    magicLink({
      disableSignUp: true,
      expiresIn: 60 * 10,
      sendMagicLink: async ({ email, url, metadata }) => {
        const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
        if (!existingUser) return;

        await sendMagicLinkEmail({
          to: email,
          url,
          intent: typeof metadata?.intent === "string" ? metadata.intent : undefined,
          role: typeof metadata?.role === "string" ? metadata.role : undefined
        });
      }
    }),
    nextCookies()
  ]
});

export type Auth = typeof auth;
