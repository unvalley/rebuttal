import type { Microtask, Sentence } from "@prisma/client";
import { match } from "ts-pattern";
import { DistinguishMicrotask } from "./DistinguishMicrotask";

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
        <div className="text-lg">
          <span className="bg-green-100 text-green-800">簡単</span>
          <span className="text-green-700">: 3-5分</span>
        </div>
      </div>
      <div className="mt-2">
        {match(microtask.kind)
          .with("DISTINGUISH_OPINION_AND_FACT", () => (
            <DistinguishMicrotask microtask={microtask} />
          ))
          .with("CHECK_FACT_RESOURCE", () => <></>)
          .with("CHECK_IF_OPINION_HAS_VALID_FACT", () => <></>)
          .with("REVIEW_OTHER_WORKERS_RESULT", () => <></>)
          .exhaustive()}
      </div>
    </div>
  );
};
