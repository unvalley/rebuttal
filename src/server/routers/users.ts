import type { RoleKind } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { z } from "zod";
import { prisma } from "../../lib/prismaClient";
import { router, publicProcedure } from "../trpc";

export const usersRouter = router({
  findById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const _user = await prisma.user.findUnique({
        where: { id: input.id },
      });
      if (!_user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with input=${JSON.stringify(input)}`,
        });
      }
      return { name: _user.name, crowdId: _user.crowdId };
    }),
  create: publicProcedure
    .input(
      z.object({
        crowdId: z.string(),
        password: z.string(),
        // TODO
        roleKind: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const role = await prisma.role.findFirst({
        where: {
          kind: input.roleKind as RoleKind,
        },
      });
      if (!role) {
        throw new Error(`RoleKind is invalid. roleKind ${input.roleKind}`);
      }
      const password = await hash(input.password);
      return await prisma.user.create({
        data: {
          name: "",
          password,
          roleId: role.id,
          crowdId: input.crowdId,
        },
      });
    }),
});
