import { trpc } from "../../../lib/trpc";
import type { Session } from "next-auth";
import { useState } from "react";
import { TRPCClientError } from "@trpc/client";

export const useAssignMicrotasks = (session: Session | null) => {
  const [errorMessage, setErrormessage] = useState("");
  const utils = trpc.useContext();
  const assignMicrotasksMutation = trpc.microtasks.assignMicrotasks.useMutation(
    {
      onSuccess() {
        utils.microtasks.findAssignedMicrotasksByUserId.invalidate({
          userId: session?.user?.id as number,
        });
      },
    }
  );
  const assignMicrotasks = async (session: Session) => {
    try {
      await assignMicrotasksMutation.mutateAsync({
        assigneeId: session.user.id,
        assignCount: 5,
      });
    } catch (cause) {
      if (cause instanceof TRPCClientError) {
        setErrormessage(cause.message);
      }
      console.error(cause);
    }
  };
  return { assignMicrotasks, errorMessage };
};
