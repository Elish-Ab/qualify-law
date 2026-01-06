// src/lib/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { AirtableDAL } from "./airtable";
import bcrypt from "bcryptjs";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    // 🧑‍💼 CLIENT LOGIN
    Credentials({
      id: "client-login",
      name: "Client Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const parsed = CredentialsSchema.safeParse(credentials ?? {});
        if (!parsed.success) {
          console.warn("⚠️ Credentials validation failed");
          return null;
        }

        const { email, password } = parsed.data;

        console.log("🟡 Attempting login for:", email);
        const user = await AirtableDAL.getUserByEmail(email);

        if (!user) {
          console.warn("❌ No user found for:", email);
          return null;
        }

        const storedHash =
          user.passwordHash ||
          (typeof user === "object" &&
          user !== null &&
          "password" in user
            ? (user as { password?: string }).password
            : undefined);
    

        if (!storedHash) {
          console.error("❌ No password hash found in Airtable for:", email);
          return null;
        }

        let isValid = false;
        try {
          isValid = await bcrypt.compare(password, storedHash);
        } catch (err) {
          console.error("❌ bcrypt.compare threw error:", err);
        }

      
        if (!isValid) {
          console.warn("❌ Invalid password for user:", email);
          return null;
        }

        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          clientId: user.clientId,
          clientName: user.clientName,
          role: "client",
        };
      },
    }),

    // 🛡️ ADMIN LOGIN
    Credentials({
      id: "admin-login",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const parsed = CredentialsSchema.safeParse(credentials ?? {});
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        console.log("🟡 Attempting admin login for:", email);

        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          console.log("✅ Admin login success:", email);
          return {
            id: "admin",
            name: "Administrator",
            email,
            clientId: "admin",
            clientName: "Admin Panel",
            role: "admin",
          };
        }

        console.warn("❌ Invalid admin credentials for:", email);
        return null;
      },
    }),
  ],

  // 🧠 Handle token/session mapping
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.clientId = user.clientId;
        token.clientName = user.clientName;
        const resolvedRole =
          typeof user === "object" && user && "role" in user && user.role
            ? (user.role as "admin" | "client")
            : "client";
        token.role = resolvedRole;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.uid as string;
      session.user.clientId = token.clientId as string;
      session.user.clientName = token.clientName;
      if (token.role) {
        session.user.role = token.role as "admin" | "client";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

export default authOptions;
