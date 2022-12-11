import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { ExtendedMicrotask } from "../../../types/MicrotaskResponse";
import { useCompleteMicrotask } from "../hooks/useCompleteMicrotask";

type Props = {
  microtask: ExtendedMicrotask;
  sentence: Sentence;
  taskTitle?: string;
  withReason?: boolean;
  reasonText?: string;
  actions?: React.ReactNode;
};

const highlightByIsFact = (pred: boolean) =>
  pred ? "bg-blue-200" : "bg-orange-200";

export const ClassficationTask: React.FC<Props> = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { nextStep, isLastStep, isLoading } = useWizard();
  const { value, setValue, reason, setReason, complete } = useCompleteMicrotask(
    {
      userId: session?.user.id as number,
      microtaskId: props.microtask.id,
      sentenceId: props.sentence.id,
      microtaskKind: props.microtask.kind,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await complete().then(() => {
        if (confirm("回答を送信しました。次のタスクに進みます。")) {
          nextStep();
          if (isLastStep) {
            router.push("/workers/tasks/done");
          }
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  if (isLoading) {
    <p>Loading..</p>;
  }

  return (
    <div className="">
      <span className="text-xl font-semibold">{props.taskTitle}</span>
      {/* タスクに関わらず，全てセンテンスに対して紐付ける */}
      <div className="mt-4">
        <span className="">
          {props.microtask.kind === MicrotaskKinds.CHECK_OP_OR_FACT ? (
            <>{props.sentence.body}</>
          ) : (
            <>
              {/* MicroTask(2)/(3)では，パラグラフを表示する */}
              {props.microtask.paragraph.sentences.map((s) => (
                <span
                  key={s.id}
                  className={
                    s.id === props.sentence.id
                      ? highlightByIsFact(s.isFact === true)
                      : ""
                  }
                >
                  {s.body}
                </span>
              ))}
            </>
          )}
        </span>
      </div>

      <div className="mt-4">
        <label htmlFor="modal" className="btn btn-outline btn-sm">
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
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    value="OPINION"
                    checked={value === "OPINION"}
                    className="radio checked:bg-orange-500"
                    onChange={() => setValue("OPINION")}
                  />
                  <span className="label-text text-lg ml-2">意見</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    value="FACT"
                    checked={value === "FACT"}
                    className="radio checked:bg-blue-500"
                    onChange={() => setValue("FACT")}
                  />
                  <span className="label-text text-lg ml-2">事実</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    value="UNKNOWN"
                    checked={value === "UNKNOWN"}
                    className="radio checked:bg-slate-600"
                    onChange={() => setValue("UNKNOWN")}
                  />
                  <span className="label-text text-lg ml-2">
                    どちらでもない
                  </span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    value="TRUE"
                    checked={value === "TRUE"}
                    className="radio checked:bg-orange-500"
                    onChange={() => setValue("TRUE")}
                  />
                  <span className="label-text text-lg ml-2">書かれている</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    value="FALSE"
                    checked={value === "FALSE"}
                    className="radio checked:bg-blue-500"
                    onChange={() => setValue("FALSE")}
                  />
                  <span className="label-text text-lg ml-2">
                    書かれていない
                  </span>
                </label>
              </div>
            </>
          )}
          {/* 理由 */}
          {props.withReason && (
            <div className="form-control mt-4">
              <span className="label-text text-lg">{props.reasonText}</span>
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
