import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { prisma } from "../../lib/prismaClient";

export const documentsRouter = router({
  saveAndInsertMicrotasks: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // TODO: write logic to save microtasks
      console.log(input);
    }),
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
        include: {
          paragrahs: {
            include: {
              sentences: true,
            },
          },
        },
      });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Not found" });
      }
      return doc;
    }),
});
