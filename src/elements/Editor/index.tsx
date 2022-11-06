import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Highlight from "@tiptap/extension-highlight";

type EditorProps = {
  sentences: { body: string; kind: string }[];
};

export const Editor: React.FC<EditorProps> = ({ sentences }) => {
  const contents = sentences
    .map((sentence) => {
      if (sentence.kind === "OPINION") {
        return `<mark style="background-color: red">${sentence.body}</mark>`;
      } else if (sentence.kind === "FACT") {
        return `<mark style="background-color: blue">${sentence.body}</mark>`;
      } else {
        return sentence.body;
      }
    })
    .join("");

  const editor = useEditor({
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
    content: contents,
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};
