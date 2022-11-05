import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { Session, unstable_getServerSession } from "next-auth";
import { nextAuthOptions } from "../../lib/nextAuth";

interface CreateContextOptions {
  session: Session | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {};
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  ctx: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const { req, res } = ctx;
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  return await createContextInner({
    session,
  });
}
