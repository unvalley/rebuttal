import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { BinaryClassficationTask } from "./Contents/BinaryClassificationTask";
import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useWizard } from "react-use-wizard";
import { useSessionStorage } from "react-use";
import { useEffect } from "react";

export const MicrotaskDescription: React.FC<{
  microtask: ExtendedMicrotask;
  sentence: Sentence;
}> = ({ microtask, sentence }) => {
  const { activeStep, isLoading, stepCount, goToStep } = useWizard();
  const [savedActiveStep, setSavedActiveStep] = useSessionStorage(
    "microtaskActiveStep",
    activeStep
  );

  useEffect(() => {
    setSavedActiveStep(activeStep);
    if (savedActiveStep !== activeStep) {
      goToStep(activeStep);
    }
  }, [activeStep, goToStep, savedActiveStep, setSavedActiveStep]);

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
