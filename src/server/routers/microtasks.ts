import { z } from "zod";
import { publicProcedure } from "../trpc";
import { router } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import { MicrotaskKinds } from ".prisma/client";
import { TRPCError } from "@trpc/server";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";

const uniq = <T>(array: T[]) => {
  return Array.from(new Set(array));
};

export const microtasksRouter = router({
  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const microtask = await prisma.microtask.findUnique({
        where: { id: input.id },
        include: {
          paragraph: {
            include: {
              sentences: true,
            },
          },
        },
      });
      return microtask;
    }),
  findManyByDocumentId: publicProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ input }) => {
      const microtasks = await prisma.microtask.findMany({
        where: {
          paragraph: {
            documentId: input.documentId,
          },
        },
        include: {
          paragraph: {
            include: {
              sentences: true,
            },
          },
          microtaskResults: true,
        },
      });
      return microtasks;
    }),
  findMicrotasksToAssign: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        assignCount: z.number(),
      })
    )
    .query(async ({ input }) => {
      const ASSIGN_COUNT = input.assignCount;

      const userAlreadyCompletedTaskIds = await prisma.microtaskResult
        .findMany({
          where: {
            assigneeId: input.userId,
          },
        })
        .then((res) => uniq(res.map((r) => r.microtaskId)));

      // We find tasks that not completed enough (= have not enough records count on `microtask_results`).
      const findNotCompletedEnoughMicrotasks = async (kind: MicrotaskKinds) => {
        const tasksWithResults = await prisma.microtask.findMany({
          where: {
            kind: kind,
          },
          include: {
            microtaskResults: true,
            paragraph: {
              include: {
                sentences: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        });

        // filter microtasks that
        // - an user has never worked on before
        // - task results does not reach ASSIGN_COUNT
        const notEnoughTasks = tasksWithResults.flatMap((t) => {
          const isCompletedEnoughCount =
            t.microtaskResults.length >= ASSIGN_COUNT;
          const alreadyExperienced = userAlreadyCompletedTaskIds.includes(t.id);
          if (alreadyExperienced || isCompletedEnoughCount) return [];
          const { microtaskResults, ...microtask } = t;
          return microtask;
        });
        return notEnoughTasks;
      };

      // アサイン対象のマイクロタスクを取得する
      // MicrotaskKindsのvalueの順序で，status=CREATEDであるマイクロタスクを取得して，ASSIGN_COUNT以上になるまで取得する
      const prepareMicrotasksToAssign = async () => {
        let result: ExtendedMicrotask[] = [];
        // Sequential and mutable, but its ok for now.
        // We don't care performance for now...
        for (const kind of Object.values(MicrotaskKinds)) {
          const _tasks = await findNotCompletedEnoughMicrotasks(kind);
          result = [...result, ..._tasks];
          if (result.length >= ASSIGN_COUNT) {
            console.info("OK: We get enough new tasks.");
            break;
          }
        }
        return result.slice(0, ASSIGN_COUNT);
      };

      const microtasks = await prepareMicrotasksToAssign();

      if (!microtasks.length) {
        throw new TRPCError({
          // correct?
          code: "INTERNAL_SERVER_ERROR",
          // message: `All microtasks are already done. No microtasks to assign.`,
          message: `全てのマイクロタスクが完了されています．現在，次に取り組むべきタスクが存在しません．`,
        });
      }

      return microtasks;
    }),
});
