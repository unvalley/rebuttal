import { createNextApiHandler } from '@trpc/server/adapters/next'
import { createContext } from '../../server/contexts'
import { appRouter } from '../../server/routers'

export default createNextApiHandler({
  router: appRouter,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // TODO: setnd to bug reporting
      console.error(`Unexpected Error occured. errorMessage=${error}`)
    }
  },
  batching: {
    enabled: true
  },
  createContext
})
