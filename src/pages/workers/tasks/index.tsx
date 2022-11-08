import type { Microtask, Sentence } from ".prisma/client";
import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { useEffect } from "react";
import type { Session } from "next-auth";
import { Wizard } from "react-use-wizard";

// アサインロジックは、5回完了した次のユーザのことも考える必要あり
const Tasks = () => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const { data: microtasks } = trpc.microtasks.findManyByUserId.useQuery({
    userId: session?.user?.id as number,
  });
  const assignMicrotasksMutation =
    trpc.microtasks.assignSomeMicrotasks.useMutation({
      onSuccess() {
        utils.microtasks.findManyByUserId.invalidate({
          userId: session?.user?.id as number,
        });
      },
    });

  const assignMicrotasks = async (session: Session) => {
    try {
      await assignMicrotasksMutation.mutateAsync({
        assigneeId: session.user.id,
      });
    } catch (cause: any) {
      console.error(cause);
    }
  };

  useEffect(() => {
    const f = async (session: Session) => await assignMicrotasks(session);
    if (microtasks?.length === 0 && session) {
      f(session);
    }
  }, []);

  if (microtasks === undefined) {
    <div>Not Found Microtasks</div>;
  }

  const isMicrotaskAssigned = Boolean(microtasks);
  console.log(JSON.stringify(microtasks));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">ワーカー向けタスク実施ページ</h2>
      <span>ここでは、文書改善タスクを行っていただきます。</span>

      <div className="grid grid-cols-6 pt-4">
        {/* Left Column */}
        <div className="col-span-4">
          <div className="w-full bg-base-100">
            {isMicrotaskAssigned && microtasks ? (
              <MicrotaskAssigned microtasks={microtasks} />
            ) : (
              <MicrotaskUnassigned />
            )}
          </div>
        </div>
        {/* Right Column */}
        <div className="col-span-2">
          <div className="">
            <div className="bg-base-200 p-2">
              <div className="font-bold">アサインされたタスク</div>
            </div>
            <div>
              {microtasks &&
                microtasks.map((task) => (
                  <div
                    key={task.id}
                    className="mt-2 card card-compact w-full bg-base-100 shadow-lg"
                  >
                    <div className="card-body">
                      <div className="card-title font-semibold text-sm">
                        {task.title} (ID={task.id})
                      </div>
                      <div>タスクステータス: {task.status}</div>
                      <div>
                        対象センテンス(ID={task.sentenceId}):{" "}
                        {task.sentence.body}
                      </div>
                      <div>対象センテンスの種別: {task.sentence.kind}</div>
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

const MicrotaskAssigned: React.FC<{
  microtasks: Array<Microtask & { sentence: Sentence }>;
}> = (props) => {
  return (
    <div>
      <Wizard>
        {props.microtasks.map((microtask) => (
          <MicrotaskDescription key={microtask.id} microtask={microtask} />
        ))}
      </Wizard>
    </div>
  );
};

const MicrotaskUnassigned: React.FC<{
  assignMicrotask?: () => Promise<void>;
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
