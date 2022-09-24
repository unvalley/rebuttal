import { createSWRHooks, getUseMatchMutate } from 'trpc-swr'
import type { AppRouter } from '../server/routers'
import { getUseSWRInfinite } from 'trpc-swr/infinite'

export const trpc = createSWRHooks<AppRouter>()
export const useSWRInfinite = getUseSWRInfinite<AppRouter>()
export const useMatchMutate = getUseMatchMutate<AppRouter>()
