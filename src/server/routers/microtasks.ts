import { z } from "zod";
import { publicProcedure } from "../trpc";
import { router } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import {
  Microtask,
  MicrotaskKinds,
  MicrotaskResult,
  Paragraph,
  Sentence,
} from ".prisma/client";
import { TRPCError } from "@trpc/server";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import {
  filterSentencesByKindAndIsFact,
  groupBy,
  isMicrotaskSecondOrThird,
  uniq,
} from "../utils";

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
      // 各センテンスへの結果生成回数
      const SHOULD_BE_DONE_COUNT = 5;

      const myDoneTaskIds = await prisma.microtaskResult
        .findMany({
          where: {
            assigneeId: input.userId,
          },
        })
        .then((res) => uniq(res.map((r) => r.microtaskId)));

      // filter microtasks that an user has never worked on before and task results does not reach ASSIGN_COUNT
      const notEnoughTasks = (
        tasksWithResults: (Microtask & {
          paragraph: Paragraph & {
            sentences: Sentence[];
          };
          microtaskResults: MicrotaskResult[];
        })[]
      ) =>
        tasksWithResults.flatMap((t) => {
          const hasDoneEnough =
            t.microtaskResults.length >= SHOULD_BE_DONE_COUNT;
          const alreadyDone = myDoneTaskIds.includes(t.id);
          if (alreadyDone || hasDoneEnough) return [];
          const { microtaskResults, ...microtask } = t;
          return microtask;
        });

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
        return notEnoughTasks(tasksWithResults);
      };

      const groupBySentenceId = (
        resultWithSentence: (MicrotaskResult & {
          sentence: Sentence;
        })[]
      ) =>
        groupBy(resultWithSentence, (r) => r.sentenceId).map(
          ([sentenceId, results]) => {
            const factCount = results.filter((v) => v.value === "FACT").length;
            const opCount = results.filter((v) => v.value === "OPINION").length;
            // console.log(`factCount=${factCount}, opCount=${opCount}`);
            const isFact = factCount >= opCount;
            return {
              sentenceId,
              sentence: results[0]?.sentence,
              isFact,
            };
          }
        );

      const findMicrotasksBySentenceIds = async (sentenceIds: number[]) => {
        const res = await prisma.microtaskResult.findMany({
          where: { sentenceId: { in: sentenceIds } },
          include: { sentence: true },
        });
        return res;
      };

      // creates {[sentenceId: string]: [isFact: boolean], ...}
      const acquireSentenceIdToIsFactObject = async (
        sentenceIds: number[]
      ): Promise<Record<string, boolean>> => {
        const res = await findMicrotasksBySentenceIds(sentenceIds);
        return groupBySentenceId(res).reduce((obj, item) => {
          obj[item.sentenceId] = item.isFact;
          return obj;
        }, {} as Record<string, boolean>);
      };

      // センテンスが事実か意見のどちらに評価されているか，現時点のデータを取得する
      // Microtask(2)/(3)では，文のみ，文のみを対象にするため，この処理が必要
      // タスクの取得ではなくてセンテンスの取得で別に処理を走らせることも考えたが，UI変更の煩雑性も生まれるため，ロジックの複雑性をここに一本化する方針を取った
      const attachIsFactToSentences = async (
        tasks: ExtendedMicrotask[]
      ): Promise<ExtendedMicrotask[]> => {
        const sentenceIds = tasks.flatMap((t) =>
          t.paragraph.sentences.flatMap((s) => s.id)
        );
        const sentenceIdToIsFact = await acquireSentenceIdToIsFactObject(
          sentenceIds
        );
        if (Object.keys(sentenceIdToIsFact).length === 0) return tasks;

        return tasks.map((t) => {
          return {
            ...t,
            paragraph: {
              ...t.paragraph,
              sentences: t.paragraph.sentences.map((s) => {
                return {
                  ...s,
                  isFact: sentenceIdToIsFact[s.id.toString()],
                };
              }),
            },
          };
        });
      };

      const validTasksToWork = (assignedMicrotasks: ExtendedMicrotask[]) => {
        return assignedMicrotasks.flatMap((microtask) => {
          const sentences = filterSentencesByKindAndIsFact(
            microtask.kind,
            microtask.paragraph.sentences
          );
          return Boolean(sentences.length) ? microtask : [];
        });
      };

      // アサイン対象のマイクロタスクを取得する
      // MicrotaskKindsのvalueの順序で，status=CREATEDであるマイクロタスクを取得して，ASSIGN_COUNT以上になるまで取得する
      const prepareMicrotasksToAssign = async () => {
        let result: ExtendedMicrotask[] = [];
        // Sequential and mutable, but its ok for now. We don't care performance for now...
        for (const kind of Object.values(MicrotaskKinds)) {
          const _tasks = await findNotCompletedEnoughMicrotasks(kind);
          // Microtask(2)/(3)にて，{isFact: boolean} を追加したSentenceを生成
          const tasksWithSentenceAttachedIsFact = isMicrotaskSecondOrThird(kind)
            ? await attachIsFactToSentences(_tasks)
            : _tasks;
          // Microtask(2)/(3)の場合，
          const validTasks = validTasksToWork(tasksWithSentenceAttachedIsFact);
          result = [...result, ...validTasks];
          if (result.length >= ASSIGN_COUNT) {
            console.info("OK: We get enough new tasks.");
            break;
          }
        }
        return result;
      };

      const microtasks = await prepareMicrotasksToAssign();
      const slicedMicrotasks = microtasks.slice(0, ASSIGN_COUNT);

      if (!slicedMicrotasks.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          // message: `All microtasks are already done. No microtasks to assign.`,
          message: `全てのマイクロタスクが完了されています．現在，次に取り組むべきタスクが存在しません．`,
        });
      }

      return slicedMicrotasks;
    }),
});
