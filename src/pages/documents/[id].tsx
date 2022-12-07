import React, { createRef, RefObject, useRef, useState } from "react";
import { trpc } from "../../lib/trpc";
import { Layout } from "../../elements/Layout";
import { Document } from "../../elements/Documents/Document";
import NextError from "next/error";
import { useRouter } from "next/router";
import { ScreenLoading } from "../../elements/Parts/Loading";
import { MICROTASKS } from "../../../constants/microtasks";

const textColorByIsFact = (isFact: boolean) => {
  return isFact ? "text-indigo-400" : "text-orange-400";
};

const Documents = () => {
  const router = useRouter();
  const { id } = router.query;
  const documentId = Number(id);
  const listRefs = useRef<RefObject<HTMLDivElement>[]>([]);

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
        documentId,
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

  aggregatedResults.forEach((r) => {
    listRefs.current[r.sentenceId] = createRef();
  });

  const scroll = (sentenceId: number) => {
    try {
      listRefs.current[sentenceId]?.current?.focus();
    } catch {
      console.error(`cannot access to sentenceId=${sentenceId}`);
    }
  };

  const isSentenceSelected = (sentenceId: number) => {
    return selectedSentenceId === sentenceId;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメントフィードバックページ</h2>
      <div className="grid grid-cols-8 gap-2">
        {/* <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">情報</div>
          </div>
          {/* <p className="text-red-600 font-bold">
            センテンス数: {document.sentences.length}
          </p> */}
        {/* <div className="py-4">
            <div className="bg-orange-100">
              オレンジ色のハイライト箇所: 意見
            </div>
            <div className="bg-blue-100">青色のハイライト箇所: 事実</div>
          </div>
          <p>他になにか必要な情報があれば、ここに書き加えます。</p>
        </div> */}

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
            scrollToFeedback={scroll}
          />
        </div>

        <div className="col-span-4">
          <div className="bg-base-200 p-2">
            <div className="font-bold">
              フィードバック ({resultCount}件が完了済み)
            </div>
          </div>
          <div>
            {/* // fix style */}
            <div className="overflow-scroll" style={{ height: "740px" }}>
              {aggregatedResults.map((result, idx) => {
                // リファクタ & 数によって見せるか否か
                const opinionValidnessCount = {
                  falseCount: result.opinonValidnessResults.filter(
                    (e) => e.value === "FALSE"
                  ).length,
                  resultCount: result.opinonValidnessResults.length,
                };
                const resourceCheckCount = {
                  falseCount: result.resourceCheckResults.filter(
                    (e) => e.value === "FALSE"
                  ).length,
                  resultCount: result.resourceCheckResults.length,
                };

                return (
                  <div
                    key={idx}
                    tabIndex={idx}
                    className={`my-4 mx-4 card bg-base-100 shadow-xl collapse
                      ${
                        isSentenceSelected(result.sentenceId)
                          ? "shadow-slate-300 bg-stone-50 border-1 border-stone-100"
                          : ""
                      }
                  `}
                    ref={listRefs.current[result.sentenceId]}
                    onMouseEnter={() =>
                      setSelectedSentenceId(result.sentenceId)
                    }
                    onMouseLeave={() => setSelectedSentenceId(undefined)}
                  >
                    <div className="card-body p-0">
                      <div
                        className={`card-title collapse-title font-light text-base ${
                          isSentenceSelected(result.sentenceId)
                            ? "font-semibold"
                            : ""
                        }`}
                      >
                        <span
                          className={`
                        ${textColorByIsFact(result.isFact)} text-xs px-1`}
                        >
                          ●
                        </span>
                        <div className="flex items-center justify-end">
                          <span className="text-md font-normal">
                            {result.isFact ? "文献情報の欠落" : "意見が弱い"}
                          </span>
                          <span>・</span>
                          <span className="font-light text-md text-slate-500">
                            {result.isFact
                              ? "信頼できる文献情報が必要"
                              : "妥当な根拠が必要"}
                          </span>
                        </div>
                      </div>

                      <div className="collapse-content">
                        <div className="">
                          {result.sentence?.body} (id: {result.sentenceId})
                        </div>
                        <div className="mt-2">
                          {result.isFact ? (
                            <>
                              <div>
                                {resourceCheckCount.resultCount}
                                人が、この文章において、「
                                <span className="font-semibold">
                                  {MICROTASKS.CHECK_FACT_RESOURCE}
                                </span>
                                」を行いました。 そのうちの
                                {resourceCheckCount.falseCount}人が「
                                <span className="font-semibold">
                                  妥当な根拠となる情報が書かれていない
                                </span>
                                」と述べています。
                                具体的に、以下のようなフィードバックが得られました。
                              </div>
                              <div className="mt-4">
                                {result.resourceCheckResults.map((o, idx) => (
                                  <div key={idx}>
                                    <span className="text-lg">
                                      👤 : {o.reason != null && o.reason}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                {opinionValidnessCount.resultCount}
                                人が、この文章において、「
                                <span className="font-semibold">
                                  {MICROTASKS.CHECK_OPINION_VALIDNESS}
                                </span>
                                」を行いました。 そのうちの
                                {opinionValidnessCount.falseCount}人が「
                                <span className="font-semibold">
                                  妥当な根拠となる情報が書かれていない
                                </span>
                                」と述べています。
                                具体的に、以下のようなフィードバックが得られました。
                              </div>
                              <div className="mt-4">
                                {result.opinonValidnessResults.map((o, idx) => (
                                  <div key={idx}>
                                    <span className="text-lg">
                                      👤 : {o.reason != null && o.reason}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
