import { RoleKind, MicrotaskKinds } from "@prisma/client";
import { hash } from "argon2";

export const roleData = [
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
] as { id: number; kind: RoleKind }[];

export const userData = async () => {
  return [
    {
      crowdId: "admin",
      roleId: 1,
      password: await hash("password"),
    },
    {
      crowdId: "writer",
      roleId: 2,
      password: await hash("password"),
    },
    {
      crowdId: "worker",
      roleId: 3,
      password: await hash("password"),
    },
  ];
};

export const documentData = [
  {
    id: 1,
    title: "夜明け前",
    body: "木曾路はすべて山の中である。\nあるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた",
    authorId: 2,
  },
  {
    id: 2,
    title: "人間失格",
    body: "恥の多い生涯を送って来ました。 \n 自分には、人間の生活というものが、見当つかないのです。 \n 自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやはり、実利的な必要から案出せられたものではなく、地上の車に乗るよりは、地下の車に乗ったほうが風がわりで面白い遊びだから、とばかり思っていました。恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまた",
    authorId: 2,
  },
];

export const documentIds = documentData.map((d) => d.id);

export const deafultMicrotasks = (
  [
    {
      title: "意見と事実の切り分け",
      kind: MicrotaskKinds.CHECK_OP_OR_FACT,
    },
    {
      title: "事実に対する文献情報の有無の確認",
      kind: MicrotaskKinds.CHECK_FACT_RESOURCE,
    },
    {
      title: "意見に対して，それを裏付ける事実が書かれているかの確認",
      kind: MicrotaskKinds.CHECK_OPINION_VALIDNESS,
    },
  ] as { title: string; kind: MicrotaskKinds }[]
).map(({ title, kind }) => {
  return { title, kind };
});
