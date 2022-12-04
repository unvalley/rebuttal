import type { Microtask, Paragraph, Sentence } from "@prisma/client";

export type MicrotaskWithParagraph = Microtask & { paragraph: Paragraph };

export type ExtendedMicrotask = Microtask & {
  paragraph: Paragraph & {
    sentences: Array<Sentence & { isFact?: boolean | undefined }>;
  };
};

export type AggregatedResultsBySentence = {
  sentenceId: number;
  sentence: Sentence | undefined;
  isFact: boolean;
  resourceCheckResults: {
    value: string;
    reason: string | null;
  }[];
  opinonValidnessResults: {
    value: string;
    reason: string | null;
  }[];
};
