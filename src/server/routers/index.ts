import { usersRouter } from "./users";
import { documentsRouter } from "./documents";
import { microtasksRouter } from "./microtasks";
import { publicProcedure, router } from "../trpc";
import { microtaskResultsRouter } from "./microtask_results";
import { paragraphsRouter } from "./paragraphs";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "yay!"),
  users: usersRouter,
  documents: documentsRouter,
  paragraphs: paragraphsRouter,
  microtasks: microtasksRouter,
  microtask_results: microtaskResultsRouter,
});

export type AppRouter = typeof appRouter;
