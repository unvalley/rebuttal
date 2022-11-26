import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { BinaryClassficationTask } from "./Contents/BinaryClassificationTask";
import { MicrotaskKinds, Sentence } from ".prisma/client";

export const MicrotaskDescription: React.FC<{
  microtask: ExtendedMicrotask;
  sentence: Sentence;
}> = ({ microtask, sentence }) => {
  return (
    <div>
      <div className="">
        <span>タスク：</span>
        <span className="text-lg font-bold">{microtask.title}</span>
      </div>
      <div className="mt-2">
        {match(microtask.kind)
          .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => {
            return (
              <BinaryClassficationTask
                microtask={microtask}
                sentence={sentence}
                taskTitle="次の文（センテンス）は、意見と事実のどちらですか？"
              />
            );
          })
          .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
            <BinaryClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle="次のハイライトされた文（センテンス）には、文献情報がありますか？"
              withReason={true}
            />
          ))
          .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () => (
            <BinaryClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle="次のハイライトされた意見を表す文（センテンス）には，それを根拠付ける妥当な事実が書かれていますか？"
              withReason={true}
            />
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
