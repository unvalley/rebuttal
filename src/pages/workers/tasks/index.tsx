import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { Wizard } from "react-use-wizard";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import type { Session } from "next-auth";
import type { ExtendedMicrotask } from "../../../types/MicrotaskResponse";

const Tasks = () => {
  const { data: session } = useSession();
  // TOOD: sessionのnull対応
  const microtasksQuery = trpc.microtasks.findMicrotasksToAssign.useQuery(
    {
      userId: session?.user.id as number,
      assignCount: 5,
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
  // const isMicrotaskAssigned = assignedMicrotasks?.length !== 0;
  // const hasDoneAllAssignedMicrotasks =
  //   assignedMicrotasks && assignedMicrotasks?.length >= 1;
  // NOTE: [].every() return true
  // assignedMicrotasks.every((m) => m.status === MicrotaskStatus.DONE);

  return (
    <div className="container mx-auto">
      <div>
        <h2 className="text-2xl font-bold">ワーカー向けタスク実施ページ</h2>
        <span>ここでは、文書改善タスクを行っていただきます。</span>
      </div>

      <div className="grid grid-cols-6 mt-4">
        {/* Left Column */}
        <div className="col-span-4">
          <div className="bg-base-100">
            {assignedMicrotasks && (
              <MicrotaskAssigned
                session={session}
                microtasks={assignedMicrotasks}
              />
            )}
            {/**
            // !hasDoneAllAssignedMicrotasks ? (
              <MicrotaskAssigned microtasks={assignedMicrotasks} />
            // ) : (
            //   <>
            //     {hasDoneAllAssignedMicrotasks === true && (
            //       <p>再度タスクを行っていただきありがとうございます．</p>
            //     )}
            //     <MicrotaskUnassigned
            //       session={session}
            //       assign={assignMicrotasks}
            //       errorMessage={assignErrorMessage}
            //     />
            //   </>
            // )}
             */}
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
                      {/* <div>対象センテンス(ID={}): </div> */}
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
  session: Session;
  microtasks: ExtendedMicrotask[];
}> = (props) => {
  return (
    <div>
      <p>
        実際にやる回数：
        {props.microtasks
          .flatMap((m) => m.paragraph.sentences.length)
          .reduce((sum, e) => sum + e, 0)}
      </p>
      <Wizard>
        {props.microtasks.map((microtask) => {
          const sentences = microtask.paragraph.sentences;
          return sentences.map((s) => (
            <MicrotaskDescription
              key={microtask.id}
              microtask={microtask}
              sentence={s}
            />
          ));
        })}
      </Wizard>
    </div>
  );
};

// const MicrotaskUnassigned: React.FC<{
//   session: Session;
//   errorMessage: string;
//   assign: (session: Session) => Promise<void>;
// }> = ({ session, assign, errorMessage }) => {
//   const [loading, setLoading] = useState(false);
//   const handleClick = async () => {
//     setLoading(true);
//     await assign(session)
//       .then(() => {
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   };

//   return (
//     <div>
//       <div className="text-md">タスクがまだ割り当てられていません</div>
//       <p>ボタンを押すと，タスクが割り当てられます．</p>
//       {errorMessage && <p className="text-red-600">{errorMessage}</p>}
//       <div className="">
//         {loading ? (
//           <button className="btn btn-square loading"></button>
//         ) : (
//           <button className="btn mt-4" onClick={handleClick}>
//             割り当てを行う
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
