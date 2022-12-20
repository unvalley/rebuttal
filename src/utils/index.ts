// document.paragraphs → sentences

import { MicrotaskKinds, Paragraph, Sentence } from ".prisma/client";
import { match } from "ts-pattern";
import type { ExtendedMicrotask } from "../types/MicrotaskResponse";

// prismaで取得したdocumentデータ用
export const paragraphsToSentences = (
  paragraphs: (Paragraph & {
    sentences: Sentence[];
  })[]
) => {
  return paragraphs.flatMap((p) => p.sentences);
};

export const filteredSentencesByKind = (
  kind: MicrotaskKinds,
  sentences: Array<Sentence & { isFact?: boolean | undefined }>
) => {
  const res = match(kind)
    .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => sentences)
    .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () =>
      sentences.filter((s) => s.isFact === true)
    )
    .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () =>
      sentences.filter((s) => s.isFact === false)
    )
    .exhaustive();
  return res;
};

export const existsTaksToWork = (assignedMicrotasks: ExtendedMicrotask[]) => {
  const res = assignedMicrotasks.flatMap((microtask) => {
    const sentences = filteredSentencesByKind(
      microtask.kind,
      microtask.paragraph.sentences
    );
    return Boolean(sentences.length);
  });
  return res.some((e) => e === true);
};