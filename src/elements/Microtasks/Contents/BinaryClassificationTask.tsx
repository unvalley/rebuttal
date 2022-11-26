import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { ExtendedMicrotask } from "../../../types/MicrotaskResponse";
import { useCompleteMicrotask } from "../hooks/useCompleteMicrotask";

type Props = {
  microtask: ExtendedMicrotask;
  // TODO:  使えると確信できたらrequired
  sentence: Sentence;
  taskTitle?: string;
  withReason?: boolean;
  actions?: React.ReactNode;
};

const hightlihgtIfTrue = (pred: boolean) => {
  if (pred) return "bg-blue-200";
  return "";
};

export const BinaryClassficationTask: React.FC<Props> = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { nextStep, isLastStep } = useWizard();

  const { value, setValue, reason, setReason, complete } = useCompleteMicrotask(
    {
      userId: session?.user.id as number,
      microtaskId: props.microtask.id,
      sentenceId: props.sentence.id,
    }
  );

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
    <div className="w-5/6">
      <span className="text-2xl font-semibold">{props.taskTitle}</span>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
      <div className="mt-4">
        {/* タスクに関わらず，全てセンテンスに対して紐付ける */}
        <span className="">
          {props.microtask.kind === MicrotaskKinds.CHECK_OP_OR_FACT ? (
            <>{props.sentence.body}</>
          ) : (
            <>
              {/* MTask(2)/(3)では，パラグラフを表示する */}
              {props.microtask.paragraph.sentences.map((s) => {
                return (
                  <span
                    key={s.id}
                    className={hightlihgtIfTrue(s.id === props.sentence.id)}
                  >
                    {s.body}
                  </span>
                );
              })}
            </>
          )}
        </span>
      </div>

      <div className="mt-4">
        <label htmlFor="modal" className="btn btn-info btn-sm">
          文書全体を表示する
        </label>
        <input type="checkbox" id="modal" className="modal-toggle" />
        <label htmlFor="modal" className="modal cursor-pointer">
          <label className="modal-box relative" htmlFor="">
            <h3 className="text-lg font-bold">タイトル</h3>
            <p className="py-4">WIP</p>
          </label>
        </label>
      </div>

      <div className="mt-8 mr-auto">
        <form onSubmit={handleSubmit}>
          <p>下記のいずれかを選択してください．</p>
          {props.microtask.kind === MicrotaskKinds.CHECK_OP_OR_FACT ? (
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
    </div>
  );
};
