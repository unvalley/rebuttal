import React, { useState } from "react";
import { trpc } from "../../../lib/trpc";
import { Layout } from "../../../elements/Layout";
import { Document } from "../../../elements/Documents/Document";
import NextError from "next/error";
import { useRouter } from "next/router";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { paragraphsToSentences } from "../../../utils";

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
  const [selectedData, setSelectedData] = useState<
    | {
        sentenceId: number;
        paragraphId: number;
        microtaskId: number;
      }
    | undefined
  >(undefined);

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
    return <ScreenLoading />;
  }

  const { data: document } = documentQuery;
  const { data: microtasks } = microtasksQuery;
  const resultCount = microtasks
    .flatMap((m) => m.microtaskResults.length)
    .reduce((sum, e) => sum + e, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ワーカー用ドキュメントページ</h2>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">情報</div>
          </div>
          {/* <p className="text-red-600 font-bold">
            センテンス数: {document.sentences.length}
          </p> */}
          <div className="py-4">
            <p>オレンジ色のハイライト箇所: 意見</p>
            <p>青色のハイライト箇所: 事実</p>
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
            sentences={paragraphsToSentences(document.paragrahs)}
            selectedData={selectedData}
            canEdit={false}
          />
        </div>

        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">
              フィードバック ({resultCount}件が完了済み)
            </div>
          </div>
          <div>
            <div>
              {microtasks.map((task) => (
                <div
                  key={task.id}
                  className={`my-4 card card-compact w-full bg-base-100 shadow-md 
                      ${
                        JSON.stringify(selectedData) ===
                        JSON.stringify({
                          sentenceId: task.sentenceId,
                          paragraphId: task.paragraphId,
                          microtaskId: task.id,
                        })
                          ? "shadow-emerald-400"
                          : ""
                      }
                  `}
                  onMouseEnter={() =>
                    setSelectedData({
                      sentenceId: task.sentenceId,
                      paragraphId: task.paragraphId,
                      microtaskId: task.id,
                    })
                  }
                  onMouseLeave={() => setSelectedData(undefined)}
                >
                  <div className={`card-body`}>
                    <div className="card-title font-semibold text-sm">
                      {task.title}
                    </div>
                    <div>対象パラグラフ：{task.paragraph.body}</div>
                    <div>対象センテンス：{task.sentence.body}</div>
                    <div className="">
                      <span>
                        アサインユーザーID：
                        {task.microtaskResults.map((e) => e.assigneeId)}
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
