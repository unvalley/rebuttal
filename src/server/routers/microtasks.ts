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
