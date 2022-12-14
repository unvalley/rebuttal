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
    title:
      "「生産性」を定義し，志望企業の生産性向上に対して，AIよりもあなたが貢献できる点をアピールせよ",
    body: `志望企業を広告代理店とする．志望企業にとっての生産性を社員1人ひとりが違う意見や視点を持ち，アイデアを交え合うこと．それによって，広告としてアプローチしたい人に焦点を置いた，オリジナルのアイデアを生み出せること，そのクオリティの高さを生産性と定義する．
志望企業が自身を採用するメリットとして，貴社が私を採用するメリットとして，自身の強みを2点挙げる．1点目は，課題解決力である．広告代理店にとっての課題解決は，顧客の商品を売れるようにすることである．そのために，1課題を捉えること，2課題解決の戦略を立てることが必要であると考えられる．私は音楽団にて，全国大会出場を目標に活動していた．その目標に対し，現状とのギャップを把握し，個人の課題とチームの課題を洗い出した．そして，それらに対する解決策となる練習法，コミュニケーション戦略を策定し，実行した．その結果，全国大会出場という目標を達成した．貴社の業務においても，前述の経験を活かし，課題を解決に取り組むことができると考える．
2点目は，観察力である．消費行動を誘発するような広告を創るには，アプローチ対象の行動を深く広く知る必要がある．私は，アパレル接客のアルバイトを約2年半続けており，お客様へのアプローチ前の行動観察や接客中のコミュニケーションによって，ニーズに寄り添った商品提案を行ってきた．また，アルバイトや長期インターンシップ，音楽団での経験を通して，様々な年代，属性の人と関わってきた．これらの経験から身につけた観察力を活かし，顧客視点のアイデア発想に必要な情報収集に取り組むことができると考える．上記の理由から，私を採用することは，貴社にとって有益である．`,
    authorId: 2,
  },
  {
    id: 2,
    title:
      "「生産性」を定義し，志望企業の生産性向上に対して，AIよりもあなたが貢献できる点をアピールせよ",
    body: `志望企業をスタートアップのソフトウェア企業(エンジニア人事採用)とする．インプット(稼働など)に対して，どれほどアウトプット(タスクの消費数)を出すことができるかを生産性と定義する．企業の生産性を高めるためには，優秀な人材を採用することが必要である．優秀な人材とは，単に技術力が高いだけではなく，企業のミッション・ビジョンを理解しタスクにコミットすることができる能力が必要である．
スタートアップの企業では，企業の経営方針などの変化から，求める人材のタイプが変化することも考えられる．その際，AIが学習するデータがその都度適切なデータでない可能性もある．このような場合に，AIでは企業に必要な人材を採用することができないと考える．このようなケースでも，企業内でコミュニケーションをとりつつ，その都度企業にとって必要な人材を判断し採用することができるという点で，AIよりも優れていると考える．人材採用の際には，データには現れない要素をもとに判断することも必要であると考える．例えば，愛想の良さ，言葉遣い，話し方やコミュニケーション能力など，データから判断することは難しく，実際に対面し，話をすることで判断することができる場合も多くあると感じる．このような部分を考慮して人材採用を行うことができるという点で，AIよりも優れていると考える．`,
    authorId: 2,
  },
  {
    id: 3,
    title:
      "「生産性」を定義し，志望企業の生産性向上に対して，AIよりもあなたが貢献できる点をアピールせよ",
    body: `本レポートは，講義中に示された課題に答えることを目的とし，志望企業を設定し，その企業の生産性向上に対してAIよりも貢献できる点について筆者の考えを述べるものである．本レポートの作成にあたり，筆者は志望企業として，カウンセリングを提供する企業を設定する．
カウンセリングを提供する企業において，生産性とはカウンセリングの患者となる対象に対して，効果的な治療を提供することができているかを表すものとする．カウンセリングを提供した患者の数と，患者にとって効果的な処置を施すことができたかの2つの観点があるが，本レポートでは後者を生産性として扱うものとする．効果的なカウンセリングを提供することについて述べる．筆者はAIによるカウンセリングは可能であると考える．悩みの規模によっては，データに基づいた解決策を提示することが効果的であり，AIを効果的に活用することができる．また，自分の力で問題に対処できるように手助けすることであれば，AIを使用することで効果的に行うことができると考える．
しかし，悩みが深いものになるにつれて，カウンセリングには共感が重要視されると考える．この点に関して，筆者はAIによるカウンセリングでは共感を与えることができないと考える．明確な解決策を提供することも重要であるが，共感を前提とするような非合理的な判断が求められる場面においては，AIよりも効果的な処置を施すことができ，生産性に貢献できると考える．以上，企業の生産性向上に対してAIよりも貢献できる点について筆者の考えを述べた．`,
    authorId: 2,
  },
  {
    id: 4,
    title:
      "「生産性」を定義し，志望企業の生産性向上に対して，AIよりもあなたが貢献できる点をアピールせよ",
    body: `まず，「志望企業」と「生産性」の定義を行う．ここで「志望企業」を自動車メーカーであると設定する．この自動車メーカーは従来のような「よりよい車」を作って売る製造業から，「よりよい移動体験」を提供するサービス業への転換を行っているとする．また，「生産性」は，「よりよい移動体験」を提供するビジネスへ変わるために，「資源の投資量に対しての，顧客にとっての新たな価値を発見・定義・提供できた量」と定義する．
私は，顧客の抱える課題を発見する部分でAIよりも高い生産性が出せます．AIはデータから課題を発見できますが，それはデータに現れる課題に限られます．またそもそも，どういったデータがどういった値，特徴を持っているとどんな課題があるのかを定義・解釈する必要もあります．なので，自動車メーカーであり得る例を挙げると，実は1人で運転している時に寂しくて運転に集中できないといった課題があったとして，既存のデータをAIが学習しただけでは発見は難しいと言えます．AIでも複数人で運転しているときの方が，事故率が低いといったデータは発見できるかもしれませんが，それがどういった原因で起きているのか，真の課題は何かを発見することは難しいです．
この真の課題を発見するにはまず，実際に運転をしている人を観察したり，聞き取りをしたりして，共感することである程度こんな課題があるのではないかといった仮説を立てて，その上でその仮設を証明するために必要な新たなデータをどう収集して，どういった結果が出たら仮説が証明，棄却されるのかを設定する必要があります．私は，大学学部時代から講義やビジネスコンテスト，インターンで実際のユーザにインタビューや観察を行って課題を見つける訓練を行って来ました．このユーザに対しての観察，聞き取り，そして共感して真の課題の仮説を立てることは現在のAIには不可能な領域であるため，御社の「生産性」の特に課題発見の部分でAIよりも貢献できると考えています．`,
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
      title: "事実に対する根拠の有無の確認",
      kind: MicrotaskKinds.CHECK_FACT_RESOURCE,
    },
    {
      title: "意見に対する根拠の有無の確認",
      kind: MicrotaskKinds.CHECK_OPINION_VALIDNESS,
    },
  ] as { title: string; kind: MicrotaskKinds }[]
).map(({ title, kind }) => {
  return { title, kind };
});
