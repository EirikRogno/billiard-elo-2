import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { database } from "~/database/context";

const db = database();

export const auth = betterAuth({
  user: {
    additionalFields: {
      eloRating: {
        type: "number",
        required: true,
        defaultValue: 1000,
      }
    }
  },
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  }
});

export type Session = typeof auth.$Infer.Session
