import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

import { env, googleEnabled } from "./env";
import { prisma } from "./prisma";

/** Cost factor for password hashing. 12 is a reasonable 2026 default. */
export const BCRYPT_ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 8;

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providers: NextAuthConfig["providers"] = [
  Credentials({
    id: "credentials",
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      const email = parsed.data.email.trim().toLowerCase();

      const user = await prisma.user.findUnique({ where: { email } });
      // No such user, or a Google-only account with no password set. The
      // sign-in action distinguishes those two cases for the error message;
      // here we only decide yes or no.
      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (googleEnabled()) {
  providers.push(
    Google({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
      // Google verifies the email addresses it hands out, so linking a Google
      // login to an existing account with the same address is safe here. It
      // lets someone who registered with a password later sign in with Google.
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Credentials sign-in requires JWT sessions. The adapter is still in play:
  // it persists users and linked OAuth accounts.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
  providers,
  pages: {
    // Locale-free paths; proxy.ts forwards them to the visitor's language.
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    /**
     * Google has already verified the address it hands us, so a user who
     * signs in that way should never be nagged to confirm it. Auth.js's
     * Google provider is a plain OIDC provider with no profile mapping, so
     * `emailVerified` stays null unless it is set here - and this runs for
     * an existing account linking Google later, not just at creation.
     */
    async signIn({ user, account, profile }) {
      if (
        account?.provider === "google" &&
        profile?.email_verified === true &&
        user.id
      ) {
        await prisma.user
          .updateMany({
            where: { id: user.id, emailVerified: null },
            data: { emailVerified: new Date() },
          })
          .catch(() => {
            // Not worth refusing a sign-in over.
          });
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub;
        token.role = user.role === "ADMIN" ? "ADMIN" : "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      // Narrowed rather than defaulted: a token from before the role claim
      // existed, or a tampered one, lands on USER.
      session.user.role = token.role === "ADMIN" ? "ADMIN" : "USER";
      return session;
    },
  },
});

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}
