import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useCompleteMicrotask = (microtaskId: number) => {
  const [value, setValue] = useState<
    "OPINION" | "FACT" | "TRUE" | "FALSE" | undefined
  >();
  const [reason, setReason] = useState<string>("");

  const mutation = trpc.microtask_results.completeMicrotask.useMutation();
  const complete = () => {
    if (!value) {
      return alert("必須項目が入力されていません");
    }
    return mutation.mutate({
      microtaskId,
      value: value,
    });
  };
  return { complete, value, setValue, reason, setReason };
};
