import { z } from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import { MicrotaskStatus } from ".prisma/client";

export const microtaskResultsRouter = router({
  completeMicrotask: publicProcedure
    .input(
      z.object({
        microtaskId: z.number(),
        value: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Update Status
      await prisma.microtask.update({
        where: { id: input.microtaskId },
        data: {
          status: MicrotaskStatus.DONE,
        },
      });

      // Create Result
      await prisma.microtaskResult.create({
        data: {
          microtaskId: input.microtaskId,
          value: input.value,
          reason: input.reason,
          executor: "WORKER",
        },
      });
    }),
});
