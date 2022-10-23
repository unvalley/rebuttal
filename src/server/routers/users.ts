import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../lib/prismaClient";
import { router, publicProcedure } from "../trpc";

interface User {
  id: number;
  name: string;
}

const data: { users: User[] } = {
  users: [
    { id: 0, name: "foo" },
    { id: 1, name: "bar" },
  ],
};

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
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const newUser: User = {
        id: data.users.length,
        name: input.name,
      };
      data.users.push(newUser);
      return newUser;
    }),
});
