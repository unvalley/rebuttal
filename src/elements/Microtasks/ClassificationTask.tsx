import { MicrotaskKinds, Paragraph, Sentence } from ".prisma/client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useWizard } from "react-use-wizard";
import { trpc } from "../../lib/trpc";
import type { ExtendedMicrotask } from "../../types/MicrotaskResponse";
import { useCompleteMicrotask } from "./hooks/useCompleteMicrotask";
import { match } from "ts-pattern";

type Props = {
  microtask: ExtendedMicrotask;
  sentence: Sentence;
  taskTitle: string;
  withReason?: boolean;
  reasonText?: string;
  actions?: React.ReactNode;
};

export const ClassficationTask: React.FC<Props> = (props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { nextStep, isLastStep, isLoading } = useWizard();
  const [now, _setNow] = useState(new Date());
  const { value, setValue, reason, setReason, complete } = useCompleteMicrotask(
    {
      userId: session?.user.id as number,
      microtaskId: props.microtask.id,
      sentenceId: props.sentence.id,
      microtaskKind: props.microtask.kind,
      startedAt: now,
    }
  );

  const findParagraphWithDocumentQuery = trpc.paragraphs.findManyById.useQuery({
    id: props.microtask.paragraphId,
  });

  if (isLoading || findParagraphWithDocumentQuery.isLoading) {
    return <p>Loading..</p>;
  }

  if (findParagraphWithDocumentQuery.isError) {
    return (
      <p>
        予期せぬエラーが発生しました．大変申し訳ございませんが，時間をおいて再度タスクを開始いただくようお願いいたします．
      </p>
    );
  }

  const { data } = findParagraphWithDocumentQuery;

  const isAnswered = (kind: MicrotaskKinds) => {
    if (kind === MicrotaskKinds.CHECK_OPINION_VALIDNESS) {
      return Boolean(value) && reason;
    } else {
      return Boolean(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await complete().then(() => {
        nextStep();
        if (isLastStep) {
          router.push("/teachers/tasks/done");
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  const sentenceOrParagraph =
    props.microtask.kind === MicrotaskKinds.CHECK_OP_OR_FACT
      ? "文"
      : "パラグラフ";

  return (
    <div className="">
      <p>
        ある学生が
        <span className="font-bold">【{data?.document.title}】</span>
        というレポート課題に取り組み，レポートを執筆しました． 次の
        {sentenceOrParagraph}は，学生のレポートから切り出された
        {sentenceOrParagraph}です．
      </p>

      {/* タスクに関わらず，全てセンテンスに対して紐付ける */}
      <div className="mt-4">
        <blockquote className="">
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
        </blockquote>
      </div>

      <div className="mt-4">
        <DocumentModal
          sentenceId={props.sentence.id}
          documentTitle={data.document.title}
          paragraphsWithSentences={data.paragraphs}
        />
      </div>

      <div className="mt-4 mr-auto">
        <form onSubmit={handleSubmit}>
          <span className="font-semibold text-xl">
            {/* 回答：下記のいずれかを選択してください． */}
            {props.taskTitle}
          </span>
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
              <span className="font-semibold text-xl">
                上記の回答理由を簡単に述べてください．
              </span>
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

          <div className="mt-6">
            <span className="font-semibold">タスク実施のためのガイド</span>
            <ul>
              {match(props.microtask.kind)
                .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => (
                  <>
                    <li>
                      意見：何事かについて，文章の執筆者が下す判断．執筆者の考えのこと．
                    </li>
                    <li>事実：実際に起こった，または起こっている事柄．</li>
                  </>
                ))
                .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
                  <li>事実：実際に起こった，または起こっている事柄．</li>
                ))
                .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () => (
                  <li>
                    意見：何事かについて，文章の執筆者が下す判断．執筆者の考えのこと．
                  </li>
                ))
                .exhaustive()}
            </ul>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className={`btn ${
                isAnswered(props.microtask.kind) ? "btn-active" : "btn-disabled"
              }`}
            >
              回答して次のタスクへ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DocumentModal: React.FC<{
  sentenceId: number;
  paragraphsWithSentences: (Paragraph & {
    sentences: Sentence[];
  })[];
  documentTitle?: string;
}> = ({ documentTitle, sentenceId, paragraphsWithSentences }) => {
  if (!paragraphsWithSentences?.length) {
    return <p>文章が取得できませんでした．</p>;
  }

  return (
    <div>
      <label htmlFor="modal" className="btn btn-outline btn-sm">
        文書全体を表示する
      </label>
      <input type="checkbox" id="modal" className="modal-toggle" />

      <label htmlFor="modal" className="modal cursor-pointer">
        <label className="modal-box relative w-11/12 max-w-5xl" htmlFor="">
          <span>
            レポート課題：
            <span className="font-bold text-base">{documentTitle}</span>
          </span>
          <div className="pt-4">
            {paragraphsWithSentences.map((p) => {
              return (
                <span key={p.id}>
                  &nbsp; &nbsp;
                  {p.sentences.map((s) => (
                    <span
                      key={s.id}
                      className={`
                  ${s.id === sentenceId ? "bg-emerald-100" : ""}`}
                    >
                      {s.body}
                    </span>
                  ))}
                  <br />
                </span>
              );
            })}
          </div>
        </label>
      </label>
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
    message: "根拠として妥当な情報源が書かれている",
    radioColor: "checked:bg-orange-500",
  },
  {
    value: "LOW_RELIABILITY",
    message: "情報源は書かれているが，妥当とはいえない",
    radioColor: "checked:bg-blue-500",
  },
  {
    value: "FALSE",
    message: "情報源は書かれていない",
    radioColor: "checked:bg-slate-600",
  },
] as const;

const opValidnessCandidates = [
  {
    value: "TRUE",
    message: "妥当な根拠が書かれている",
    radioColor: "checked:bg-orange-500",
  },
  {
    value: "LOW_RELIABILITY",
    message: "根拠は書かれているが，妥当とはいえない",
    radioColor: "checked:bg-blue-500",
  },
  {
    value: "FALSE",
    message: "根拠が書かれていない",
    radioColor: "checked:bg-slate-600",
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
