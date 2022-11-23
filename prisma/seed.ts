import { MicrotaskKinds, PrismaClient } from "@prisma/client";
import type { MicroTaskKinds } from "../constants/microtasks";
import { hash } from "argon2";
import { parse } from "@textlint/text-to-ast";
import type { TxtNode } from "@textlint/ast-node-types";
import { split } from "sentence-splitter";

const prisma = new PrismaClient({
  log: ["query", "error", "info", "warn"],
});

async function main() {
  await prisma.role.createMany({
    data: [
      {
        id: 1,
        kind: "ADMIN",
      },
      {
        id: 2,
        kind: "WRITER",
      },
      {
        id: 3,
        kind: "WORKER",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.user.createMany({
    data: [
      {
        crowdId: "admin",
        roleId: 1,
        password: await hash("adminPassword"),
      },
      {
        crowdId: "writer",
        roleId: 2,
        password: await hash("writerPassword"),
      },
      {
        crowdId: "worker",
        roleId: 3,
        password: await hash("workerPassword"),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.document.createMany({
    data: [
      {
        id: 1,
        title: "夜明け前",
        body: "木曾路はすべて山の中である。\nあるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた",
        isRebuttalReady: false,
        authorId: 2,
      },
      {
        id: 2,
        title: "人間失格",
        body: "恥の多い生涯を送って来ました。 \n 自分には、人間の生活というものが、見当つかないのです。 \n 自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやはり、実利的な必要から案出せられたものではなく、地上の車に乗るよりは、地下の車に乗ったほうが風がわりで面白い遊びだから、とばかり思っていました。恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまた",
        isRebuttalReady: true,
        authorId: 2,
      },
    ],
    skipDuplicates: true,
  });

  const documentIds = [1, 2];

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

  const deafultMicrotasks = (
    [
      {
        title: "意見と事実の切り分け",
        kind: MicrotaskKinds.DISTINGUISH_OPINION_AND_FACT,
      },
      {
        title: "事実に対する文献情報の有無の確認",
        kind: MicrotaskKinds.CHECK_FACT_RESOURCE,
      },
      {
        title: "意見に対して，それを裏付ける事実が書かれているかの確認",
        kind: MicrotaskKinds.CHECK_IF_OPINION_HAS_VALID_FACT,
      },
    ] as { title: string; kind: MicroTaskKinds }[]
  ).map(({ title, kind }) => {
    return { title, kind };
  });

  const createMicrotasksInsertData = (
    deafultMicrotasks: { title: string; kind: MicroTaskKinds }[]
  ) => {
    return paragraphs.flatMap((paragraph) => {
      return deafultMicrotasks.flatMap((microtask) => {
        if (microtask.kind === MicrotaskKinds.DISTINGUISH_OPINION_AND_FACT) {
          const tasks = paragraph.sentences.flatMap((sentence) => {
            return {
              title: microtask.title,
              body: "",
              sentenceId: sentence.id,
              paragraphId: paragraph.id,
              kind: microtask.kind,
            } as const;
          });
          return tasks;
        } else {
          const tasks = [
            {
              title: microtask.title,
              body: "",
              sentenceId: paragraph.sentences[0]?.id as number,
              paragraphId: paragraph.id,
              kind: microtask.kind as MicrotaskKinds,
            } as const,
          ];
          return tasks;
        }
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
