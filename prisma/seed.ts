import { PrismaClient } from "@prisma/client";
import { MICROTASKS } from "../constants/microtasks";

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
      },
      {
        name: "writer user",
        crowdId: 2,
        roleId: 2,
      },
      {
        name: "worker user",
        crowdId: 3,
        roleId: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.document.createMany({
    data: [
      {
        id: 1,
        title: "ワーカーが作業開始できないドキュメント",
        body: "意見記述なし",
        isRebuttalReady: false,
        authorId: 2,
      },
      {
        id: 2,
        title: "ワーカーが作業開始できるドキュメント",
        body: "意見記述あり: 恥の多い生涯を送って来ました。 \n 自分には、人間の生活というものが、見当つかないのです。 \n 自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやはり、実利的な必要から案出せられたものではなく、地上の車に乗るよりは、地下の車に乗ったほうが風がわりで面白い遊びだから、とばかり思っていました。恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまた",
        isRebuttalReady: true,
        authorId: 2,
      },
    ],
    skipDuplicates: true,
  });

  const documentIds = [1, 2];
  await createSentencesByDocumentIds(documentIds);

  const sentences = await prisma.sentence.findMany({
    where: {
      documentId: { in: documentIds },
    },
  });

  const deafultMicrotasks = Object.values(MICROTASKS).map((task) => {
    return { title: task };
  });

  const createMicrotasksInsertData = (deafultMicrotasks: { title: string }[]) =>
    sentences.flatMap((sentence) => {
      return deafultMicrotasks.flatMap((microtask) => {
        return {
          title: microtask.title,
          body: "",
          sentenceId: sentence.id,
          status: "CREATED",
        } as const;
      });
    });
  const microtasksInsertData = createMicrotasksInsertData(deafultMicrotasks);

  await prisma.microtask.createMany({
    data: microtasksInsertData,
    skipDuplicates: true,
  });
}

const createSentencesByDocumentIds = async (documentIds: number[]) => {
  const docs = await prisma.document.findMany({
    where: {
      id: { in: documentIds },
    },
  });

  // NOTE: document to sentences, create documentId and sentenceBody object
  const documentAndSentences = docs.flatMap((doc) => {
    const sentences = doc.body.split("\n");
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {});
