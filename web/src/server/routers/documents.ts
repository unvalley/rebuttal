import { createRouter } from '.'
import { z } from 'zod'

export const documentsRouter = createRouter().query('get', {
  input: z.object({ id: z.number() }),
  async resolve({ input }) {
    return undefined
  }
})
