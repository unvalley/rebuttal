import { z } from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const microtaskResultsRouter = router({
  completeMicrotask: publicProcedure
    .input(
      z.object({
        microtaskId: z.number(),
        sentenceId: z.number(),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.microtaskResult.update({
        where: {
          id: input.microtaskId,
        },
        data: {
          value: input.value,
        },
      });
    }),
});
