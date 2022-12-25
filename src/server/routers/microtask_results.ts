import { z } from "zod";
import { router } from "../trpc";
import { publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import { MicrotaskKinds } from ".prisma/client";
import type { AggregatedResultsBySentence } from "../../types/MicrotaskResponse";
import { groupBy } from "../utils";

export const microtaskResultsRouter = router({
  findAggregatedMicrotaskResultsByDocumentId: publicProcedure
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
          sentence: true,
          microtask: {
            include: {
              paragraph: true,
            },
          },
        },
      });

      const aggregatedResults = groupBy(results, (r) => r.sentenceId).map(
        ([sentenceId, results]) => {
          // Microtask(1)の集約
          const factCount = results.filter((v) => v.value === "FACT").length;
          const opCount = results.filter((v) => v.value === "OPINION").length;
          const isFact = factCount >= opCount;

          // Microtask(2)の集約(結果集積でフィルタリングなどはしていない)
          // valueがあるかどうかなのでちゃんと集約すべき
          const resourceCheckResults = results
            .filter(
              (r) => r.microtask.kind === MicrotaskKinds.CHECK_FACT_RESOURCE
            )
            .map((r) => {
              return {
                value: r.value,
                reason: r.reason,
              };
            });

          // Microtask(3)の集約(結果集積でフィルタリングなどはしていない)
          // valueがあるかどうかなのでちゃんと集約すべき
          const opinonValidnessResults = results
            .filter(
              (r) => r.microtask.kind === MicrotaskKinds.CHECK_OPINION_VALIDNESS
            )
            .map((r) => {
              return {
                value: r.value,
                reason: r.reason,
              };
            });

          return {
            sentenceId,
            sentence: results[0]?.sentence,
            isFact,
            resourceCheckResults,
            opinonValidnessResults,
          } as AggregatedResultsBySentence;
        }
      );

      return aggregatedResults;
    }),
  completeMicrotask: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        microtaskId: z.number(),
        value: z.string(),
        reason: z.string(),
        sentenceId: z.number(),
        startedAt: z.date(),
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
          startedAt: input.startedAt,
        },
      });
    }),
});
