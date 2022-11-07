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
          .with("CHECK_FACT_RESOURCE", () => (
            <div>
              <div>SHOW MOREというか全文章出しても良いかも</div>
            </div>
          ))
          .with("CHECK_IF_OPINION_HAS_VALID_FACT", () => (
            <div>
              <p>意見を表示する</p>
              <div>SHOW MOREというか全文章出しても良いかも</div>
            </div>
          ))
          .with("REVIEW_OTHER_WORKERS_RESULT", () => (
            <div>評価タスク。どうやる？</div>
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
