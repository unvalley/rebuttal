import { z } from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import { MicrotaskKinds } from ".prisma/client";

export const microtaskResultsRouter = router({
  findByDocumentId: publicProcedure
    .input(
      z.object({
        documentId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const document = await prisma.document.findUnique({
        where: {
          id: input.documentId,
        },
        include: { paragrahs: true },
      });
      if (!document) {
        return [];
      }
      // paragraphIds to decide target microtasks
      const paragraphIds = document?.paragrahs.flatMap((p) => p.id);
      // How to aggregate results?
      // Microtask(1): Simply Majority Decision
      // Microtask(2)/(3): All ?
      const results = await prisma.microtaskResult.findMany({
        where: {
          microtask: {
            paragraphId: {
              in: paragraphIds,
            },
          },
        },
        include: {
          microtask: {
            include: {
              paragraph: {
                include: {
                  sentences: true,
                },
              },
            },
          },
        },
      });
      const filtered = results.flatMap((r) => {
        const ok =
          r.microtask.kind === MicrotaskKinds.CHECK_OPINION_VALIDNESS ||
          r.microtask.kind === MicrotaskKinds.CHECK_FACT_RESOURCE;
        if (!ok) return [];
        return r;
      });
      return filtered;
    }),
  completeMicrotask: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        microtaskId: z.number(),
        value: z.string(),
        reason: z.string(),
        sentenceId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: validation
      await prisma.microtaskResult.create({
        data: {
          assigneeId: input.userId,
          microtaskId: input.microtaskId,
          value: input.value,
          reason: input.reason,
          sentenceId: input.sentenceId,
        },
      });
    }),
});
