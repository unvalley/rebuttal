import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const documentsRouter = router({
  saveAndInsertMicrotasks: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // TODO: write logic to save microtasks
      console.log(input);
    }),
  findAll: publicProcedure.input(z.object({})).query(async () => {
    const docs = await prisma.document.findMany();
    return docs;
  }),
  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await prisma.document.findUniqueOrThrow({
        where: { id: input.id },
      });
      return doc;
    }),
  findByParagraphId: publicProcedure
    .input(z.object({ paragraphId: z.number() }))
    .query(async ({ input }) => {
      const paragraph = await prisma.paragraph.findFirstOrThrow({
        select: {
          documentId: true,
        },
        where: {
          id: input.paragraphId,
        },
      });
      const doc = await prisma.document.findFirstOrThrow({
        where: {
          id: paragraph.documentId,
        },
      });
      return doc;
    }),
  findWithSentencesById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const doc = await prisma.document.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          paragrahs: {
            include: {
              sentences: true,
            },
          },
        },
      });
      return doc;
    }),
});
