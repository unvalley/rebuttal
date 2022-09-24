import { createRouter } from '.'
import { z } from 'zod'
import type { Document } from '.prisma/client'

export const documentsRouter = createRouter()
  .query('get', {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      return undefined
    }
  })
  .query('list', {
    input: z.object({}),
    async resolve({ input }) {
      return
    }
  })
  .mutation('create', {
    input: z.object({
      title: z.string().min(1).max(32),
      // TODO: typing
      body: z.any(),
      userId: z.number()
    }),
    async resolve({ ctx, input }) {
      // ts(7022) error handling
      const doc: Document = await ctx.prisma.document.create({
        data: {
          title: input.title,
          body: input.body,
          isRebuttalReady: false,
          authorId: input.userId
        }
      })
      return doc
    }
  })
