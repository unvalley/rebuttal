// document.paragraphs → sentences

import type { Paragraph, Sentence } from ".prisma/client";

// prismaで取得したdocumentデータ用
export const paragraphsToSentences = (
  paragraphs: (Paragraph & {
    sentences: Sentence[];
  })[]
) => {
  return paragraphs.flatMap((p) => p.sentences);
};
