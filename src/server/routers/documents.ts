import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const documentsRouter = router({
  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await prisma.document.findUnique({
        where: { id: input.id },
      });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" });
      }
      return doc;
    }),
  findWithSentencesById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await prisma.document.findUnique({
        where: { id: input.id },
        include: { sentences: true },
      });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" });
      }
      return doc;
    }),
});

// .mutation("create", {
//   input: z.object({
//     title: z.string().min(1).max(32),
//     // TODO: typing
//     body: z.any(),
//     userId: z.number(),
//   }),
//   async resolve({ ctx, input }) {
//     // ts(7022) error handling
//     const doc: Document = await ctx.prisma.document.create({
//       data: {
//         title: input.title,
//         body: input.body,
//         isRebuttalReady: false,
//         authorId: input.userId,
//       },
//     });
//     return doc;
//   },
// });
