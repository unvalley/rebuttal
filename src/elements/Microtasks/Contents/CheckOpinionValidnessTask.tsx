import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { MicrotaskWithSentence } from "../MicrotaskDescription";

type CheckOpinionValidnessProps = {
  microtask: MicrotaskWithSentence;
};

export const CheckOpinionValidnessTask: React.FC<CheckOpinionValidnessProps> = (
  props
) => {
  const { previousStep, nextStep, isLastStep } = useWizard();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm("回答を送信しました。次のタスクに進みます。")) {
      nextStep();
      if (isLastStep) {
        router.push("/workers/tasks/done");
      }
    }
  };

  return (
    <div>
      <span className="text-2xl font-semibold">
        次の意見文（意見を表す文）には、それを根拠付ける事実が書かれていますか？
      </span>
      <div className="text-lg">
        <span className="bg-red-100 text-red-800">難しい</span>
        <span className="text-red-700">: 6-8分</span>
      </div>
      <div className="text-red-600">
        検討：周囲の文章を表示しないと実施不可能
      </div>
      <div className="font-semibold mt-4">{props.microtask.sentence.body}</div>
      <div className="w-96">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-x-4 mt-4">
            <button className="btn bg-slate-500" onClick={() => previousStep()}>
              戻る（dev Only）
            </button>
            <button type="submit" className="btn btn-primary">
              回答して次のタスクへ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
