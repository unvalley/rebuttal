import * as trpc from '@trpc/server'
import type { Context } from '../contexts'
import { usersRouter } from './users'
import { documentsRouter } from './documents'
import { tasksRouter } from './tasks'

export const createRouter = () => trpc.router<Context>()

const commentsRouter = createRouter()

export const appRouter = createRouter()
  .merge('users.', usersRouter)
  .merge('documents.', documentsRouter)
  .merge('tasks.', tasksRouter)
  .merge('comments.', commentsRouter)

export type AppRouter = typeof appRouter
