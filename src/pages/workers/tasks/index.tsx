import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { Wizard } from "react-use-wizard";
import type { Session } from "next-auth";
import type { MicrotaskWithParagraph } from "../../../types/MicrotaskResponse";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { MicrotaskStatus } from ".prisma/client";

const useAssignMicrotask = (session: Session | null) => {
  const utils = trpc.useContext();

  const assignMicrotasksMutation = trpc.microtasks.assignMicrotasks.useMutation(
    {
      onSuccess() {
        utils.microtasks.findManyByUserId.invalidate({
          userId: session?.user?.id as number,
        });
      },
    }
  );

  const assignMicrotasks = async (session: Session) => {
    try {
      await assignMicrotasksMutation.mutateAsync({
        assigneeId: session.user.id,
        assignCount: 5,
      });
    } catch (cause: any) {
      console.error(cause);
    }
  };
  return { assignMicrotasks };
};

const Tasks = () => {
  const { data: session } = useSession();
  // TOOD: sessionのnull対応
  const { assignMicrotasks } = useAssignMicrotask(session);
  const microtasksQuery = trpc.microtasks.findManyByUserId.useQuery({
    userId: session?.user?.id as number,
  });

  if (session == null) {
    return <p>ログインが必要です</p>;
  }

  if (microtasksQuery.isLoading) {
    return <ScreenLoading />;
  }

  const { data: microtasks } = microtasksQuery;
  const isMicrotaskAssigned = microtasks?.length !== 0;
  const hasDoneAllAssignedMicrotasks =
    microtasks && microtasks.every((m) => m.status === MicrotaskStatus.DONE);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">ワーカー向けタスク実施ページ</h2>
      <span>ここでは、文書改善タスクを行っていただきます。</span>

      <div className="grid grid-cols-6 pt-4">
        {/* Left Column */}
        <div className="col-span-4">
          <div className="w-full bg-base-100">
            {isMicrotaskAssigned &&
            microtasks &&
            !hasDoneAllAssignedMicrotasks ? (
              <MicrotaskAssigned microtasks={microtasks} />
            ) : (
              <>
                {hasDoneAllAssignedMicrotasks === true && (
                  <p>再度タスクを行っていただきありがとうございます．</p>
                )}
                <MicrotaskUnassigned
                  session={session}
                  assign={assignMicrotasks}
                />
              </>
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
                      <div>対象パラグラフ(ID={task.paragraphId}): </div>
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
  microtasks: MicrotaskWithParagraph[];
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
  session: Session;
  assign: (session: Session) => Promise<void>;
}> = ({ session, assign }) => {
  const handleClick = async () => {
    await assign(session);
  };
  return (
    <div>
      <div className="text-md">タスクがまだ割り当てられていません</div>
      <p>ボタンを押すと，タスクが割り当てられます．</p>
      <div className="">
        <button className="btn " onClick={handleClick}>
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
