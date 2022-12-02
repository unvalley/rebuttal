import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useCompleteMicrotask = ({
  userId,
  microtaskId,
  sentenceId,
}: {
  userId: number;
  microtaskId: number;
  sentenceId: number;
}) => {
  const [value, setValue] = useState<
    "OPINION" | "FACT" | "TRUE" | "FALSE" | undefined
  >();
  const [reason, setReason] = useState<string>("");

  const mutation = trpc.microtask_results.completeMicrotask.useMutation();
  const complete = () => {
    if (!value || !reason) {
      throw new Error("必須入力項目が満たされていません");
    }
    return mutation.mutate({
      userId,
      sentenceId,
      microtaskId,
      value: value,
      reason,
    });
  };
  return { complete, value, setValue, reason, setReason };
};
