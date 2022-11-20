import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { MicrotaskWithParagraph } from "../../../types/MicrotaskResponse";

export type ReviewTaskProps = {
  microtask: MicrotaskWithParagraph;
};

export const ReviewTask: React.FC<ReviewTaskProps> = (props) => {
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
    <>
      <span className="text-2xl font-semibold">他ワーカーの評価</span>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
      <div className="text-red-600">
        検討：評価対象はワーカーのマイクロタスク。評価タイミングはいつ？評価するために表示する情報は？
      </div>
      <div className="font-semibold mt-4">{props.microtask.paragraph.body}</div>
      <div className="w-96">
        <div className="flex flex-row gap-x-4 mt-4">
          <button
            type="button"
            className="btn bg-slate-500"
            onClick={() => previousStep()}
          >
            戻る（dev Only）
          </button>
          <div>
            <form onSubmit={handleSubmit}>
              <button type="submit" className="btn ">
                回答して次のタスクへ
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
