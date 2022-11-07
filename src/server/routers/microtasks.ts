import { z } from "zod";
import { publicProcedure } from "../trpc";
import { router } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const microtasksRouter = router({
  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const microtask = await prisma.microtask.findUnique({
        where: { id: input.id },
      });
      return microtask;
    }),
  // 現状ひとつしかアサインしない想定
  findByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const microtaskWithSentence = await prisma.microtask.findFirst({
        where: { assigneeId: input.userId },
        include: { sentence: true },
      });
      return microtaskWithSentence;
    }),
  findManyByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const microtaskWithSentence = await prisma.microtask.findMany({
        where: { assigneeId: input.userId },
        include: { sentence: true },
      });
      return microtaskWithSentence;
    }),
  findManyByDocumentId: publicProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ input }) => {
      const microtasks = await prisma.microtask.findMany({
        select: {
          id: true,
          title: true,
          body: true,
          status: true,
          kind: true,
          sentenceId: true,
          assignee: {
            select: {
              id: true,
              name: true,
              crowdId: true,
            },
          },
          assigneeId: true,
          sentence: {
            select: {
              id: true,
              body: true,
              documentId: true,
            },
          },
        },
        where: {
          sentence: {
            documentId: input.documentId,
          },
        },
      });
      return microtasks;
    }),
  updateToAssign: publicProcedure
    .input(
      z.object({
        id: z.number(),
        assigneeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.microtask.update({
        where: {
          id: input.id,
        },
        data: {
          assigneeId: input.assigneeId,
          status: "ASSIGNED",
        },
      });
    }),
  assignSomeMicrotasks: publicProcedure
    .input(
      z.object({
        assigneeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const assignCount = 5;
      const microtasks = await prisma.microtask.findMany({
        select: {
          id: true,
        },
        where: {
          status: "CREATED",
        },
        take: assignCount,
      });
      const microtasksIds = microtasks.map((e) => e.id);

      return await prisma.microtask.updateMany({
        data: {
          assigneeId: input.assigneeId,
          status: "ASSIGNED",
        },
        where: { id: { in: microtasksIds } },
      });
    }),
  updateToUnassign: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.microtask.update({
        where: {
          id: input.id,
        },
        data: {
          assigneeId: null,
          status: "CREATED",
        },
      });
    }),
  completeDistinguishTask: publicProcedure
    .input(
      z.object({
        id: z.number(),
        sentenceId: z.number(),
        distinguishResult: z.enum(["OPINION", "FACT"]),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.microtask.update({
        where: {
          id: input.id,
        },
        data: {
          status: "DONE",
        },
      });

      await prisma.sentence.update({
        where: {
          id: input.sentenceId,
        },
        data: {
          kind: input.distinguishResult,
        },
      });
    }),
});

//   .mutation("createManyBySentenceId", {
//     input: z.object({ sentenceId: z.number() }),
//     async resolve({ ctx, input }) {
//       const sentence = await ctx.prisma.sentence.findFirst({
//         where: {
//           id: input.sentenceId,
//         },
//       });
//       if (!sentence) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: `Not found sentenceId=${input.sentenceId}`,
//         });
//       }

//       const microtasks = await ctx.prisma.microtask.createMany({
//         data: [
//           {
//             title: MICROTASKS.SPLIT_OPINION_AND_FACT,
//             body: "",
//             status: "CREATED",
//             sentenceId: input.sentenceId,
//           },
//           {
//             title: MICROTASKS.CHECK_SOURCE,
//             body: "",
//             status: "CREATED",
//             sentenceId: input.sentenceId,
//           },
//           {
//             title: MICROTASKS.CHECK_VALID_FACT,
//             body: "",
//             status: "CREATED",
//             sentenceId: input.sentenceId,
//           },
//         ],
//       });
//       return microtasks;
//     },
//   })
