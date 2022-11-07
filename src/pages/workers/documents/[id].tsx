import React, { useEffect } from "react";
// import { useRouter } from "next/router";
import { trpc } from "../../../lib/trpc";
import { Layout } from "../../../elements/Layout";
import { Document } from "../../../elements/Documents/Document";
import NextError from "next/error";
import { useRouter } from "next/router";
import { MicrotaskStatus } from ".prisma/client";

const Documents = () => {
  const router = useRouter();
  const { id } = router.query;
  const documentId = Number(id);
  // TODO: more safety
  // TODO: invalidate cache
  const documentQuery = trpc.documents.findWithSentencesById.useQuery(
    {
      id: documentId,
    }
    // { refetchInterval: 1000 }
  );

  if (documentQuery.error) {
    return (
      <NextError
        title={documentQuery.error.message}
        statusCode={documentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const microtasksQuery = trpc.microtasks.findManyByDocumentId.useQuery({
    documentId,
  });
  if (microtasksQuery.error) {
    return (
      <NextError
        title={microtasksQuery.error.message}
        statusCode={microtasksQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (documentQuery.isLoading || microtasksQuery.isLoading) {
    return <>Loading...</>;
  }

  const { data: document } = documentQuery;
  const { data: microtasks } = microtasksQuery;

  const microtaskCount = microtasks.length;
  const doneMicrotaskCount = microtasks.filter(
    (microtask) => microtask.status === MicrotaskStatus.DONE
  ).length;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ワーカー用ドキュメントページ</h2>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">情報</div>
          </div>
          <p>
            このページでは、学生が書いたレポートに対して、フィードバックタスクを行ってもらいます。
          </p>
          <p>他になにか必要な情報があれば、ここに書き加えます。</p>
        </div>

        <div className="col-span-4">
          <div className="bg-base-200 p-2">
            <div className="font-bold">レポート</div>
          </div>
          <Document
            title={document.title}
            body={document.body}
            sentences={document.sentences}
            canEdit={false}
          />
        </div>

        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">
              タスク ({microtaskCount}件中{doneMicrotaskCount}件が完了済み)
              {microtaskCount === doneMicrotaskCount && "🎊"}
            </div>
          </div>
          <div>
            <div>
              {microtasks.map((task) => (
                <div
                  key={task.id}
                  className="mt-2 card card-compact w-full bg-base-100 shadow-lg"
                >
                  <div className="card-body">
                    <div className="card-title font-semibold text-sm">
                      {task.title}
                    </div>
                    <div>ステータス：{task.status}</div>
                    <div>対象センテンス：{task.sentence.body}</div>
                    <div className="">
                      <span>
                        アサインユーザー：
                        {task.assignee ? task.assignee.name : "未アサイン"}
                      </span>
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

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Documents;
