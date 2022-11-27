import type { AggregatedResultsBySentence } from "../../types/MicrotaskResponse";

interface DocumentProps {
  title: string;
  body: string;
  aggregatedResults: AggregatedResultsBySentence[];
  sentenceSelection:
    | {
        selectedSentenceId: number | undefined;
        setSelectedSentenceId: React.Dispatch<
          React.SetStateAction<number | undefined>
        >;
      }
    | undefined;
  canEdit: boolean;
}

const opinionOrFactStyle = (isFact: boolean) => {
  return isFact ? "bg-blue-100" : "bg-orange-100";
};

export const Document: React.FC<DocumentProps> = (props) => {
  const selectedSentenceStyle = (sentenceId: number) =>
    props.sentenceSelection?.selectedSentenceId === sentenceId
      ? "bg-emerald-100"
      : "";

  return (
    <div className="bg-base-100">
      <div className="font-bold">{props.title || "Untitled"}</div>

      {props.aggregatedResults.map((s) => {
        return (
          <span
            key={s.sentenceId}
            className={`${opinionOrFactStyle(s.isFact)} ${selectedSentenceStyle(
              s.sentenceId
            )}`}
            onMouseEnter={() =>
              props.sentenceSelection?.setSelectedSentenceId(s.sentenceId)
            }
            onMouseLeave={() =>
              props.sentenceSelection?.setSelectedSentenceId(undefined)
            }
          >
            {s.sentence?.body}
          </span>
        );
      })}
    </div>
  );
};
