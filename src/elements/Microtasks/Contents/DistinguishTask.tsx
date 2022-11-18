import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { MicrotaskWithParagraph } from "../../../types/MicrotaskResponse";
import { useDistinguishTask } from "../hooks/useDistinguishOpinionAndFactMicrotask";

type DistinguishTaskProps = {
  microtask: MicrotaskWithParagraph;
  actions?: React.ReactNode;
};

export const DistinguishTask: React.FC<DistinguishTaskProps> = (props) => {
  const { opinionOrFact, setOpinionOrFact, handleSubmitOpinionOrFact } =
    useDistinguishTask({
      microtaskId: props.microtask.id,
      sentenceId: 1, // TODO: sentenceId,
    });
  const { previousStep, nextStep, isLastStep } = useWizard();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitOpinionOrFact();
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
        次の文（センテンス）は、意見と事実のどちらですか？
      </span>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
      <div className="text-red-600">
        検討：なぜ意見なのか、なぜ事実なのか、回答の理由を書かせても良いかもしれない
      </div>
      {/* // センテンスでループ */}
      <div className="font-semibold mt-4">{props.microtask.paragraph.body}</div>
      <div className="w-96">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-lg">意見</span>
              <input
                type="radio"
                value="OPINION"
                checked={opinionOrFact === "OPINION"}
                className="radio checked:bg-orange-500"
                onChange={() => setOpinionOrFact("OPINION")}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-lg">事実</span>
              <input
                type="radio"
                value="FACT"
                checked={opinionOrFact === "FACT"}
                className="radio checked:bg-blue-500"
                onChange={() => setOpinionOrFact("FACT")}
              />
            </label>
          </div>
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
