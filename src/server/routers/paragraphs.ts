// import { createRouter } from ".";
// import { z } from "zod";
// import { TRPCError } from "@trpc/server";

// export const paragraphsRouter = createRouter().mutation(
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
//       const splittedParagraphs = doc.body.split("\n");
//       const insertData = splittedParagraphs.map((paragraph) => {
//         return {
//           body: paragraph,
//           documentId: input.documentId,
//         };
//       });
//       const paragraphs = await ctx.prisma.paragraph.createMany({
//         data: insertData,
//       });
//       return paragraphs;
//     },
//   }
// );
