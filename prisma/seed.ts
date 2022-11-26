import { MicrotaskKinds, PrismaClient } from "@prisma/client";
import { parse } from "@textlint/text-to-ast";
import type { TxtNode } from "@textlint/ast-node-types";
import { split } from "sentence-splitter";
import {
  userData,
  roleData,
  documentData,
  documentIds,
  deafultMicrotasks,
} from "./data";

const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

async function main() {
  await prisma.role.createMany({
    data: roleData,
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: await userData(),
    skipDuplicates: true,
  });

  await prisma.document.createMany({
    data: documentData,
    skipDuplicates: true,
  });

  await createParagraphsByDocumentIds(documentIds);
  await createSentencesByDocumentIds(documentIds);

  const paragraphs = await prisma.paragraph.findMany({
    where: {
      documentId: { in: documentIds },
    },
    include: {
      sentences: true,
    },
  });

  const createMicrotasksInsertData = (
    deafultMicrotasks: { title: string; kind: MicrotaskKinds }[]
  ) => {
    return paragraphs.flatMap((paragraph) => {
      return deafultMicrotasks.flatMap((microtask) => {
        return {
          title: microtask.title,
          body: "",
          paragraphId: paragraph.id,
          kind: microtask.kind as MicrotaskKinds,
        };
      });
    });
  };

  const microtasksInsertData = createMicrotasksInsertData(deafultMicrotasks);

  await prisma.microtask.createMany({
    data: microtasksInsertData,
    skipDuplicates: true,
  });
}

const textToParagraphs = (text: string) => {
  const ast = parse(text);
  const children = ast["children"] as Array<TxtNode>;
  return children.flatMap((c) => {
    if (c.type == "Paragraph") {
      return c.raw;
    }
    return [];
  });
};

const textToSentences = (text: string) => {
  return split(text).flatMap((c) => {
    if (c.type === "Sentence") {
      return c.raw;
    }
    return [];
  });
};

const createParagraphsByDocumentIds = async (documentIds: number[]) => {
  const docs = await prisma.document.findMany({
    where: {
      id: { in: documentIds },
    },
  });

  // NOTE: document to sentences, create documentId and sentenceBody object
  const documentAndSentences = docs.flatMap((doc) => {
    const paragraphs = textToParagraphs(doc.body);
    return paragraphs.flatMap((p) => {
      return {
        documentId: doc.id,
        body: p,
      };
    });
  });

  await prisma.paragraph.createMany({
    data: documentAndSentences,
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});

const createSentencesByDocumentIds = async (documentIds: number[]) => {
  const paragraphs = await prisma.paragraph.findMany({
    where: {
      documentId: { in: documentIds },
    },
  });

  const documentAndSentences = paragraphs.flatMap((p) => {
    return textToSentences(p.body).map((b) => {
      return {
        body: b,
        paragraphId: p.id,
      };
    });
  });

  await prisma.sentence.createMany({
    data: documentAndSentences,
    skipDuplicates: true,
  });
};
