import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { ClassficationTask } from "./Contents/ClassificationTask";
import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useWizard } from "react-use-wizard";

export const MicrotaskDescription: React.FC<{
  microtask: ExtendedMicrotask;
  sentence: Sentence;
}> = ({ microtask, sentence }) => {
  const { activeStep, isLoading, stepCount } = useWizard();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const displaStep = {
    activeStep: activeStep + 1,
    stepCount: stepCount,
  };

  return (
    <div className="w-5/6">
      <div className="">
        <span>タスク：</span>
        <span className="text-lg font-bold">{microtask.title}</span>
        <span>
          （{displaStep.activeStep}件目/{displaStep.stepCount}件中）
        </span>
        <progress
          className="progress progress-success"
          value={activeStep}
          max={stepCount}
        />
      </div>
      <div className="mt-2">
        {match(microtask.kind)
          .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => {
            return (
              <ClassficationTask
                microtask={microtask}
                sentence={sentence}
                taskTitle="次の文（センテンス）は、意見と事実のどちらですか？"
              />
            );
          })
          .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
            <ClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle="次のハイライトされた文（センテンス）には、文献情報が書かれていますか？"
            />
          ))
          .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () => (
            <ClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle="次のハイライトされた意見を表す文（センテンス）には，それを根拠付ける妥当な事実が書かれていますか？"
              withReason={true}
              reasonText="上記の回答理由を述べてください。
              「書かれている」と回答した場合、「どの文章を読んで書かれていると判断したのか」を述べてください。
              「書かれていない」と回答した場合、「どのように文章を改善すれば、より根拠のある意見になるか」を述べてください。"
            />
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
