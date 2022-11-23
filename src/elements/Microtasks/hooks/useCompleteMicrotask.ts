import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useCompleteMicrotask = (userId: number, microtaskId: number) => {
  const [value, setValue] = useState<
    "OPINION" | "FACT" | "TRUE" | "FALSE" | undefined
  >();
  const [reason, setReason] = useState<string>("");

  const mutation = trpc.microtask_results.completeMicrotask.useMutation();
  const complete = () => {
    if (!value) {
      alert("必須項目が入力されていません");
      throw new Error("Invalid Input");
    }
    return mutation.mutate({
      userId,
      microtaskId,
      value: value,
      reason,
    });
  };
  return { complete, value, setValue, reason, setReason };
};
