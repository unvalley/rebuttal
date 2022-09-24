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
    async resolve({ input }) {
      const user = data.users.find((user) => user.id === input.id)
      return user ? { name: user.name } : undefined
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
