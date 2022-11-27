import React, { useState } from "react";
import { trpc } from "../../../lib/trpc";
import { Layout } from "../../../elements/Layout";
import { Document } from "../../../elements/Documents/Document";
import NextError from "next/error";
import { useRouter } from "next/router";
import { ScreenLoading } from "../../../elements/Parts/Loading";
import { MICROTASKS } from "../../../../constants/microtasks";

const Documents = () => {
  const router = useRouter();
  const { id } = router.query;
  const documentId = Number(id);
  // TODO: more safety
  // TODO: invalidate cache
  const documentQuery = trpc.documents.findWithSentencesById.useQuery(
    {
      id: documentId,
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const [selectedSentenceId, setSelectedSentenceId] = useState<
    number | undefined
  >(undefined);

  if (documentQuery.error) {
    return (
      <NextError
        title={documentQuery.error.message}
        statusCode={documentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const aggregatedResultsQuery =
    trpc.microtask_results.findAggregatedMicrotaskResultsByDocumentId.useQuery(
      {
        documentId: documentId,
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  if (aggregatedResultsQuery.error) {
    return (
      <NextError
        title={aggregatedResultsQuery.error.message}
        statusCode={aggregatedResultsQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const microtasksQuery = trpc.microtasks.findManyByDocumentId.useQuery(
    {
      documentId,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (microtasksQuery.error) {
    return (
      <NextError
        title={microtasksQuery.error.message}
        statusCode={microtasksQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (
    documentQuery.isLoading ||
    microtasksQuery.isLoading ||
    aggregatedResultsQuery.isLoading
  ) {
    return <ScreenLoading />;
  }

  const { data: aggregatedResults } = aggregatedResultsQuery;
  const { data: document } = documentQuery;
  const { data: microtasks } = microtasksQuery;
  const resultCount = microtasks
    .flatMap((m) => m.microtaskResults.length)
    .reduce((sum, e) => sum + e, 0);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメントフィードバックページ</h2>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">情報</div>
          </div>
          {/* <p className="text-red-600 font-bold">
            センテンス数: {document.sentences.length}
          </p> */}
          <div className="py-4">
            <div className="bg-orange-100">
              オレンジ色のハイライト箇所: 意見
            </div>
            <div className="bg-blue-100">青色のハイライト箇所: 事実</div>
          </div>
          <p>他になにか必要な情報があれば、ここに書き加えます。</p>
        </div>

        <div className="col-span-4">
          <div className="bg-base-200 p-2">
            <div className="font-bold">レポート</div>
          </div>
          <Document
            title={document.title}
            body={document.body}
            aggregatedResults={aggregatedResults}
            sentenceSelection={{ selectedSentenceId, setSelectedSentenceId }}
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
            {/* // fix style */}
            <div className="overflow-scroll" style={{ height: "700px" }}>
              {[...aggregatedResults].map((result, idx) => (
                <div
                  key={idx}
                  className={`my-4 card card-compact w-full bg-base-100 shadow-md 
                      ${
                        selectedSentenceId === result.sentenceId
                          ? "shadow-emerald-400"
                          : ""
                      }
                  `}
                  onMouseEnter={() => setSelectedSentenceId(result.sentenceId)}
                  onMouseLeave={() => setSelectedSentenceId(undefined)}
                >
                  <div className={`card-body`}>
                    <div className="card-title font-semibold text-sm">
                      対象センテンス「({result.sentence?.body})」(id=
                      {result.sentenceId})へのフィードバック
                    </div>

                    <div className="mt-2">
                      <div className="font-semibold">
                        {MICROTASKS.CHECK_FACT_RESOURCE}
                      </div>
                      {result.opinonValidnessResults.map((o, idx) => (
                        <div key={idx}>
                          <p>値: {o.value}</p>
                          <p>根拠: {o.reason}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="font-semibold">
                        {MICROTASKS.CHECK_OPINION_VALIDNESS}
                      </div>
                      {result.resourceCheckResults.map((o, idx) => (
                        <div key={idx}>
                          <p>値: {o.value}</p>
                          <p>根拠: {o.reason}</p>
                        </div>
                      ))}
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
