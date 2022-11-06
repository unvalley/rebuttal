import { Microtask, MicrotaskKinds, Sentence } from ".prisma/client";
import { match } from "ts-pattern";
import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";

const randomMicrotaskId = Math.floor(Math.random() * 3 + 1);

const Tasks = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading</div>;
  } else if (status === "unauthenticated" || !session) {
    return <div>Need authentication</div>;
  }

  const utils = trpc.useContext();
  const microtaskWithSentenceQuery = trpc.microtasks.findByUserId.useQuery({
    userId: session.user.id,
  });

  const assignMicrotask = trpc.microtasks.updateToAssign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({
        userId: session.user.id,
      });
    },
  });

  const unassignMicrotask = trpc.microtasks.updateToUnassign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({
        userId: session.user.id,
      });
    },
  });

  if (!microtaskWithSentenceQuery.error) {
    <div>指定されたタスクは存在しません</div>;
  }

  const { data } = microtaskWithSentenceQuery;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Tasks</h2>
      {session && <>Signed in as {session.user?.name}</>}
      {!session && <>Not signed in</>}

      <div className="grid grid-cols-5 gap-2 py-4">
        <div className="col-span-3">
          <div className="card w-full bg-base-100 shadow-md">
            <div className="card-body">
              {data && data.assigneeId ? (
                <div>
                  <div className="card-title text-md">割り当てられたタスク</div>
                  <div className="text-lg">タスク：{data.title}</div>
                  {match(data.kind)
                    .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () => (
                      <MicrotaskDescription microtask={data} />
                    ))
                    .with(
                      MicrotaskKinds.CHECK_IF_OPINION_HAS_VALID_FACT,
                      () => <MicrotaskDescription microtask={data} />
                    )
                    .with(MicrotaskKinds.REVIEW_OTHER_WORKERS_RESULT, () => (
                      <MicrotaskDescription microtask={data} />
                    ))
                    .with(MicrotaskKinds.DISTINGUISH_OPINION_AND_FACT, () => (
                      <MicrotaskDescription microtask={data} />
                    ))
                    .exhaustive()}
                  <div className="card-actions">
                    <button
                      className="btn"
                      onClick={async () => {
                        try {
                          await unassignMicrotask.mutateAsync({
                            id: randomMicrotaskId,
                          });
                        } catch (cause) {
                          console.error(
                            { cause },
                            "Failed to assign microtask"
                          );
                        }
                      }}
                    >
                      割り当てを解除する
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card-title text-md">
                    タスクがまだ割り当てられていません
                  </div>
                  <p>ボタンを押すと，タスクが割り当てられます．</p>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        try {
                          await assignMicrotask.mutateAsync({
                            id: randomMicrotaskId,
                            assigneeId: session.user.id,
                          });
                        } catch (cause) {
                          console.error(
                            { cause },
                            "Failed to assign microtask"
                          );
                        }
                      }}
                    >
                      割り当てを行う
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className="col-span-2">
          <div className="card w-full bg-base-101 shadow-md">
            <div className="card-body">
              <div className="card-title text-xl">あなたの貢献</div>
              <p>これだけの貢献を行いました．</p>
            </div>
          </div>
          <div className="card w-full bg-base-101 shadow-md">
            <div className="card-body">
              <div className="card-title text-xl">ヘルプ</div>
              <ul>
                <li>ヘルプ1</li>
                <li>ヘルプ2</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

const MicrotaskDescription: React.FC<{
  microtask: Microtask & { sentence: Sentence };
}> = ({ microtask }) => {
  return (
    <>
      <span>
        次のセンテンスにおいて，「{microtask.title}」を行ってください．
      </span>
      <div className="font-semibold my-4">{microtask.sentence.body}</div>
      <div className="text-lg">
        <span className="bg-green-100 text-green-800">簡単</span>
        <span className="text-green-700">: 3-5分</span>
      </div>
    </>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
