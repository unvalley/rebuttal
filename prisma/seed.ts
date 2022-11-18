import { MicrotaskKinds, PrismaClient } from "@prisma/client";
import type { MicroTaskKinds } from "../constants/microtasks";
import { split } from "sentence-splitter";
import { hash } from "argon2";

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
        name: "admin user",
        crowdId: 1,
        roleId: 1,
        password: await hash("adminPassword"),
      },
      {
        name: "writer user",
        crowdId: 2,
        roleId: 2,
        password: await hash("writerPassword"),
      },
      {
        name: "worker user",
        crowdId: 3,
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
        title: "日本国憲法",
        body: "日本国民は、正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたつて自由のもたらす恵沢を確保し、政府の行為によつて再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。そもそも国政は、国民の厳粛な信託によるものであつて、その権威は国民に由来し、その権力は国民の代表者がこれを行使し、その福利は国民がこれを享受する。これは人類普遍の原理であり、この憲法は、かかる原理に基くものである。われらは、これに反する一切の憲法、法令及び詔勅を排除する。日本国民は、恒久の平和を念願し、人間相互の関係を支配する崇高な理想を深く自覚するのであつて、平和を愛する諸国民の公正と信義に信頼して、われらの安全と生存を保持しようと決意した。われらは、平和を維持し、専制と隷従、圧迫と偏狭を地上から永遠に除去しようと努めてゐる国際社会において、名誉ある地位を占めたいと思ふ。われらは、全世界の国民が、ひとしく恐怖と欠乏から免かれ、平和のうちに生存する権利を有することを確認する。われらは、いづれの国家も、自国のことのみに専念して他国を無視してはならないのであつて、政治道徳の法則は、普遍的なものであり、この法則に従ふことは、自国の主権を維持し、他国と対等関係に立たうとする各国の責務であると信ずる。日本国民は、国家の名誉にかけ、全力をあげてこの崇高な理想と目的を達成することを誓ふ。日本国民は、正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたつて自由のもたらす恵沢を確保し、政府の行為によつて再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。そもそも国政は、",
        isRebuttalReady: false,
        authorId: 2,
      },
      {
        id: 2,
        title: "人間失格",
        body: " 恥の多い生涯を送って来ました。 \n 自分には、人間の生活というものが、見当つかないのです。 \n 自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやはり、実利的な必要から案出せられたものではなく、地上の車に乗るよりは、地下の車に乗ったほうが風がわりで面白い遊びだから、とばかり思っていました。恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまた",
        isRebuttalReady: true,
        authorId: 2,
      },
    ],
    skipDuplicates: true,
  });

  const documentIds = [1, 2];

  await createParagraphsByDocumentIds(documentIds);

  // await createSentencesByDocumentIds(documentIds);

  const paragraphs = await prisma.paragraph.findMany({
    where: {
      documentId: { in: documentIds },
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
      { title: "評価", kind: MicrotaskKinds.REVIEW_OTHER_WORKERS_RESULT },
    ] as { title: string; kind: MicroTaskKinds }[]
  ).map(({ title, kind }) => {
    return { title, kind };
  });

  const createMicrotasksInsertData = (
    deafultMicrotasks: { title: string; kind: MicroTaskKinds }[]
  ) =>
    paragraphs.flatMap((paragraph) => {
      return deafultMicrotasks.flatMap((microtask) => {
        return {
          title: microtask.title,
          body: "",
          paragraphId: paragraph.id,
          status: "CREATED",
          kind: microtask.kind,
        } as const;
      });
    });
  const microtasksInsertData = createMicrotasksInsertData(deafultMicrotasks);

  await prisma.microtask.createMany({
    data: microtasksInsertData,
    skipDuplicates: true,
  });
}

// const textToSentences = (text: string) =>
//   split(text).flatMap((s) => {
//     if (s.type !== "Sentence") {
//       return [];
//     }
//     return s.raw;
//   });

const textToParagraphs = (text: string) =>
  split(text).flatMap((s) => {
    if (s.type !== "Paragraph") {
      return [];
    }
    return s.raw;
  });

const createParagraphsByDocumentIds = async (documentIds: number[]) => {
  const docs = await prisma.document.findMany({
    where: {
      id: { in: documentIds },
    },
  });

  // NOTE: document to sentences, create documentId and sentenceBody object
  const documentAndParagraphs = docs.flatMap((doc) => {
    const paragraphs = textToParagraphs(doc.body);
    return paragraphs.flatMap((p) => {
      return {
        documentId: doc.id,
        body: p,
      };
    });
  });

  await prisma.paragraph.createMany({
    data: documentAndParagraphs,
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
