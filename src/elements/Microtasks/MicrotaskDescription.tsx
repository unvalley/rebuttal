import type { Microtask, Sentence } from "@prisma/client";
import { match } from "ts-pattern";
import { CheckResourceTask } from "./Contents/CheckResourceTask";
import { DistinguishTask } from "./Contents/DistinguishTask";
import { ReviewTask } from "./Contents/ReviewTask";
import { CheckOpinionValidnessTask } from "./Contents/CheckOpinionValidnessTask";

export type MicrotaskWithSentence = Microtask & { sentence: Sentence };

export const MicrotaskDescription: React.FC<{
  microtask: MicrotaskWithSentence;
}> = ({ microtask }) => {
  return (
    <div>
      <div className="">
        <div>
          <span>タスク：</span>
          <span className="text-lg font-bold">{microtask.title}</span>
        </div>
      </div>
      <div className="mt-2">
        {match(microtask.kind)
          .with("DISTINGUISH_OPINION_AND_FACT", () => (
            <DistinguishTask microtask={microtask} />
          ))
          .with("CHECK_FACT_RESOURCE", () => (
            <CheckResourceTask microtask={microtask} />
          ))
          .with("CHECK_IF_OPINION_HAS_VALID_FACT", () => (
            <CheckOpinionValidnessTask microtask={microtask} />
          ))
          .with("REVIEW_OTHER_WORKERS_RESULT", () => (
            <ReviewTask microtask={microtask} />
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
