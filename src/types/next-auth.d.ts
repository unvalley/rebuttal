import NextAuth, { DefaultSession, JWT, DefaultUser, User } from "next-auth";
import type { ZodEnum } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      crowdId: string;
      roleKind: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    crowdId: string;
    roleKind: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: JWT["user"] & {
      id: number;
      crowdId: string;
      roleKind: string;
    };
  }
}
