import { MicrotaskKinds } from ".prisma/client";
import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { MicrotaskWithParagraph } from "../../../types/MicrotaskResponse";
import { useCompleteMicrotask } from "../hooks/useCompleteMicrotask";

type Props = {
  microtask: MicrotaskWithParagraph;
  taskTitle?: string;
  withReason?: boolean;
  actions?: React.ReactNode;
};

export const BinaryClassficationTask: React.FC<Props> = (props) => {
  const { value, setValue, reason, setReason, complete } = useCompleteMicrotask(
    props.microtask.id
  );
  const { nextStep, isLastStep } = useWizard();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      complete();
      if (confirm("回答を送信しました。次のタスクに進みます。")) {
        nextStep();
        if (isLastStep) {
          router.push("/workers/tasks/done");
        }
      }
    } catch {
      alert("必須項目が入力されていません");
    }
  };

  return (
    <>
      <span className="text-2xl font-semibold">{props.taskTitle}</span>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
      <div className="font-semibold mt-4">{props.microtask.paragraph.body}</div>
      <div className="mt-8 w-5/6 mr-auto">
        <form onSubmit={handleSubmit}>
          <p>下記のいずれかを選択してください．</p>
          {props.microtask.kind ===
          MicrotaskKinds.DISTINGUISH_OPINION_AND_FACT ? (
            <>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-lg">意見</span>
                  <input
                    type="radio"
                    value="OPINION"
                    checked={value === "OPINION"}
                    className="radio checked:bg-orange-500"
                    onChange={() => setValue("OPINION")}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-lg">事実</span>
                  <input
                    type="radio"
                    value="FACT"
                    checked={value === "FACT"}
                    className="radio checked:bg-blue-500"
                    onChange={() => setValue("FACT")}
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-lg">書かれている</span>
                  <input
                    type="radio"
                    value="TRUE"
                    checked={value === "TRUE"}
                    className="radio checked:bg-orange-500"
                    onChange={() => setValue("TRUE")}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text text-lg">書かれていない</span>
                  <input
                    type="radio"
                    value="FALSE"
                    checked={value === "FALSE"}
                    className="radio checked:bg-blue-500"
                    onChange={() => setValue("FALSE")}
                  />
                </label>
              </div>
            </>
          )}
          {/* 理由 */}
          {props.withReason && (
            <div className="form-control mt-4">
              <span className="label-text text-lg">
                上記の回答理由を述べてください．
              </span>
              <textarea
                className="textarea textarea-accent"
                name="textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
          <div className="mt-4">
            <button type="submit" className="btn">
              回答して次のタスクへ
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
