import { MicrotaskKinds } from ".prisma/client";
import { useState } from "react";
import { match } from "ts-pattern";
import { trpc } from "../../../lib/trpc";

export type SentenceKind = "OPINION" | "FACT" | "UNKNOWN";
export type Ternary = "TRUE" | "FALSE";

export const useCompleteMicrotask = ({
  userId,
  microtaskId,
  sentenceId,
  microtaskKind,
}: {
  userId: number;
  microtaskId: number;
  sentenceId: number;
  microtaskKind: MicrotaskKinds;
}) => {
  const [value, setValue] = useState<SentenceKind | Ternary | undefined>();
  const [reason, setReason] = useState<string>("");

  const mutation = trpc.microtask_results.completeMicrotask.useMutation();

  const cleanUp = () => {
    setValue(undefined);
    setReason("");
  };

  const complete = async () => {
    match(microtaskKind)
      .with(MicrotaskKinds.CHECK_OP_OR_FACT, async () => {
        // validation
        if (!value) {
          throw new Error("必須項目が入力されていません");
        }
        return await mutation.mutateAsync(
          {
            userId,
            sentenceId,
            microtaskId,
            value,
            reason,
          },
          {
            onSuccess: () => cleanUp(),
            onError: () => cleanUp(),
          }
        );
      })
      .otherwise(async () => {
        if (!value || !reason) {
          throw new Error("必須項目が入力されていません");
        }
        return await mutation.mutateAsync(
          {
            userId,
            sentenceId,
            microtaskId,
            value,
            reason,
          },
          {
            onSuccess: () => cleanUp(),
            onError: () => cleanUp(),
          }
        );
      });
  };
  return { complete, value, setValue, reason, setReason };
};
