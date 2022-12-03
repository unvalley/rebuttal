import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { Wizard } from "react-use-wizard";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { MicrotaskKinds, Sentence } from ".prisma/client";
import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../../../types/MicrotaskResponse";

const filteredSentencesByKind = (
  kind: MicrotaskKinds,
  sentences: Array<Sentence & { isFact?: boolean | undefined }>
) => {
  const res = match(kind)
    .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => sentences)
    .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () =>
      sentences.filter((s) => s.isFact === true)
    )
    .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () =>
      sentences.filter((s) => s.isFact === false)
    )
    .exhaustive();
  return res;
};

const Tasks = () => {
  const { data: session } = useSession();
  // TOOD: sessionのnull対応
  const microtasksQuery = trpc.microtasks.findMicrotasksToAssign.useQuery(
    {
      userId: session?.user.id as number,
      assignCount: 2,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  if (session == null) {
    return <p>ログインが必要です</p>;
  }

  if (microtasksQuery.isError) {
    return <p>実行対象のマイクロタスクがありません．</p>;
  }

  if (microtasksQuery.isLoading) {
    return <ScreenLoading />;
  }

  const { data: assignedMicrotasks } = microtasksQuery;

  const existsTaksToWork = (assignedMicrotasks: ExtendedMicrotask[]) => {
    const res = assignedMicrotasks.flatMap((microtask) => {
      const sentences = filteredSentencesByKind(
        microtask.kind,
        microtask.paragraph.sentences
      );
      return Boolean(sentences.length);
    });
    return res.some((e) => e === true);
  };

  return (
    <div className="container mx-auto">
      <div>
        <h2 className="text-2xl font-bold">ワーカー向けタスク実施ページ</h2>
        <span>ここでは、文書改善タスクを行っていただきます。</span>
      </div>

      <div className="grid grid-cols-6 mt-4 gap-4">
        {/* Left Column */}
        <div className="col-span-4">
          <div className="bg-base-100">
            {assignedMicrotasks && existsTaksToWork(assignedMicrotasks) ? (
              <Wizard>
                {assignedMicrotasks.map((microtask) => {
                  const sentences = filteredSentencesByKind(
                    microtask.kind,
                    microtask.paragraph.sentences
                  );
                  return sentences.map((s) => {
                    return (
                      <MicrotaskDescription
                        key={s.id}
                        microtask={microtask}
                        sentence={s}
                      />
                    );
                  });
                })}
              </Wizard>
            ) : (
              <p>現在，実施対象となるタスクがありません．</p>
            )}
          </div>
        </div>
        <div className="col-span-2">
          <div className="">
            <div className="bg-base-200 p-2">
              <div className="font-bold">アサインされたタスク</div>
            </div>
            <div>
              {assignedMicrotasks &&
                assignedMicrotasks.map((task) => (
                  <div
                    key={task.id}
                    className="mt-2 card card-compact w-full bg-base-100 shadow-lg"
                  >
                    <div className="card-body">
                      <div className="card-title font-semibold text-sm">
                        {task.title} (ID={task.id})
                      </div>
                      <div>対象パラグラフ(ID={task.paragraphId}): </div>
                      <div>
                        {task.paragraph.sentences.map((s, idx) => {
                          return (
                            <div key={s.id}>
                              <p>
                                {idx}: {s.body}
                                (事実：
                                {s.isFact === undefined
                                  ? "undefined"
                                  : String(s.isFact)}
                                )
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
