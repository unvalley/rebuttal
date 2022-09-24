import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from '.'

interface User {
  id: number
  name: string
}

const data: { users: User[] } = {
  users: [
    { id: 0, name: 'foo' },
    { id: 1, name: 'bar' }
  ]
}

export const usersRouter = createRouter()
  .query('get', {
    input: z.object({ id: z.number() }),
    async resolve({ ctx, input }) {
      const _user = await ctx.prisma.user.findUnique({
        where: { id: input.id }
      })
      if (!_user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with input=${JSON.stringify(input)}`
        })
      }
      return { name: _user.name, crowdId: _user.crowdId }
    }
  })
  .mutation('create', {
    input: z.object({
      name: z.string()
    }),
    async resolve({ input }) {
      const newUser: User = {
        id: data.users.length,
        name: input.name
      }
      data.users.push(newUser)
      return newUser
    }
  })
