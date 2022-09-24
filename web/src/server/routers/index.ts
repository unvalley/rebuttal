import { usersRouter } from './users'
import * as trpc from '@trpc/server'
import type { Context } from '../contexts'
import { documentsRouter } from './documents'

export const createRouter = () => trpc.router<Context>()

const tasksRouter = createRouter()
const commentsRouter = createRouter()

export const appRouter = createRouter()
  .merge('users.', usersRouter)
  .merge('documents', documentsRouter)
  .merge('tasks', tasksRouter)
  .merge('comments', commentsRouter)

export type AppRouter = typeof appRouter
