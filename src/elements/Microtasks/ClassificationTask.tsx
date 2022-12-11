import { MicrotaskKinds, Sentence } from ".prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { useCompleteMicrotask } from "./hooks/useCompleteMicrotask";

type Props = {
  microtask: ExtendedMicrotask;
  sentence: Sentence;
  taskTitle?: string;
  withReason?: boolean;
  reasonText?: string;
  actions?: React.ReactNode;
};

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
        nextStep();
        if (isLastStep) {
          router.push("/workers/tasks/done");
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
          {getSelectCandidatesByKind(props.microtask.kind).map((c) => (
            <div key={c.value} className="form-control">
              <label className="label cursor-pointer justify-start">
                <input
                  type="radio"
                  value={c.value}
                  checked={value === c.value}
                  className={`radio ${c.radioColor}`}
                  onChange={() => setValue(c.value)}
                />
                <span className="label-text text-lg ml-2">{c.message}</span>
              </label>
            </div>
          ))}
          {/* 理由 */}
          {props.withReason && (
            <div className="form-control mt-4">
              <span className="">{props.reasonText}</span>
              <textarea
                className="textarea textarea-accent"
                placeholder="回答理由を記述"
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

const highlightByIsFact = (pred: boolean) =>
  pred ? "bg-blue-200" : "bg-orange-200";

const opOrFactCandidates = [
  {
    value: "OPINION",
    message: "意見",
    radioColor: "checked:bg-orange-500",
  },
  {
    value: "FACT",
    message: "事実",
    radioColor: "checked:bg-blue-500",
  },
  {
    value: "UNKNOWN",
    message: "どちらでもない",
    radioColor: "checked:bg-slate-600",
  },
] as const;

const factResourceCandidates = [
  {
    value: "TRUE",
    message: "書かれている",
    radioColor: "checked:bg-orange-500",
  },
  {
    value: "FALSE",
    message: "書かれていない",
    radioColor: "checked:bg-blue-500",
  },
] as const;

const opValidnessCandidates = [
  {
    value: "TRUE",
    message: "書かれている",
    radioColor: "checked:bg-orange-500",
  },
  {
    value: "FALSE",
    message: "書かれていない",
    radioColor: "checked:bg-blue-500",
  },
] as const;

const getSelectCandidatesByKind = (kind: MicrotaskKinds) => {
  if (kind === MicrotaskKinds.CHECK_OP_OR_FACT) {
    return opOrFactCandidates;
  } else if (kind === MicrotaskKinds.CHECK_FACT_RESOURCE) {
    return factResourceCandidates;
  } else {
    return opValidnessCandidates;
  }
};
