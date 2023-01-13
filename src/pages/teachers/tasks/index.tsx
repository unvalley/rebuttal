import { trpc } from "../../../lib/trpc";
import { useSession } from "next-auth/react";
import { MicrotaskDescription } from "../../../elements/Microtasks/MicrotaskDescription";
import { Wizard } from "react-use-wizard";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { existsTaksToWork, filteredSentencesByKind } from "../../../utils";
import { useRouter } from "next/router";

const Tasks = () => {
  const { data: session } = useSession();
  const router = useRouter();
  // teachers/tasks/?documentId={number}
  const { documentId } = router.query;
  const microtasksQuery =
    trpc.microtasks.findMicrotasksToAssginByDocumentId.useQuery(
      {
        documentId: Number(documentId),
        userId: session?.user.id as number,
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
    return <p>実行対象のタスクがありません．</p>;
  }

  if (microtasksQuery.isLoading) {
    return <ScreenLoading />;
  }

  const { data: assignedMicrotasks } = microtasksQuery;

  return (
    <div className="container mx-auto prose my-8">
      <div>
        <h2 className="text-2xl font-bold">評価タスク実施ページ</h2>
      </div>
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
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <>{page}</>;
};

export default Tasks;
