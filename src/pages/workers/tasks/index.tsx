import type { Microtask, Sentence } from ".prisma/client";
import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";

const randomMicrotaskId = Math.floor(Math.random() * 3 + 1);

const Tasks = () => {
  const { data: session, status } = useSession();
  const utils = trpc.useContext();
  const microtaskWithSentenceQuery = trpc.microtasks.findByUserId.useQuery({
    userId: session?.user.id as number,
  });
  const _assigneMicrotask = trpc.microtasks.updateToAssign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({
        userId: session?.user.id as number,
      });
    },
  });
  const assignMicrotask = async () => {
    try {
      await _assigneMicrotask.mutateAsync({
        id: randomMicrotaskId,
        assigneeId: session?.user.id as number,
      });
    } catch (cause) {
      console.error({ cause }, "Failed to assign microtask");
    }
  };
  const _unassignMicrotask = trpc.microtasks.updateToUnassign.useMutation({
    async onSuccess() {
      await utils.microtasks.findByUserId.invalidate({
        userId: session?.user.id as number,
      });
    },
  });
  const unassignMicrotask = async () => {
    try {
      await _unassignMicrotask.mutateAsync({
        id: randomMicrotaskId,
      });
    } catch (cause) {
      console.error({ cause }, "Failed to assign microtask");
    }
  };

  if (!microtaskWithSentenceQuery.error) {
    <div>指定されたタスクは存在しません</div>;
  }

  if (status === "loading") {
    return <div>Loading</div>;
  } else if (status === "unauthenticated" || !session) {
    return <div>Need authentication</div>;
  }

  const { data } = microtaskWithSentenceQuery;
  const isMicrotaskAssigned = data?.assigneeId === session?.user.id;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">ワーカー向けタスク実施ページ</h2>
      <span>ここでは、文書改善タスクを行っていただきます。</span>

      <div className="grid grid-cols-6 pt-4">
        <div className="col-span-4">
          <div className="w-full bg-base-100">
            {isMicrotaskAssigned ? (
              <MicrotaskAssigned
                microtask={data}
                unassignMicrotask={unassignMicrotask}
              />
            ) : (
              <MicrotaskUnassigned assignMicrotask={assignMicrotask} />
            )}
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">タスク実施履歴</div>
          </div>
          <div>タスクを実施していません。</div>
        </div>
      </div>
    </div>
  );
};

const MicrotaskAssigned: React.FC<{
  unassignMicrotask: () => Promise<void>;
  microtask: Microtask & { sentence: Sentence };
}> = ({ microtask }) => {
  return (
    <div>
      <MicrotaskDescription microtask={microtask} />
    </div>
  );
};

const MicrotaskUnassigned: React.FC<{
  assignMicrotask: () => Promise<void>;
}> = ({ assignMicrotask }) => {
  return (
    <div>
      <div className="text-md">タスクがまだ割り当てられていません</div>
      <p>ボタンを押すと，タスクが割り当てられます．</p>
      <div className="">
        <button className="btn btn-primary" onClick={assignMicrotask}>
          割り当てを行う
        </button>
      </div>
    </div>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
