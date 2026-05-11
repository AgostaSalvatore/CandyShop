import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "USER" | "ADMIN";
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, image: true, role: true, passwordHash: true },
        });
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
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      const t = token as typeof token & { id?: string; role?: "USER" | "ADMIN" };
      if (user) {
        t.id = user.id as string;
        t.role = (user.role as "USER" | "ADMIN" | undefined) ?? "USER";
      }
      // Re-sync role on each refresh (in case user was promoted to admin)
      if (trigger === "update" || (!t.role && t.sub)) {
        const dbUser = await db.user.findUnique({
          where: { id: t.sub! },
          select: { id: true, role: true },
        });
        if (dbUser) {
          t.id = dbUser.id;
          t.role = dbUser.role;
        }
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as typeof token & { id?: string; role?: "USER" | "ADMIN" };
      if (session.user) {
        session.user.id = t.id ?? "";
        session.user.role = t.role ?? "USER";
      }
      return session;
    },
  },
});
