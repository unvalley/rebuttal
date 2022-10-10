import type * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { prisma } from '../../lib/prismaClient'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  return {
    req,
    res,
    prisma,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
