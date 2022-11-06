import { NextAuthOptions, unstable_getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "./prismaClient";
import { loginSchema } from "../validation/auth";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        name: {
          label: "name",
          type: "text",
          placeholder: "",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { name, password } = await loginSchema.parseAsync(credentials);
          const user = await prisma.user.findFirst({
            where: { name },
            include: {
              role: true,
            },
          });
          if (!user) {
            // throw new Error("user is none");
            return null;
          }
          const isValidPassword = await verify(user.password, password);

          if (!isValidPassword) {
            // throw new Error("Invalid Password");
            return null;
          }
          return {
            id: user.id,
            name: user.name,
            roleKind: user.role.kind,
          };
        } catch (err: any) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          user: { name: user.name, id: user.id, roleKind: user.roleKind },
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token && token.name) {
        return {
          ...session,
          user: {
            name: token.name,
            id: token.user.id,
            roleKind: token.user.roleKind,
          },
        };
      }
      return session;
    },
    async signIn() {
      // TODO: タスクアサイン
      return true;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  // TODO: use NEXTAUTH_SECRET env
  // https://next-auth.js.org/configuration/options#secret
  secret: "super-secret",
  theme: {
    colorScheme: "light",
    brandColor: "purple", // Hex color code,
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
  debug: process.env.NODE_ENV === "development",
};

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/auth/login", // login path
          permanent: false,
        },
      };
    }
    return await func(ctx);
  };