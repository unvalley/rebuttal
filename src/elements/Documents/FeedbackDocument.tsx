import type { AggregatedResultsBySentence } from "../../types/MicrotaskResponse";
import { Alert } from "../Parts/Alert";

type DocumentProps = {
  title: string;
  body: string;
  aggregatedResults: AggregatedResultsBySentence[];
  sentenceSelection: {
    selectedSentenceId: number | undefined;
    setSelectedSentenceId: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
  };
  scrollToFeedback: (sentenceId: number) => void;
  canEdit: boolean;
};

const borderByIsFact = (isFact: boolean) => {
  return isFact
    ? "border-b-2 border-indigo-300 border-b-indigo-300"
    : "border-b-2 border-orange-300 border-b-orange-300";
};

const highlightByIsFact = (isFact: boolean) => {
  return isFact ? "bg-indigo-100" : "bg-orange-100";
};

export const FeedbackDocument: React.FC<DocumentProps> = ({
  title,
  body,
  aggregatedResults,
  sentenceSelection,
  scrollToFeedback,
}) => {
  const { selectedSentenceId, setSelectedSentenceId } = sentenceSelection;
  const isSelected = (sentenceId: number) => selectedSentenceId === sentenceId;

  return (
    <div className="bg-base-100">
      <div className="font-semibold">{title || "Untitled"}</div>
      {aggregatedResults.length === 0 && (
        <Alert message="まだフィードバックが得られていません．" alertClass="" />
      )}
      <div className="mt-4">
        {aggregatedResults.length === 0 && <p>{body}</p>}
        {aggregatedResults.map((s) => {
          return (
            <span
              key={s.sentenceId}
              className={`
                mx-1
                ${borderByIsFact(s.isFact)}
                ${isSelected(s.sentenceId) && highlightByIsFact(s.isFact)}
              `}
              onClick={() => scrollToFeedback(s.sentenceId)}
              onMouseEnter={() => {
                setSelectedSentenceId(s.sentenceId);
              }}
              onMouseLeave={() => setSelectedSentenceId(undefined)}
            >
              {s.sentence?.body}
            </span>
          );
        })}
      </div>
    </div>
  );
};
