import { useRouter } from "next/router";
import { useDistinguishMicrotask } from "./hooks/useDistinguishMicrotask";
import type { MicrotaskWithSentence } from "./MicrotaskDescription";

type DistinguishMicrotaskProps = {
  microtask: MicrotaskWithSentence;
};

export const DistinguishMicrotask: React.FC<DistinguishMicrotaskProps> = (
  props
) => {
  const { opinionOrFact, setOpinionOrFact, handleSubmitOpinionOrFact } =
    useDistinguishMicrotask({
      microtaskId: props.microtask.id,
      sentenceId: props.microtask.sentenceId,
    });

  const router = useRouter();
  return (
    <>
      <span>次の文（センテンス）は、意見と事実のどちらですか？</span>
      <div className="font-semibold mt-4">{props.microtask.sentence.body}</div>
      <div className="w-96">
        <form onSubmit={handleSubmitOpinionOrFact}>
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
            <button
              className="btn"
              onClick={() => {
                if (confirm("タスクを終了しますか？")) {
                  router.push("/workers/tasks/done");
                }
              }}
            >
              回答して実験を終了する
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                confirm("回答を送信しました。次のタスクに進みます。");
                router.reload();
              }}
            >
              回答して次のタスクへ
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
