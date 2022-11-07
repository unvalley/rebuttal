import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Highlight from "@tiptap/extension-highlight";
import { Sentence, SentenceKind } from "@prisma/client";

type EditorProps = {
  sentences: Sentence[];
};

const styleHighlightBySentenceKind = (sentences: Sentence[]) =>
  sentences
    .map((sentence) => {
      if (sentence.kind === SentenceKind.OPINION) {
        return `<mark style="background-color: #FDF5E6">${sentence.body}</mark>`;
      } else if (sentence.kind === SentenceKind.FACT) {
        return `<mark style="background-color: #93BCF1">${sentence.body}</mark>`;
      } else {
        return sentence.body;
      }
    })
    .join("");

export const Editor: React.FC<EditorProps> = ({ sentences }) => {
  const editor = useEditor({
    extensions: [StarterKit, Highlight.configure({ multicolor: true })],
    content: styleHighlightBySentenceKind(sentences),
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
};
