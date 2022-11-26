import type { Sentence } from "@prisma/client";

interface DocumentProps {
  title: string;
  body: string;
  sentences: Sentence[];
  selectedData:
    | {
        sentenceId: number;
        paragraphId: number;
        microtaskId: number;
      }
    | undefined;
  canEdit: boolean;
}

const opinionOrFactStyle = (sentenceKind: "OPINION" | "FACT") => {
  if (sentenceKind === "OPINION") return "bg-orange-100";
  if (sentenceKind === "FACT") return "bg-blue-100";
  return "bg-orange-100";
};

export const Document: React.FC<DocumentProps> = (props) => {
  const selectedSentenceStyle = (sentenceId: number) =>
    props.selectedData?.sentenceId === sentenceId ? "bg-emerald-100" : "";

  return (
    <div className="bg-base-100">
      <div className="font-bold">{props.title || "Untitled"}</div>

      {props.sentences.map((s) => {
        return (
          <span
            key={s.id}
            className={`${opinionOrFactStyle(
              "OPINION"
            )} ${selectedSentenceStyle(s.id)}`}
          >
            {s.body}
          </span>
        );
      })}
    </div>
  );
};
