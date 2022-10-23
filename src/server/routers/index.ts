import { usersRouter } from "./users";
import { documentsRouter } from "./documents";
import { microtasksRouter } from "./microtasks";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  users: usersRouter,
  documents: documentsRouter,
  microtasks: microtasksRouter,
});

export type AppRouter = typeof appRouter;
