import { z } from "zod";
import { publicProcedure } from "../trpc";
import { router } from "../trpc";
import { prisma } from "../../lib/prismaClient";
import { Microtask, MicrotaskKinds } from ".prisma/client";

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
        include: { paragraph: true },
      });
      return microtaskWithSentence;
    }),
  findManyByUserId: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const microtaskWithSentence = await prisma.microtask.findMany({
        where: { assigneeId: input.userId },
        include: { paragraph: true },
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
          paragraphId: true,
          assignee: {
            select: {
              id: true,
              crowdId: true,
            },
          },
          assigneeId: true,
          paragraph: {
            select: {
              id: true,
              body: true,
              documentId: true,
              sentences: true,
            },
          },
        },
        where: {
          paragraph: {
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
  assignMicrotasks: publicProcedure
    .input(
      z.object({
        assigneeId: z.number(),
        assignCount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const ASSIGN_COUNT = input.assignCount;

      const prepareMicrotasksToAssign = async () => {
        let result: Microtask[] = [];
        // Sequential and mutable, but its ok for now.
        for (const kind of Object.values(MicrotaskKinds)) {
          const _tasks = await findUnassignedMicrotasksByKind(kind);
          result = [...result, ..._tasks];
          if (result.length >= ASSIGN_COUNT) {
            console.info("OK: We get enough new tasks.");
            break;
          }
        }
        return result.slice(0, ASSIGN_COUNT);
      };

      const findUnassignedMicrotasksByKind = async (kind: MicrotaskKinds) => {
        const tasks = await prisma.microtask.findMany({
          where: {
            kind: kind,
            status: "CREATED",
          },
          take: ASSIGN_COUNT,
          orderBy: { created_at: "asc" },
        });
        return tasks;
      };

      const microtasks = await prepareMicrotasksToAssign();

      return await prisma.microtask.updateMany({
        data: {
          assigneeId: input.assigneeId,
          status: "ASSIGNED",
        },
        where: { id: { in: microtasks.map((m) => m.id) } },
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
