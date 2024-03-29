import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { ClassficationTask } from "./ClassificationTask";
import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useWizard } from "react-use-wizard";
import { useBeforeUnload } from "./hooks/useBeforeUnload";
import { useEffect } from "react";

export const MicrotaskDescription: React.FC<{
  microtask: ExtendedMicrotask;
  sentence: Sentence;
}> = ({ microtask, sentence }) => {
  const { activeStep, isLoading, stepCount } = useWizard();
  useBeforeUnload(
    "ページを離脱すると，タスク実施は最初からやり直しとなります．本当にページを離脱しますか？"
  );

  const displayStep = {
    activeStep: activeStep + 1,
    stepCount: stepCount,
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <div className="">
        <span>評価タスク内容：</span>
        <span className="text-lg font-bold">{microtask.title}</span>
        <span>
          （{displayStep.activeStep}件目/{displayStep.stepCount}件中）
        </span>
        <progress
          className={`progress ${
            displayStep.activeStep % 2 == 0
              ? "progress-primary"
              : "progress-success"
          }`}
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
                taskTitle={`上の文は，意見と事実のどちらですか？選択肢の中から一つ選んで回答してください．`}
              />
            );
          })
          .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
            <ClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle={`上の青色でハイライトされた文について，根拠として妥当な情報源が周囲に書かれていますか？選択肢の中から一つ選んで回答してください．`}
            />
          ))
          .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () => (
            <ClassficationTask
              microtask={microtask}
              sentence={sentence}
              taskTitle={`上のオレンジ色でハイライトされた文について，妥当な根拠が周囲に書かれていますか？選択肢の中から一つ選んで回答してください．`}
              withReason={true}
              reasonText="「妥当な根拠が書かれている」と回答した場合，「どの文章を読んで，そう判断したのか」を簡単に述べてください．「根拠は書かれているが，妥当とはいえない」もしくは「妥当な根拠が書かれていない」と回答した場合，「どのように文章を改善すれば，根拠を持たせられるか」を簡単に述べてください．"
            />
          ))
          .exhaustive()}
      </div>
      <div className="collapse mt-4 collapse-open">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-base-200">
          <span className="font-bold">※ タスク注意事項</span>
        </div>
        <div className="collapse-content bg-base-300">
          <ul>
            <li>本ページでは，ブラウザの「戻る」「更新」は利用できません．</li>
            <li>タスク途中で，本ページを離脱することはご遠慮ください．</li>
            <li>一度回答したタスクは，修正できません．</li>
            <li>
              本ページを開いたまま，別のタブやウィンドウで，タスクに回答するためのウェブ検索などを行うことは問題ございません．
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
