import type { Sentence } from "@prisma/client";
import { Editor } from "../Editor";

interface DocumentProps {
  title: string;
  body: string;
  sentences: Sentence[];
  canEdit: boolean;
}

export const Document: React.FC<DocumentProps> = (props) => {
  return (
    <div className="bg-base-100">
      <div className="font-bold">{props.title || "Untitled"}</div>
      <Editor sentences={props.sentences} />
    </div>
  );
};
