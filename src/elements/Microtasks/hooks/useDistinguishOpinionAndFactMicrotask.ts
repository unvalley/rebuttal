import { useState } from "react";
import { trpc } from "../../../lib/trpc";

export const useDistinguishTask = (props: {
  microtaskId: number;
  sentenceId: number;
}) => {
  const [opinionOrFact, setOpinionOrFact] = useState<"OPINION" | "FACT">(
    "OPINION"
  );
  const mutation = trpc.microtasks.completeDistinguishTask.useMutation();

  const handleSubmitOpinionOrFact = () => {
    mutation.mutate({
      id: props.microtaskId,
      sentenceId: props.sentenceId,
      distinguishResult: opinionOrFact,
    });
  };

  return { opinionOrFact, setOpinionOrFact, handleSubmitOpinionOrFact };
};
