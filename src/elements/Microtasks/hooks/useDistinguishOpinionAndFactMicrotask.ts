import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useDistinguishTask = (props: {
  microtaskId: number;
  sentenceId: number;
}) => {
  const [opinionOrFact, setOpinionOrFact] = useState<"OPINION" | "FACT">(
    "OPINION"
  );
  const mutation = trpc.microtask_results.completeMicrotask.useMutation();

  const handleSubmitOpinionOrFact = () => {
    mutation.mutate({
      microtaskId: props.microtaskId,
      sentenceId: props.sentenceId,
      value: opinionOrFact,
    });
  };

  return { opinionOrFact, setOpinionOrFact, handleSubmitOpinionOrFact };
};
