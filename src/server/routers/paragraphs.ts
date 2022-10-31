// import { createRouter } from ".";
// import { z } from "zod";
// import { TRPCError } from "@trpc/server";

// export const sentencesRouter = createRouter().mutation(
//   "createManyByDocumentId",
//   {
//     input: z.object({ documentId: z.number() }),
//     async resolve({ ctx, input }) {
//       const doc = await ctx.prisma.document.findFirst({
//         where: {
//           id: input.documentId,
//         },
//       });
//       if (!doc) {
//         throw new TRPCError({
//           code: "NOT_FOUND",
//           message: `Not Found documentId=${input.documentId}`,
//         });
//       }
//       // TEST:
//       const splittedSentences = doc.body.split("\n");
//       const insertData = splittedSentences.map((sentence) => {
//         return {
//           body: sentence,
//           documentId: input.documentId,
//         };
//       });
//       const sentences = await ctx.prisma.sentence.createMany({
//         data: insertData,
//       });
//       return sentences;
//     },
//   }
// );
