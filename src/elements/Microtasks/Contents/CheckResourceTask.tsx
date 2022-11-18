import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { MicrotaskWithParagraph } from "../../../types/MicrotaskResponse";

type CheckResourceTask = {
  microtask: MicrotaskWithParagraph;
};

export const CheckResourceTask: React.FC<CheckResourceTask> = (props) => {
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
      <span className="text-2xl font-semibold">
        次の文（センテンス）には、文献情報がありますか？
      </span>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
      <div className="text-red-600">検討：全文章表示するべきか</div>
      <div className="font-semibold mt-4">{props.microtask.paragraph.body}</div>
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
    </>
  );
};
