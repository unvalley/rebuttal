import { split } from "sentence-splitter";
import { PrismaClient, Sentence } from "@prisma/client";
import type { Document } from "@prisma/client";
import type { MicroTaskKinds } from "../../constants/microtasks";

const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

type RawDocument = { title: string; body: string; authorId: number };

const rawDocumentsToDocuments = (rawDocs: RawDocument[]) => {
  return rawDocs.map((doc) => {
    return {
      title: doc.title,
      body: doc.body,
      isRebuttalReady: true,
      authorId: doc.authorId,
    };
  });
};

const textToSentences = (text: string): string[] =>
  split(text).flatMap((s) => {
    if (s.type !== "Sentence") {
      return [];
    }
    return s.raw;
  });

const createSentencesByDocumentIds = async (documents: Document[]) => {
  // NOTE: document to sentences, create documentId and sentenceBody object
  const documentAndSentences = documents.flatMap((doc) => {
    const sentences = textToSentences(doc.body);
    return sentences.flatMap((sentence) => {
      return {
        documentId: doc.id,
        body: sentence,
      };
    });
  });

  await prisma.sentence.createMany({
    data: documentAndSentences,
    skipDuplicates: true,
  });
};

/**
 * TODO: load raw documents from local or Google Docs API
 */
const loadRawDocuments = () => {
  const rawDocuments = [
    {
      title: "夜明け前",
      body: "木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた",
      authorId: 0,
    },
    {
      title: "日本国憲法",
      body: "日本国民は、正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたつて自由のもたらす恵沢を確保し、政府の行為によつて再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。そもそも国政は、国民の厳粛な信託によるものであつて、その権威は国民に由来し、その権力は国民の代表者がこ",
      authorId: 1,
    },
  ];
  return rawDocuments;
};

const findDocumentsByTitles = async (titles: string[]) => {
  const documents = await prisma.document.findMany({
    where: {
      title: { in: titles },
    },
  });
  return documents;
};

const deafultMicrotasks = (
  [
    { title: "意見と事実の切り分け", kind: "DISTINGUISH_OPINION_AND_FACT" },
    {
      title: "事実に対する文献情報の有無の確認",
      kind: "CHECK_FACT_RESOURCE",
    },
    {
      title: "意見に対して，それを裏付ける事実が書かれているかの確認",
      kind: "CHECK_IF_OPINION_HAS_VALID_FACT",
    },
    { title: "評価", kind: "REVIEW_OTHER_WORKERS_RESULT" },
  ] as { title: string; kind: MicroTaskKinds }[]
).map(({ title, kind }) => {
  return { title, kind };
});

const createMicrotasksInsertData = (
  sentences: Sentence[],
  deafultMicrotasks: { title: string; kind: MicroTaskKinds }[]
) =>
  sentences.flatMap((sentence) => {
    const microtasks = [...Array(3)].flatMap(() => {
      return deafultMicrotasks.flatMap((microtask) => {
        return {
          title: microtask.title,
          body: "",
          sentenceId: sentence.id,
          status: "CREATED",
          kind: microtask.kind,
        } as const;
      });
    });
    return microtasks;
  });
/**
 * text to document, and store document to `documents table`
 * split each document stored `documents table` to sentences
 * store sentences to `sentences table`
 */
async function main() {
  const rawDocuments = loadRawDocuments();
  const docs = rawDocumentsToDocuments(rawDocuments);

  await prisma.document.createMany({
    data: docs,
    skipDuplicates: true,
  });

  const documentsFromDb = await findDocumentsByTitles(docs.map((e) => e.title));
  createSentencesByDocumentIds(documentsFromDb);
  const documentIds = documentsFromDb.map((e) => e.id);
  const sentences = await prisma.sentence.findMany({
    where: {
      documentId: { in: documentIds },
    },
  });

  const microtasksInsertData = createMicrotasksInsertData(
    sentences,
    deafultMicrotasks
  );

  await prisma.microtask.createMany({
    data: microtasksInsertData,
  });
}

main().finally(async () => {});
