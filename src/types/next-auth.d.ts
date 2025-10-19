import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      clientId: string;
      clientName?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "client"; // 👈 safe addition
    };
  }
  interface User {
    id: string;
    clientId: string;
    clientName?: string;
    name?: string | null;
    email?: string | null;
    role?: "admin" | "client"; // 👈 safe addition
  }
}

import "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    clientId: string;
    clientName?: string;
    role?: "admin" | "client"; // 👈 safe addition
  }
}
