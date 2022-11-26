import type { Microtask, Paragraph, Sentence } from "@prisma/client";

export type MicrotaskWithParagraph = Microtask & { paragraph: Paragraph };

export type ExtendedMicrotask = Microtask & {
  paragraph: Paragraph & {
    sentences: Sentence[];
  };
};
