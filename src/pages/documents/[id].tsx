import React, { createRef, RefObject, useRef, useState } from "react";
import { trpc } from "../../lib/trpc";
import { Layout } from "../../elements/Layout";
import { FeedbackDocument } from "../../elements/Documents/FeedbackDocument";
import { useRouter } from "next/router";
import { ScreenLoading } from "../../elements/Parts/Loading";
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
  // const { data: microtasks } = microtasksQuery;
  // const resultCount = microtasks
  //   .flatMap((m) => m.microtaskResults.length)
  //   .reduce((sum, e) => sum + e, 0);

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
      <div className="collapse mt-4">
        <input type="checkbox" className="peer" />
        <div className="collapse-title bg-base-200">
          <span className="font-bold">説明事項</span>
        </div>
        <div className="collapse-content bg-base-300">
          <p>クラウドワーカに，文章のフィードバックを実施してもらいました．</p>
          <ul>
            <li>1. 各文を「意見」「事実」「どちらともいえない」に切り分ける</li>
            <li>
              2.
              「事実」と区別された文に対して，根拠となる情報源が周囲に書かれているか確認
            </li>
            <li>
              3.
              「意見」と区別された文に対して，妥当な根拠が書かれているか確認．書かれていなければ，どう改善すればよいかを記述．
            </li>
          </ul>
          <p>フィードバックを閲覧してみてください．</p>
        </div>
      </div>

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
            <div className="font-bold">フィードバック</div>
          </div>
          <div>
            {/* // fix style */}
            <div className="overflow-y-scroll" style={{ height: "880px" }}>
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

                const resourceCheckNegativeFeedbackCount =
                  resourceCheckCount.falseCount +
                  resourceCheckCount.lowReliabilityCount;
                const resourceCheckPositiveFeedbackCount =
                  resourceCheckCount.resultCount -
                  resourceCheckNegativeFeedbackCount;

                const shouldFixResourceCheck =
                  resourceCheckNegativeFeedbackCount >=
                  resourceCheckPositiveFeedbackCount;

                if (result.isFact && !shouldFixResourceCheck) {
                  return null;
                }

                const opinionValidnessNegativeFeedbackCount =
                  opinionValidnessCount.falseCount +
                  opinionValidnessCount.lowReliabilityCount;
                const opinionValidnessPositiveFeedbackCount =
                  opinionValidnessCount.resultCount -
                  opinionValidnessNegativeFeedbackCount;

                const shouldFixOpinionValidness =
                  opinionValidnessNegativeFeedbackCount >=
                  opinionValidnessPositiveFeedbackCount;

                if (!result.isFact && !shouldFixOpinionValidness) {
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
                                事実の根拠となる情報源の不足
                              </span>
                              <span>・</span>
                              <span className="font-light text-md text-slate-500">
                                文献情報を探しましょう
                              </span>
                            </div>
                          </div>
                          <div className="collapse-content">
                            <div>
                              <span className="bg-indigo-100">
                                {result.sentence?.body}
                              </span>
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
                              <span className="bg-orange-100 italic font-semibold">
                                {result.sentence?.body}
                              </span>
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
    lowReliabilityCount: number;
  };
  results: Result[];
}> = ({ count, results }) => {
  return (
    <>
      <div>
        上記の文に対して，
        <span className="font-semibold italic">{count.resultCount}</span>人中，
        <span className="font-semibold italic">
          {count.falseCount + count.lowReliabilityCount}
        </span>
        人が「
        <span className="">妥当な根拠が無い</span>
        」と述べています． 具体的に，以下のようなフィードバックが得られました．
      </div>

      <div className="mt-4">
        {results.map((o, idx) => {
          if (o.value === "TRUE") {
            return <></>;
          }
          const answered =
            o.value === "FALSE"
              ? "根拠が書かれていない"
              : "根拠は書かれているが，妥当とはいえない";

          return (
            <div className="mt-3" key={idx}>
              <div className="">
                👤 （<span className="italic">{answered}</span> と回答）:
              </div>
              <div className="font-semibold text-slate-800">
                根拠を持たせられるように，改善するには？：
              </div>
              <span className="text-base text-slate-600">
                {o.reason != null && o.reason}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

const ResourceCheckFeedback: React.FC<{
  count: {
    resultCount: number;
    falseCount: number;
    lowReliabilityCount: number;
  };
  results: Result[];
}> = ({ count }) => {
  return (
    <>
      <div>
        上記の文に対して，
        <span className="font-semibold italic">{count.resultCount}</span>人中，
        <span className="font-semibold italic">
          {count.falseCount + count.lowReliabilityCount}
        </span>
        人が「
        <span className="">妥当な根拠となる情報が書かれていない</span>
        」と述べています．根拠となるデータや参考文献を探して，より説得力を向上させましょう．
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
    lowReliabilityCount: results.filter((e) => e.value === "LOW_RELIABILITY")
      .length,
    resultCount: results.length,
  };
};

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Documents;
