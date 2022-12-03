import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { Wizard } from "react-use-wizard";
import { ScreenLoading } from "../../../elements/Parts/Loading";
// import { useBeforeUnload } from "react-use";
// import { useRouter } from "next/router";
// import { useEffect } from "react";

// const useLeavePageConfirmation = (
//   showAlert = true,
//   message = "入力した内容がキャンセルされますがよろしいでしょうか？"
// ) => {
//   useBeforeUnload(showAlert, message);
//   const router = useRouter();
//   useEffect(() => {
//     const handler = () => {
//       if (showAlert && !window.confirm(message)) {
//         throw "キャンセル";
//       }
//     };
//     router.events.on("routeChangeStart", handler);
//     return () => {
//       router.events.off("routeChangeStart", handler);
//     };
//   }, [showAlert, message, router.events]);
// };

const Tasks = () => {
  const { data: session } = useSession();
  // useLeavePageConfirmation();

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
            {assignedMicrotasks && (
              <div>
                <Wizard>
                  {assignedMicrotasks.map((microtask) => {
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
                            <p key={s.id}>
                              {idx}: {s.body}
                            </p>
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
