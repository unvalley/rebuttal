import { Editor } from "../Editor";

interface DocumentProps {
  title: string;
  body: string;
  canEdit: boolean;
}

export const Document: React.FC<DocumentProps> = (props) => {
  return (
    <div className="bg-base-100">
      <div className="font-bold">{props.title || "Untitled"}</div>
      <Editor
        sentences={[
          { body: "aaaaaaaaaaaaa", kind: "OPINION" },
          { body: "bbbbbb", kind: "FACT" },
        ]}
      />
    </div>
  );
};
