import React, { createRef, RefObject, useRef, useState } from "react";
import { trpc } from "../../lib/trpc";
import { Layout } from "../../elements/Layout";
import { FeedbackDocument } from "../../elements/Documents/FeedbackDocument";
import { useRouter } from "next/router";
import { ScreenLoading } from "../../elements/Parts/Loading";
import { MICROTASKS } from "../../../constants/microtasks";
import { MyError } from "../../elements/Parts/Error";

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

  const aggregatedResultsQuery =
    trpc.microtask_results.findAggregatedMicrotaskResultsByDocumentId.useQuery(
      {
        documentId,
      },
      {
        refetchOnWindowFocus: false,
      }
    );

  const microtasksQuery = trpc.microtasks.findManyByDocumentId.useQuery(
    {
      documentId,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  if (
    documentQuery.isError ||
    microtasksQuery.isError ||
    aggregatedResultsQuery.isError
  ) {
    console.error(`documentQueryError: ${JSON.stringify(documentQuery.error)}`);
    console.error(
      `microtaskQueryError: ${JSON.stringify(microtasksQuery.error)}`
    );
    console.error(
      `aggregatedResultQueryError: ${JSON.stringify(
        aggregatedResultsQuery.error
      )}`
    );
    return <MyError />;
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

  // console.log(aggregatedResults.map((e) => e.opinonValidnessResults));

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
      <h2 className="text-xl font-bold">論述改善フィードバックページ</h2>
      <div className="grid grid-cols-8 gap-2 mt-4">
        <div className="col-span-4">
          <div className="bg-base-200 p-2">
            <div className="font-bold">レポート</div>
          </div>
          <FeedbackDocument
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
                const opinionValidnessCount = getResultCount(
                  result.opinonValidnessResults
                );
                const resourceCheckCount = getResultCount(
                  result.resourceCheckResults
                );

                // 意見と事実の切り分けのみが行われている場合，フィードバック表示は無し
                if (result.isFact && resourceCheckCount.resultCount === 0) {
                  return null;
                }

                if (!result.isFact && opinionValidnessCount.resultCount === 0) {
                  return null;
                }

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
                      {result.isFact ? (
                        <div>
                          <div
                            className={`card-title collapse-title font-light text-base ${
                              isSentenceSelected(result.sentenceId)
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            <span
                              className={`${textColorByIsFact(
                                result.isFact
                              )} text-xs px-1`}
                            >
                              ●
                            </span>
                            <div className="flex items-center justify-end">
                              <span className="text-md font-normal">
                                根拠の欠落
                              </span>
                              <span>・</span>
                              <span className="font-light text-md text-slate-500">
                                信頼できる根拠が必要
                              </span>
                            </div>
                          </div>
                          <div className="collapse-content">
                            <div className="">
                              {result.sentence?.body} (id: {result.sentenceId})
                            </div>
                            <div className="mt-2">
                              <ResourceCheckFeedback
                                count={resourceCheckCount}
                                results={result.resourceCheckResults}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className={`card-title collapse-title font-light text-base ${
                              isSentenceSelected(result.sentenceId)
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            <span
                              className={`${textColorByIsFact(
                                result.isFact
                              )} text-xs px-1`}
                            >
                              ●
                            </span>
                            <div className="flex items-center justify-end">
                              <span className="text-md font-normal">
                                意見の説得性が低い
                              </span>
                              <span>・</span>
                              <span className="font-light text-md text-slate-500">
                                根拠となる事実情報が必要
                              </span>
                            </div>
                          </div>
                          <div className="collapse-content">
                            <div className="">
                              {result.sentence?.body} (id: {result.sentenceId})
                            </div>
                            <div className="mt-2">
                              <OpinionValidnessFeedback
                                count={opinionValidnessCount}
                                results={result.opinonValidnessResults}
                              />
                            </div>
                          </div>
                        </div>
                      )}
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

const OpinionValidnessFeedback: React.FC<{
  count: {
    resultCount: number;
    falseCount: number;
  };
  results: Result[];
}> = ({ count, results }) => {
  return (
    <>
      <div>
        {count.resultCount}
        人が，この文章において，「
        <span className="font-semibold">
          {MICROTASKS.CHECK_OPINION_VALIDNESS}
        </span>
        」を行いました． そのうちの
        {count.falseCount}人が「
        <span className="font-semibold">
          妥当な根拠となる情報が書かれていない
        </span>
        」と述べています． 具体的に，以下のようなフィードバックが得られました．
      </div>
      <div className="mt-4">
        {results.map((o, idx) => (
          <div key={idx}>
            <span className="text-lg">👤 : {o.reason != null && o.reason}</span>
          </div>
        ))}
      </div>
    </>
  );
};

const ResourceCheckFeedback: React.FC<{
  count: {
    resultCount: number;
    falseCount: number;
  };
  results: Result[];
}> = ({ count, results }) => {
  const lowReliabilityCount = results.filter(
    (r) => r.value === "LOW_RELIABILITY"
  ).length;

  return (
    <>
      <div>
        {count.resultCount}
        人が，この文章において，「
        <span className="font-semibold">{MICROTASKS.CHECK_FACT_RESOURCE}</span>
        」を行いました． そのうちの
        {count.falseCount}人が「
        <span className="font-semibold">
          妥当な根拠となる情報が書かれていない
        </span>
        」と述べています．
        <span>
          また，{lowReliabilityCount}
          人が，「根拠は書かれているが妥当ではない」と述べています．
        </span>
      </div>
    </>
  );
};

type Result = {
  value: string;
  reason: string | null;
};
const getResultCount = (results: Result[]) => {
  return {
    falseCount: results.filter((e) => e.value === "FALSE").length,
    resultCount: results.length,
  };
};

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Documents;
