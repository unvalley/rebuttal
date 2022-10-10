import { createSWRHooks, getUseMatchMutate } from 'trpc-swr'
import { getUseSWRInfinite } from 'trpc-swr/infinite'
import type { AppRouter } from '../server/routers'

export const trpc = createSWRHooks<AppRouter>()
export const useSWRInfinite = getUseSWRInfinite<AppRouter>()
export const useMatchMutate = getUseMatchMutate<AppRouter>()
