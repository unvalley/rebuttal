import { match } from "ts-pattern";
import { ReviewTask } from "./Contents/ReviewTask";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { BinaryClassficationTask } from "./Contents/BinaryClassificationTask";
import { MicrotaskKinds } from ".prisma/client";

export const MicrotaskDescription: React.FC<{
  microtask: ExtendedMicrotask;
}> = ({ microtask }) => {
  return (
    <div>
      <div className="">
        <span>タスク：</span>
        <span className="text-lg font-bold">{microtask.title}</span>
      </div>
      <div className="mt-2">
        {match(microtask.kind)
          .with(MicrotaskKinds.DISTINGUISH_OPINION_AND_FACT, () => {
            return (
              <BinaryClassficationTask
                microtask={microtask}
                taskTitle="次の文（センテンス）は、意見と事実のどちらですか？"
              />
            );
          })
          .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
            <BinaryClassficationTask
              microtask={microtask}
              taskTitle="次のパラグラフには、文献情報がありますか？"
              withReason={true}
            />
          ))
          .with(MicrotaskKinds.CHECK_IF_OPINION_HAS_VALID_FACT, () => (
            <BinaryClassficationTask
              microtask={microtask}
              taskTitle="次のパラグラフにおいて、意見に対して、それを根拠付ける妥当な事実が書かれていますか？"
              withReason={true}
            />
          ))
          .with(MicrotaskKinds.REVIEW_OTHER_WORKERS_RESULT, () => (
            <ReviewTask microtask={microtask} />
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
