import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useDistinguishMicrotask = (props: {
  microtaskId: number;
  sentenceId: number;
}) => {
  const [opinionOrFact, setOpinionOrFact] = useState<
    "OPINION" | "FACT" | "NONE"
  >("NONE");
  const mutation = trpc.microtasks.completeDistinguishTask.useMutation();

  const handleSubmitOpinionOrFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (opinionOrFact === "NONE") {
      alert("回答は必須です");
      return;
    }
    mutation.mutate({
      id: props.microtaskId,
      sentenceId: props.sentenceId,
      distinguishResult: opinionOrFact,
    });
  };

  return { opinionOrFact, setOpinionOrFact, handleSubmitOpinionOrFact };
};
