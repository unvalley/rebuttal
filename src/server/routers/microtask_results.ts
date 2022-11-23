import { z } from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const microtaskResultsRouter = router({
  completeMicrotask: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        microtaskId: z.number(),
        value: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Create Result
      await prisma.microtaskResult.create({
        data: {
          assigneeId: input.userId,
          microtaskId: input.microtaskId,
          value: input.value,
          reason: input.reason,
          executor: "WORKER",
        },
      });
    }),
});
