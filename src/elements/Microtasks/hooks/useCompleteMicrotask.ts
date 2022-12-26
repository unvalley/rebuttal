import { MicrotaskKinds } from ".prisma/client";
import { useState } from "react";
import { match } from "ts-pattern";
import { trpc } from "../../../lib/trpc";

export type SentenceKind = "OPINION" | "FACT" | "UNKNOWN";
export type Ternary = "TRUE" | "FALSE" | "LOW_RELIABILITY";

export const useCompleteMicrotask = ({
  userId,
  microtaskId,
  sentenceId,
  microtaskKind,
  startedAt,
}: {
  userId: number;
  microtaskId: number;
  sentenceId: number;
  microtaskKind: MicrotaskKinds;
  startedAt: Date;
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
      .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, async () => {
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
            startedAt,
          },
          {
            onSuccess: () => cleanUp(),
            onError: () => cleanUp(),
          }
        );
      })
      .otherwise(async () => {
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
            startedAt,
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
