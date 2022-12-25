import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "../../lib/prismaClient";

export const paragraphsRouter = router({
  findManyById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const paragraph = await prisma.paragraph.findFirstOrThrow({
        select: { documentId: true },
        where: { id: input.id },
      });

      const document = await prisma.document.findFirstOrThrow({
        where: { id: paragraph.documentId },
      });

      const paragraphs = await prisma.paragraph.findMany({
        where: { documentId: paragraph.documentId },
        include: { sentences: true },
      });

      return { paragraphs, document };
    }),
});
