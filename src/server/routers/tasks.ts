import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { createRouter } from '.'

export const tasksRouter = createRouter()
  .query('getById', {
    input: z.object({ id: z.number() }),
    async resolve({ ctx, input }) {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      })
      if (!task)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Not found' })
      return task
    },
  })
  .query('getByUserId', {
    input: z.object({ userId: z.number() }),
    async resolve({ ctx, input }) {
      // get assigned tasks
      const tasks = await ctx.prisma.task.findMany({
        where: { assigneeId: input.userId },
      })
      return tasks
    },
  })
